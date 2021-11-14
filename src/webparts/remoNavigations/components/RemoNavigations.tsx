import * as React from 'react';
import styles from './RemoNavigations.module.scss';
import { IRemoNavigationsProps } from './IRemoNavigationsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as $ from 'jquery';
import { Web } from "@pnp/sp/webs";
import { sp } from "@pnp/sp";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import ReactTooltip from "react-tooltip";

export interface IRemoNavigationsState{
  MainNavItems:any[];
  DeptandQuickLinksItems:any[];
  QuickLinkItems:any[];
  SelectedNav:any[];
  showdata:any[];
  showdataqlink:any[];
  IsAdminForContentEditor:boolean;
}

let SelectedDepartments=[];
let BreadCrumb=[];
const ActivePageUrl = (window.location.href.split('?') ? window.location.href.split('?')[0] : window.location.href).toLowerCase();
const NewWeb = Web("https://remodigital.sharepoint.com/sites/ClientPOC/");
export default class RemoNavigations extends React.Component<IRemoNavigationsProps, IRemoNavigationsState, {}> {
  private displayData;
  private displayDataQlink;
  public constructor(props: IRemoNavigationsProps, state: IRemoNavigationsState){  
    super(props);  
    this.displayData = [];
    this.displayDataQlink = [];
    this.appendData = this.appendData.bind(this);
    this.appendDataQLink = this.appendDataQLink.bind(this);

    this.state = { 
      MainNavItems:[],
      DeptandQuickLinksItems:[],
      QuickLinkItems:[],
      SelectedNav:[],
      showdata:[],
      showdataqlink:[],
      IsAdminForContentEditor:false,
    }
  }

  public componentDidMount(){
    BreadCrumb = []; 
    this.GetMainNavItems();
    this.EnableContentEditorForSuperAdmins();
  }
  

  public async EnableContentEditorForSuperAdmins(){
    let groups = await NewWeb.currentUser.groups();
    for(var i=0; i<groups.length;i++){ 
      if(groups[i].Title =="ContentPageEditors"){
        this.setState({IsAdminForContentEditor:true}); //To Show Content Editor on Center Nav to Specific Group Users alone
        //alert("1");
      }else{
        
      }
    }
  }

  public async GetMainNavItems(){
    var reactHandler = this;
    try{
      $.ajax({  
          url: `${this.props.siteurl}/_api/web/lists/getbytitle('Navigations')/items?$select=Title,URL,OpenInNewTab,LinkMasterID/Title,LinkMasterID/Id,URL,HoverOnIcon,HoverOffIcon&$filter=IsActive eq 1&$orderby=Order0 asc&$top=10&$expand=LinkMasterID`,  
          type: "GET",  
          headers:{'Accept': 'application/json; odata=verbose;'},  
          success: function(resultData) {              
            reactHandler.setState({  
              MainNavItems: resultData.d.results                                    
            });   
            $('#root-nav-links ul li').on('click', function(){
              $(this).siblings().removeClass('active');      
              $(this).addClass('active');       
            });                 
          },  
          error : function(jqXHR, textStatus, errorThrown) {  
          }  
      });
    }catch(err){
      console.log("Navigation Main Nav : " + err);
    }
  }

  public GetDepartments(){
    var reactHandler = this;
    reactHandler.displayData=[];
    BreadCrumb=[];
    $(".main-mavigation").siblings().removeClass("submenu");
    $(".main-mavigation").addClass("submenu");
    try{
      $.ajax({         
          url: `${this.props.siteurl}/_api/web/lists/getbytitle('DepartmentsMaster')/items?$select=Title,ID,URL,HasSubDept,OpenInNewTab,PlaceUnder/Title,PlaceUnder/Id&$filter=IsActive eq 1&$orderby=Order0 asc&$expand=PlaceUnder/Id,PlaceUnder`,
          type: "GET",  
          headers:{'Accept': 'application/json; odata=verbose;'},  
          success: function(resultData) {              
            reactHandler.setState({  
              DeptandQuickLinksItems: resultData.d.results                                    
            });    
            for(var i =0; i< resultData.d.results.length; i++){        
              if(resultData.d.results[i].PlaceUnder.Title == undefined){   
              let ID = resultData.d.results[i].Id;
              var Title = resultData.d.results[i].Title;
              var Url = resultData.d.results[i].URL.Url;
              let OpenInNewTab = resultData.d.results[i].OpenInNewTab;
              let HasSubDept = resultData.d.results[i].HasSubDept;
              reactHandler.appendData(ID,Title,OpenInNewTab,HasSubDept,Url);  
              }              
            }  
            $(".submenu-wrap-lists ul li").on("click",function(){
              $(this).siblings().removeClass('active');      
              $(this).addClass('active'); 
            });           
          },  
          error : function(jqXHR, textStatus, errorThrown) {  
          }  
      });
    }catch(err){
      console.log("Navigation Department Link : " + err);
    }
  }

