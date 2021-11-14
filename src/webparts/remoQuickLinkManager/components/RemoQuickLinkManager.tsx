import * as React from 'react';
import { useState } from 'react';
import styles from './RemoQuickLinkManager.module.scss';
import { IRemoQuickLinkManagerProps } from './IRemoQuickLinkManagerProps';
import { escape } from '@microsoft/sp-lodash-subset';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { IItemAddResult } from "@pnp/sp/items";
import * as $ from 'jquery';
import { SPComponentLoader } from '@microsoft/sp-loader';
import swal from 'sweetalert';
import { Web } from "@pnp/sp/presets/all";
import { IListItem } from './IListItem';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

export interface IRemoQuickLinkManagerState {
  items:any[];
  ExistingQuickLinksCount:any;
  BgBanner:any[];
  MyQuickLinksPrefference:any[];  
  ExistingQL:any[];
  MyQLinksArray:any[];
  AvailableSpaceCount:number;
}

let ExistingQlinks = [];
let MyQlinkArr = [];
let NewWeb = Web("https://remodigital.sharepoint.com/sites/ClientPOC/");

var reactHandler = this;
const SortableItem = SortableElement(({value,i}) =>  {
 
  return(
  <li onMouseEnter={function(event){ShowDeletedBtn()}} onMouseLeave={function(event){HideDeletedBtn()}} value={value.ID} tabIndex={i} className="qlink-with-index"> 
  <input type="hidden" className="hdn-item-id" value={value.ID}></input>
    <a href="#"> <img src={JSON.parse(value.Items.ImageHover).serverRelativeUrl} alt="image"/>
      <h5> {value.Items.Title} </h5>  
      <div className="delete-quicklinks" onMouseEnter={()=>DeleteMyQuickLink(value.ID)}>
        <img src="https://remodigital.sharepoint.com/sites/ClientPOC/SiteAssets/Remo%20Portal%20Assets/img/remove_q.svg" alt="image" />
      </div>
    </a>
  </li>  
  );
});

const SortableList = SortableContainer(({items}) => {  
  return (
    <ul className="qq-links-part clearfix my-qlink-block">
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} i={index} value={value}/>
      ))}

      <li onClick={function(event){EnableEditMode()}} id="edit-mode-enabler"> <a href="#" className="add-quicklinks-link">  <img src="https://remodigital.sharepoint.com/sites/ClientPOC/SiteAssets/Remo%20Portal%20Assets/img/Plus-Add-Qlink.png" alt="image"/>
        <h5> Quick Links </h5>  </a>
      </li>
    </ul>
  );
});

export default class RemoQuickLinkManager extends React.Component<IRemoQuickLinkManagerProps, IRemoQuickLinkManagerState, {}> {  
  public constructor(props: IRemoQuickLinkManagerProps, state: IRemoQuickLinkManagerState){
   super(props);
  this.state = {
      items: [] ,
      ExistingQuickLinksCount: 0,
      BgBanner:[],
      MyQuickLinksPrefference:[],      
      ExistingQL:[],
      MyQLinksArray:[],
      AvailableSpaceCount:5
    };
  }

  public componentDidMount(){
    $('#spCommandBar').attr('style', 'display: none !important');
    $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');

    this.getcurrentusersQuickLinksForEdit();    
  }

  public GetAllQuickLinks(){
    var AllID = "";
    var ApiUrl = "";
    for(var i = 0; i < ExistingQlinks.length; i++){    
      if(ExistingQlinks.length != 0){  
        let LastIndex = ExistingQlinks.length-1;
        if(i == LastIndex){
          AllID += "Id ne "+ExistingQlinks[i].ItemId+"";
        }else{
          AllID += "Id ne "+ExistingQlinks[i].ItemId+" and ";
        }   
      }
    }
    if(ExistingQlinks.length != 0){
      ApiUrl = `${this.props.siteurl}/_api/web/lists/getbytitle('Quick Links')/items?$select=Title,ID,URL,Image,ImageHover,ImageHover&$filter=IsActive eq '1' and ${AllID}&$orderby=Order0 asc`
    }else{
      ApiUrl = `${this.props.siteurl}/_api/web/lists/getbytitle('Quick Links')/items?$select=Title,ID,URL,Image,ImageHover,ImageHover&$filter=IsActive eq 1&$orderby=Order0 asc`
    }
    
    var reactHandler = this;
    $.ajax({
    url: ApiUrl,
    type: "GET",
    headers:{'Accept': 'application/json; odata=verbose;'},
    success: function(resultData) {
      reactHandler.setState({
        items: resultData.d.results
      });      
    },
    error : function(jqXHR, textStatus, errorThrown) {
    }
    });
  }

  public getcurrentusersQuickLinksForEdit(){        
    var reactHandler = this;
    let UserID = this.props.userid;
    let ITemID = null;
    ExistingQlinks = [];
    $.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('UsersQuickLinks')/items?$select=ID,SelectedQuickLinks/Id,Author/Id&$filter=Author/Id eq '${UserID}'&$expand=SelectedQuickLinks,Author&$orderby=Order0 asc&$top=5`,
      type: "GET",
      headers:{'Accept': 'application/json; odata=verbose;'},
      success: function(resultData) {
        reactHandler.setState({
          MyQuickLinksPrefference: resultData.d.results
        });
        for(var i = 0; i< resultData.d.results.length; ){
          var MasterItemID = resultData.d.results[i].SelectedQuickLinks.Id;
          ITemID = resultData.d.results[i].Id;
          ExistingQlinks.push({"ItemId":MasterItemID});

          $.ajax({
            url: `${reactHandler.props.siteurl}/_api/web/lists/getbytitle('Quick Links')/items?$select=ID,Title,URL,Image,ImageHover&$filter=ID eq '${MasterItemID}'&$orderby=Created asc`,
            type: "GET",
            async:false,
            headers:{'Accept': 'application/json; odata=verbose;'},
            success: function(resultData) {
              MyQlinkArr.push({"Items":resultData.d.results[0],"ID":ITemID});   
              reactHandler.setState({MyQLinksArray: MyQlinkArr});
              if(MyQlinkArr.length == 5){
                $("#edit-mode-enabler").hide();
                $("#editMode").hide();
              }else{
                $("#edit-mode-enabler").show();                             
              }  
              i++;       
            },
            error : function(jqXHR, textStatus, errorThrown) {
            }
          });          
        }    
        let QlinkCount = ExistingQlinks.length;
        reactHandler.setState({AvailableSpaceCount: 5 - QlinkCount});
        reactHandler.GetAllQuickLinks();
      },
      error : function(jqXHR, textStatus, errorThrown) {
      }
    });
  }    

  public EnableEditMode(){
    $(".add-quicklinks").addClass("open");
    $("#editMode").show();
  }

  public ExitEditMode(){
    $(".add-quicklinks").removeClass("open");
    $("#editMode").hide();
  }

  public async AddToMyQuickLinkPreference(ItemID){
    const iar: IItemAddResult = await NewWeb.lists.getByTitle("UsersQuickLinks").items.add({
      SelectedQuickLinksId: ItemID
    });    
    MyQlinkArr = [];
    this.setState({MyQLinksArray: []});
    this.getcurrentusersQuickLinksForEdit();
  }

  public async DeleteMyQuickLink(ItemID){
    let list = NewWeb.lists.getByTitle("UsersQuickLinks");
    await list.items.getById(ItemID).delete().then(()=>{      
      MyQlinkArr = [];     
      this.setState({MyQLinksArray: []}); 
      this.getcurrentusersQuickLinksForEdit();
      $("#editMode").show();
      setTimeout(() => {
        $(".add-quicklinks").addClass("open");
      }, 500);      
    });
  }

  public ShowDeletedBtn(){
    $(".delete-quicklinks").addClass("open");
  }

  public HideDeletedBtn(){
    $(".delete-quicklinks").removeClass("open");
  }
  
  public onSortEnd = ({oldIndex, newIndex}) => {
    this.UpdateQuickLinkOrder();
    this.setState({
      MyQLinksArray: arrayMove(this.state.MyQLinksArray, oldIndex, newIndex)
    });    
  };

  public UpdateQuickLinkOrder(){
    let IndexValue:number = null;
    let ItemID:any = null;
    setTimeout(() => {
      $("ul.my-qlink-block li.qlink-with-index").each(function () {
        IndexValue = $(this).prop("tabindex");        
        ItemID = $(this).val();   
        let list = NewWeb.lists.getByTitle("UsersQuickLinks");
        const i = list.items.getById(ItemID).update({
          Order0: IndexValue
        });     
      });
    }, 500);            
  }

  public render(): React.ReactElement<IRemoQuickLinkManagerProps> {    
    
    var reactHandler = this;
    const AllQuickLinks: JSX.Element[] = reactHandler.state.items.map(function(item,key) {
      let RawImageTxt = item.ImageHover;
      if(RawImageTxt != ""){
        var ImgObj = JSON.parse(RawImageTxt);        
          return (          
          <li> 
            <a href="#">   <img src={`${ImgObj.serverRelativeUrl}`} alt="image"/>
              <h5> {item.Title} </h5>  
              <div className="add-quicklinks">
                <img src="https://remodigital.sharepoint.com/sites/ClientPOC/SiteAssets/Remo%20Portal%20Assets/img/add_quick.png" alt="image" onClick={()=>reactHandler.AddToMyQuickLinkPreference(item.ID)} />
              </div>
            </a>
          </li>
        );              
      }
    });
    
      
    return (
      <div className={ styles.remoQuickLinkManager }>
        <section>
          <div className="relative">    
            <div className="section-rigth">
              <div className="inner-banner-header relative m-b-20">
                <div className="inner-banner-overlay"></div>
                <div className="inner-banner-contents">
                  <h1> Manage Quick Links </h1>
                  <ul className="breadcums">
                    <li>  <a href={`${this.props.siteurl}/SitePages/Home.aspx?env=WebView`} data-interception="off"> Home </a> </li>
                    <li>  <a href="#" style={{pointerEvents:"none"}}> Manage Quick Links </a> </li>
                  </ul>
                </div>
              </div>
              <div className="inner-page-contents ">
                <div className="sec">
                  <div className="added-quickis-part">  
                    <div className="heading clearfix">
                      <div className="header-left">
                        Added Quicklinks
                      </div> 
                      <div className="header-right drap-drop-p">
                        <img src="https://remodigital.sharepoint.com/sites/ClientPOC/SiteAssets/Remo%20Portal%20Assets/img/drap_drop.png" alt="image" />  You can drag and drop to change position  
                        <span id="editMode" style={{display:"none"}}><a href="#" onClick={()=>reactHandler.ExitEditMode()}> Exit Edit Mode </a></span>
                      </div> 
                    </div>
                    <div className="section-part">                    

                    <SortableList items={this.state.MyQLinksArray} onSortEnd={this.onSortEnd} axis='x' lockAxis='x'></SortableList>

                    </div>
                  </div>
                  <div className="whole-quickis-part">  
                    <div className="heading clearfix">
                      <div className="header-left">
                        Quicklinks <span> {this.state.AvailableSpaceCount == 0 ? "Delete any quick link to add new" : `Select any ${this.state.AvailableSpaceCount} links to show in a Home page`}  </span>
                      </div>                             
                    </div>
                    <div className="section-part">
                      <ul className="qq-links-part clearfix ">
                        {AllQuickLinks}                                  
                      </ul>
                    </div>
                  </div>
                </div> 
              </div>   
            </div> 
          </div>             
        </section>
      </div>
    );
  }
}
function ShowDeletedBtn() {
  $(".delete-quicklinks").addClass("open");
}

function HideDeletedBtn(){
  $(".delete-quicklinks").removeClass("open");
}
function DeleteMyQuickLink(ID: any) {
  swal({
    title: "Are you sure?",
    text: "Do you want to delete this!",
    icon: "warning",      
    buttons: ["No", "Yes"],    
    dangerMode: true,
} as any)
.then((willDelete) => {
    if (willDelete) {        
      let list = NewWeb.lists.getByTitle("UsersQuickLinks");
      list.items.getById(ID).delete().then(()=>{      
        MyQlinkArr = [];     
        $("#editMode").show();
        setTimeout(() => {
          $(".add-quicklinks").addClass("open");
        }, 500);   
        swal({
          title: "Deleted Successfully",
          icon: "success"         
        } as any).then(()=>{
          location.reload();
        });
      });
    } 
});
}

function EnableEditMode() {
  $(".add-quicklinks").addClass("open");
    $("#editMode").show();
}