  public GetQuickLinks(){
    var reactHandler = this;
    reactHandler.displayDataQlink=[];
    BreadCrumb=[];
    $(".main-mavigation").siblings().removeClass("submenu");
    $(".main-mavigation").addClass("submenu");
    try{
      $.ajax({  
          url: `${this.props.siteurl}/_api/web/lists/getbytitle('Quick Links')/items?$select=Title,OpenInNewPage,URL&$filter=IsActive eq 1&$orderby=Order0 asc`,  
          type: "GET",  
          headers:{'Accept': 'application/json; odata=verbose;'},  
          success: function(resultData) {              
            reactHandler.setState({  
              QuickLinkItems: resultData.d.results                                    
            }); 
            for(var i =0; i< resultData.d.results.length; i++){           
              var Title = resultData.d.results[i].Title;
              var Url = resultData.d.results[i].URL.Url;
              let OpenInNewTab = resultData.d.results[i].OpenInNewPage;              
              reactHandler.appendDataQLink(Title,OpenInNewTab,Url);                
            }                                 
          },  
          error : function(jqXHR, textStatus, errorThrown) {  
          }  
      });
    }catch(err){
      console.log("Navigation Quick Link : " + err);
    }
  }

  

  public GetSubNodes(ID,Title,ClickFrom,key){ 
    $(".breadcrum-block").show();
    if(ClickFrom == "Breadcrumb"){      
      var IndexValue = key;
      for(var i = 0; i< BreadCrumb.length; i++){
        if(i > IndexValue){
          BreadCrumb.splice(i);
        }        
      }      
    }else{
      BreadCrumb.push({"Title": Title, "ID":ID}); 
    }
      
    var reactHandler = this;
    reactHandler.displayData=[];
    SelectedDepartments.unshift(ID);
    $.ajax({  
        url: `${this.props.siteurl}/_api/web/lists/getbytitle('DepartmentsMaster')/items?$select=Title,ID,URL,HasSubDept,OpenInNewTab,PlaceUnder/Title,PlaceUnder/Id&$filter=IsActive eq 1 and PlaceUnder/Id eq '${ID}'&$orderby=Order0 asc&$expand=PlaceUnder`,  
        type: "GET",  
        async:false,
        headers:{'Accept': 'application/json; odata=verbose;'},  
        success: function(resultData) {  
          reactHandler.setState({  
            DeptandQuickLinksItems: resultData.d.results                                    
          });                     
          for(var i =0; i< resultData.d.results.length; i++){           
            let ItemID = resultData.d.results[i].Id;
            var Title = resultData.d.results[i].Title;
            var Url = resultData.d.results[i].URL.Url;
            let OpenInNewTab = resultData.d.results[i].OpenInNewTab;
            let HasSubDept = resultData.d.results[i].HasSubDept;
            reactHandler.appendData(ItemID,Title,OpenInNewTab,HasSubDept,Url);            
          }                            
        },  
        error : function(jqXHR, textStatus, errorThrown) {  
        }  
    });
  }

  public appendData(ID,Title,OpenInNewTab,HasSubDept,Url) {             
    var reactHandler = this;      
    if(OpenInNewTab == true){
      if(HasSubDept == true){
        reactHandler.displayData.push(<li> 
        <a href={Url} target="_blank" data-interception="off" role="button"> <span>{Title}</span></a>
        <a className={"deptdropdown-"+ID+""} href="#" onClick={() => reactHandler.GetSubNodes(ID,Title,"NavMain"," ")}><img src={`${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/gray_icon.svg`} alt="nav"></img></a>        
        </li>);
      }else{
        reactHandler.displayData.push(<li> 
        <a href={Url} target="_blank" data-interception="off" role="button" > <span>{Title}</span></a>
        </li>);
      }
    }else{
      if(HasSubDept == true){
        reactHandler.displayData.push(<li> 
        <a href={Url} data-interception="off" role="button"> <span>{Title}</span></a>
        <a className={"deptdropdown-"+ID+""} href="#" onClick={() => reactHandler.GetSubNodes(ID,Title,"NavMain"," ")}><img src={`${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/gray_icon.svg`} alt="nav"></img></a>        
        </li>);
      }else{
        reactHandler.displayData.push(<li> 
        <a href={Url} data-interception="off" role="button"> <span>{Title}</span></a>
        </li>);
      }
    }    
    reactHandler.setState({
      showdata : reactHandler.displayData
   });      
 }

 public appendDataQLink(Title,OpenInNewTab,Url) {             
  var reactHandler = this;      
  if(OpenInNewTab == true){    
    reactHandler.displayDataQlink.push(<li> 
      <a href={Url} target="_blank" data-interception="off" role="button"> <span>{Title}</span></a>
    </li>);
  }else{
    reactHandler.displayDataQlink.push(<li> 
      <a href={Url} data-interception="off" role="button"> <span>{Title}</span></a>
    </li>);
  }    
  reactHandler.setState({
    showdataqlink : reactHandler.displayDataQlink
 });      
}

public ClearNavigation(){ 
  BreadCrumb = []; 
  $(".breadcrum-block").hide();
  $(".main-mavigation").removeClass("submenu");
  $('#root-nav-links ul li').siblings().removeClass('active');
  $(".submenu-wrap-lists ul li").siblings().removeClass('active');
  $('#root-nav-links ul li:first-child').addClass('active');
  
  this.displayData=[];
  this.displayDataQlink=[];
}
 

  public render(): React.ReactElement<IRemoNavigationsProps> {
    var handler = this;
    
    const MainNavigations: JSX.Element[] = handler.state.MainNavItems.map(function(item,key){
      let RawImageTxtOn = item.HoverOnIcon;
      let RawImageTxtOff = item.HoverOffIcon;
      if(RawImageTxtOn != null || RawImageTxtOn != undefined && RawImageTxtOff != null || RawImageTxtOff != undefined){
        var ImgObjforON = JSON.parse(RawImageTxtOn);
        var ImgObjforOFF = JSON.parse(RawImageTxtOff);
        if(item.OpenInNewTab == true){          
          if(item.LinkMasterID.Title == "DEPT_00001"){
            return(
              <li> <a href="#" onClick={()=>handler.GetDepartments()}> <img src={`${ImgObjforOFF.serverRelativeUrl}`} alt="img" className="bhover"/><img src={`${ImgObjforON.serverRelativeUrl}`} alt="img" className="hhover"/> <p>{item.Title}</p>  </a>
                <div className="submenu-wrap-lists"> 
                  <div className="submenu-clear-wrap">
                    <a href="#" className="submenu-clear"  data-tip data-for={"React-tooltip-clear"} data-custom-class="tooltip-custom" onClick={()=>handler.ClearNavigation()}>   <img src={`${handler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/clear.svg`} alt="image"/>  </a>
                    <ReactTooltip id={"React-tooltip-clear"} place="right" type="dark" effect="solid">
                      <span>Clear</span>
                    </ReactTooltip>
                  </div>
                  <ul className="clearfix">                                                            
                    {handler.state.showdata}
                  </ul>    
                </div>
              </li>
            );
          }
          if(item.LinkMasterID.Title == "QLINK_00002"){
            return(              
              <li> <a href="#" onClick={()=>handler.GetQuickLinks()}> <img src={`${ImgObjforOFF.serverRelativeUrl}`} alt="img" className="bhover"/><img src={`${ImgObjforON.serverRelativeUrl}`} alt="img" className="hhover"/> <p>{item.Title}</p>  </a> 
                <div className="submenu-wrap-lists"> 
                <div className="submenu-clear-wrap">
                    <a href="#" className="submenu-clear"  data-tip data-for={"React-tooltip-clear"} data-custom-class="tooltip-custom" onClick={()=>handler.ClearNavigation()}>   <img src={`${handler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/clear.svg`} alt="image"/>  </a>
                    <ReactTooltip id={"React-tooltip-clear"} place="right" type="dark" effect="solid">
                      <span>Clear</span>
                    </ReactTooltip>
                  </div>
                  <ul className="clearfix">                                                            
                    {handler.state.showdataqlink}
                  </ul>    
                </div>
              </li>
            );
          }
          if(item.LinkMasterID.Title == undefined){            
            var str2 = item.Title;
            var DomID2 = str2.replace(/[_\W]+/g, "_");
            if(item.Title == "Home"){
              return(
                <li className="active" id={DomID2}> <a href={`${item.URL}`} target="_blank" data-interception="off"> <img src={`${ImgObjforOFF.serverRelativeUrl}`} alt="img" className="bhover"/><img src={`${ImgObjforON.serverRelativeUrl}`} alt="img" className="hhover"/> <p>{item.Title}</p>  </a> </li>
              );
            }else if(item.Title == "Content Editor"){               
              if(handler.state.IsAdminForContentEditor == true){
                return(                
                  <li> <a href={`${item.URL}`} target="_blank" data-interception="off"> <img src={`${ImgObjforOFF.serverRelativeUrl}`} alt="img" className="bhover"/><img src={`${ImgObjforON.serverRelativeUrl}`} alt="img" className="hhover"/> <p>{item.Title}</p>  </a> </li>
                );
              }
            }else{
              return(
                <li id={DomID2}> <a href={`${item.URL}`} target="_blank" data-interception="off"> <img src={`${ImgObjforOFF.serverRelativeUrl}`} alt="img" className="bhover"/><img src={`${ImgObjforON.serverRelativeUrl}`} alt="img" className="hhover"/> <p>{item.Title}</p>  </a> </li>
              );
            }    
          }
        }else{
          if(item.LinkMasterID.Title == "DEPT_00001"){
            return(
              <li> <a href="#" onClick={()=>handler.GetDepartments()}> <img src={`${ImgObjforOFF.serverRelativeUrl}`} alt="img" className="bhover"/><img src={`${ImgObjforON.serverRelativeUrl}`} alt="img" className="hhover"/> <p>{item.Title}</p>  </a>
                <div className="submenu-wrap-lists"> 
                <div className="submenu-clear-wrap">
                    <a href="#" className="submenu-clear"  data-tip data-for={"React-tooltip-clear"} data-custom-class="tooltip-custom" onClick={()=>handler.ClearNavigation()}>   <img src={`${handler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/clear.svg`} alt="image"/>  </a>
                    <ReactTooltip id={"React-tooltip-clear"} place="right" type="dark" effect="solid">
                      <span>Clear</span>
                    </ReactTooltip>
                  </div>
                  <ul className="clearfix">                                                            
                    {handler.state.showdata}
                  </ul>    
                </div>
              </li>
            );
          }
          if(item.LinkMasterID.Title == "QLINK_00002"){
            return(
              <li> <a href="#" onClick={()=>handler.GetQuickLinks()}> <img src={`${ImgObjforOFF.serverRelativeUrl}`} alt="img" className="bhover"/><img src={`${ImgObjforON.serverRelativeUrl}`} alt="img" className="hhover"/> <p>{item.Title}</p>  </a> 
                <div className="submenu-wrap-lists"> 
                <div className="submenu-clear-wrap">
                    <a href="#" className="submenu-clear"  data-tip data-for={"React-tooltip-clear"} data-custom-class="tooltip-custom" onClick={()=>handler.ClearNavigation()}>   <img src={`${handler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/clear.svg`} alt="image"/>  </a>
                    <ReactTooltip id={"React-tooltip-clear"} place="right" type="dark" effect="solid">
                      <span>Clear</span>
                    </ReactTooltip>
                  </div>
                  <ul className="clearfix">                                                            
                    {handler.state.showdataqlink}
                  </ul>    
                </div>
              </li>
            );
          }
          if(item.LinkMasterID.Title == undefined){            
            var str = item.Title;
            var DomID = str.replace(/[_\W]+/g, "_");
            if(item.Title == "Home"){
              return(
                <li className="active" id={DomID}> <a href={`${item.URL}`} data-interception="off"> <img src={`${ImgObjforOFF.serverRelativeUrl}`} alt="img" className="bhover"/><img src={`${ImgObjforON.serverRelativeUrl}`} alt="img" className="hhover"/> <p>{item.Title}</p>  </a> </li>
              );
            }else if(item.Title == "Content Editor"){               
              if(handler.state.IsAdminForContentEditor == true){
                return(                
                  <li> <a href={`${item.URL}`} data-interception="off"> <img src={`${ImgObjforOFF.serverRelativeUrl}`} alt="img" className="bhover"/><img src={`${ImgObjforON.serverRelativeUrl}`} alt="img" className="hhover"/> <p>{item.Title}</p>  </a> </li>
                );
              }
            }else{
              return(
                <li id={DomID}> <a href={`${item.URL}`} data-interception="off"> <img src={`${ImgObjforOFF.serverRelativeUrl}`} alt="img" className="bhover"/><img src={`${ImgObjforON.serverRelativeUrl}`} alt="img" className="hhover"/> <p>{item.Title}</p>  </a> </li>
              );
            }                  
          }
        }
      }
    });


    return (
      <div className={ styles.remoNavigations }>
        <div className="main-mavigation m-b-20">
          <nav className="sec" id="root-nav-links">
            <div className="breadcrum-block">
              {BreadCrumb.map((item,key) => (           
                <a href="#" id="b-d-crumb" data-index={key} onClick={() => handler.GetSubNodes(item.ID,item.Title,"Breadcrumb",key)}>{item.Title}<img src={`${handler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/orange_icon.svg`} alt="nav"></img></a>                
              ))}
            </div>
            <ul className="clearfix">
              {MainNavigations}
            </ul>
          </nav>
          
        </div>
      </div>
    );
  }
}
