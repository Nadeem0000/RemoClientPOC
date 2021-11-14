import * as React from 'react';
import styles from './RemoNewsCategoryBased.module.scss';
import { IRemoNewsCategoryBasedProps } from './IRemoNewsCategoryBasedProps';
import { escape } from '@microsoft/sp-lodash-subset';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as moment from 'moment';
import * as $ from 'jquery';
import { Web } from "@pnp/sp/webs";
//import { Pagination } from "@pnp/spfx-controls-react/lib/pagination";
import { SPComponentLoader } from '@microsoft/sp-loader';
//import { App } from '../components/services/App';
 
export interface IRemoNewsCategoryBasedState{
  Items:any[];  
  Tag:string;
  Department:string;
  SitePageID:number;  
  ActiveMainNewsID:number;
  Mode:string;
  CurrentPage:string;
  RelevantNews:any[];
  AvailableTags:any[];
  AvailableDepts:any[];
  TotalPageCount:number;

  TagBasedNews:any[];
  DeptBasedNews:any[];
}

let NewsAvailableDepts = [];
let DeptNames = [];
let DeptNamesExitsUnique= [];
export default class RemoNewsCategoryBased extends React.Component<IRemoNewsCategoryBasedProps, IRemoNewsCategoryBasedState,{}> {
  constructor(props: IRemoNewsCategoryBasedProps, state: IRemoNewsCategoryBasedState) {
    super(props);

    SPComponentLoader.loadScript('https://code.jquery.com/jquery-3.6.0.min.js', {
      globalExportsName: 'jQuery'
      }).then(() => {
      SPComponentLoader.loadScript('https://cdn.rawgit.com/mrk-j/paginga/v0.8.1/paginga.jquery.min.js', {
      globalExportsName: 'jQuery'
      });
      });      

      this.state = {
        Items: [],
        Tag:"",
        Department:"",
        SitePageID:null,      
        ActiveMainNewsID:null ,
        Mode:""    ,
        CurrentPage:"" ,
        RelevantNews:[],
        AvailableTags:[],
        AvailableDepts:[],
        TotalPageCount: 0,

        TagBasedNews : [],
        DeptBasedNews : []
      };
    }

    public componentDidMount(){
      var reactHandler = this;        
      $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
      const url : any = new URL(window.location.href);
      const ItemID = url.searchParams.get("ItemID");
      const AppliedTage:string = url.searchParams.get("Tag");
      const Dept:string = url.searchParams.get("Dept");
      const SitePageID = url.searchParams.get("SitePageID");
      const Mode = url.searchParams.get("Mode");
      reactHandler.setState({Tag:""+AppliedTage+"",Department:""+Dept+"",SitePageID:SitePageID,ActiveMainNewsID:ItemID,Mode:Mode}); 
      
       
      if(Mode == "TagBased"){
        reactHandler.GetAvailableTags();        
      }else{
        reactHandler.GetAvailableDepts();            
      }                   
    }

    public GetAvailableTags(){
      var handler = this;
      $.ajax({
        url: `${this.props.siteurl}/_api/web/lists/GetByTitle('News')/fields?$filter=EntityPropertyName eq 'Tag'`,
        type: "GET",
        headers: {
          "accept": "application/json;odata=verbose",
        },
        success: function (data) {   
          for(var i = 0; i < data.d.results[0].Choices.results.length; i++){
            handler.setState({AvailableTags:data.d.results[0].Choices.results});
          }    
          handler.GetCategoryBasedNews(handler.state.Mode,handler.state.Tag,handler.state.Department);             
        },
        error: function (error) {
          console.log(JSON.stringify(error));
        }
      });
    }


    public GetAvailableDepts(){            
      NewsAvailableDepts = [];
      DeptNames = [];
      DeptNamesExitsUnique= [];
      var reactHandler = this;
      $.ajax({
        url: `${this.props.siteurl}/_api/web/lists/getbytitle('News')/items?$select=ID,Dept/Id,Dept/Title,Image&$filter=IsActive eq 1&$expand=Dept`,  
        type: "GET",
        headers:{'Accept': 'application/json; odata=verbose;'},
        success: function(resultData) {              
          for(var i = 0; i < resultData.d.results.length; i++){
            var DeptName = resultData.d.results[i].Dept.Title;
            DeptNames.push(DeptName);
		        if(reactHandler.findValueInArray(DeptName,DeptNamesExitsUnique)){

		        }
		        else{
			        if(reactHandler.findValueInArray(DeptName,DeptNames)){
                DeptNamesExitsUnique.push(DeptName);
                let RawImageTxt = resultData.d.results[i].Image;  
                if(RawImageTxt != "" && RawImageTxt != null){              
                  var ImgObj = JSON.parse(RawImageTxt);       
                  var PicUrl = ImgObj.serverRelativeUrl;
                  NewsAvailableDepts.push({"ID" : resultData.d.results[i].Dept.Id , "Title" : resultData.d.results[i].Dept.Title , "URL" : PicUrl});                     
                }			          
              }
            }           
          }                   
          reactHandler.setState({AvailableDepts:NewsAvailableDepts});    
          reactHandler.GetCategoryBasedNews(reactHandler.state.Mode,reactHandler.state.Tag,reactHandler.state.Department);            
        },
        error : function(jqXHR, textStatus, errorThrown) {
        }
      });
    }

    public GetCategoryBasedNews(Mode,AppliedTage,Dept){      
      var reactHandler = this;
      var APIUrl;
      if(Mode == "TagBased"){
        reactHandler.setState({CurrentPage:AppliedTage});
        APIUrl = `${this.props.siteurl}/_api/web/lists/getbytitle('News')/items?$select=ID,Title,Description,Created,Image,Tag,Dept/Title,DetailsPageUrl,SitePageID/Id,TransactionItemID/Id&$filter=IsActive eq 1 and Tag eq '${AppliedTage}'&$orderby=Created desc&$expand=SitePageID,TransactionItemID,Dept`;
        reactHandler.GetAllOtherRelatedNews(AppliedTage,'TagBased');
      }else{
        reactHandler.setState({CurrentPage:Dept});
        APIUrl = `${this.props.siteurl}/_api/web/lists/getbytitle('News')/items?$select=ID,Title,Description,Created,Image,Tag,Dept/Title,DetailsPageUrl,SitePageID/Id,TransactionItemID/Id&$filter=IsActive eq 1 and Dept/Title eq '${Dept}'&$orderby=Created desc&$expand=SitePageID,TransactionItemID,Dept`;
        reactHandler.GetAllOtherRelatedNews(Dept,'DeptBased');
      }
      $.ajax({
        url: APIUrl,
        type: "GET",
        headers:{'Accept': 'application/json; odata=verbose;'},
        success: function(resultData) {              
          reactHandler.setState({
            Items: resultData.d.results
          });   
          const TotalNews:number = resultData.d.results.length;
          const Count:number = TotalNews / 2;
          const PageCount:number = parseInt(Count.toFixed());          
          reactHandler.setState({TotalPageCount: PageCount});
        },
        error : function(jqXHR, textStatus, errorThrown) {
        }
      });
    }

    

    public GetAllOtherRelatedNews(ReleventCategory,Mode){      
      var reactHandler = this;
      var APIUrl;
      if(Mode == 'TagBased'){        
        for(var i = 0; i < reactHandler.state.AvailableTags.length;i++){
          $.ajax({
            url: `${this.props.siteurl}/_api/web/lists/getbytitle('News')/items?$select=ID,Title,Description,Created,Image,Tag,Dept/Title,DetailsPageUrl,SitePageID/Id,TransactionItemID/Id&$filter=IsActive eq 1 and Tag eq '${reactHandler.state.AvailableTags[i]}'&$orderby=Created desc&$expand=SitePageID,TransactionItemID,Dept`,
            type: "GET",
            headers:{'Accept': 'application/json; odata=verbose;'},
            success: function(resultData) {   
              
              if(resultData.d.results.length != 0 && resultData.d.results[0].Tag != ""+reactHandler.state.Tag+""){
                reactHandler.setState({TagBasedNews:resultData.d.results});
                $('.available-depts-or-tags').append(`<li>
                  <a href="${reactHandler.props.siteurl}/SitePages/News-CategoryBased.aspx?env=WebView&Mode=TagBased&Tag=${resultData.d.results[0].Tag}" data-interception='off' className="clearfix">  
                  <div class="vategory-news-left pull-left">
                      ${resultData.d.results[0].Tag}
                  </div>     
                  <div class="vategory-news-right pull-right">
                      ${resultData.d.results.length}
                  </div>     
                  </a>
                </li>`); 
              }         
            },
            error : function(jqXHR, textStatus, errorThrown) {
            }
          });          
        }
      }else{        
        for(var j = 0; j < reactHandler.state.AvailableDepts.length;j++){
          $.ajax({
            url: `${this.props.siteurl}/_api/web/lists/getbytitle('News')/items?$select=ID,Title,Description,Created,Image,Tag,Dept/Title,DetailsPageUrl,SitePageID/Id,TransactionItemID/Id&$filter=IsActive eq 1 and Dept/Id eq '${reactHandler.state.AvailableDepts[j].ID}'&$orderby=Created desc&$expand=SitePageID,TransactionItemID,Dept`,
            type: "GET",
            headers:{'Accept': 'application/json; odata=verbose;'},
            success: function(resultData) {                 
              if(resultData.d.results.length != 0 && resultData.d.results[0].Dept.Title != ""+reactHandler.state.Department+""){
                reactHandler.setState({DeptBasedNews:resultData.d.results});
                $('.available-depts-or-tags').append(`<li>
                  <a href="${reactHandler.props.siteurl}/SitePages/News-CategoryBased.aspx?env=WebView&Mode=DeptBased&Dept=${resultData.d.results[0].Dept.Title}" data-interception='off' class="clearfix">  
                    <div class="vategory-news-left pull-left">
                        ${resultData.d.results[0].Dept.Title}
                    </div>     
                    <div class="vategory-news-right pull-right">
                        ${resultData.d.results.length}
                    </div>     
                  </a>
                </li>`);
              }         
            },
            error : function(jqXHR, textStatus, errorThrown) {
            }
          });          
        }
      }    
    }

    

    public findValueInArray(value,arr){
      var result = false;     
      for(var i=0; i<arr.length; i++){
        var name = arr[i];
        if(name == value){
          result = true;
          break;
        }
      }
      return result;
    }


    private _getPage(page: number){
      console.log('Page:', page);
      
    }

  public render(): React.ReactElement<IRemoNewsCategoryBasedProps> {
       

    var reactHandler = this;
    var Dt = "";    

    const CategoryBasedNews: JSX.Element[] = this.state.Items.map(function(item,key) {
      let RawImageTxt = item.Image;      
      if(RawImageTxt != "" && RawImageTxt != null){      
      var ImgObj = JSON.parse(RawImageTxt);
      var RawPublishedDt = moment(item.Created).format("DD/MM/YYYY");
      var tdaydt = moment().format("DD/MM/YYYY");
      if(RawPublishedDt == tdaydt){
          Dt = "Today";
      }else{
          Dt = ""+moment(RawPublishedDt,"DD/MM/YYYY").format("MMM Do, YYYY")+"";
      }
      return (          
          <li> 
            <div className="top-img-wrap">
                <img src={`${ImgObj.serverRelativeUrl}`} alt="image" />
            </div>
            <a href={`${item.DetailsPageUrl}?env=WebView&ItemID=${item.ID}&AppliedTag=${item.Tag}&Dept=${item.Dept.Title}&SitePageID=${item.SitePageID.Id}`} data-interception="off" className="nw-list-main top-news-a"> {item.Title} </a>
            <div className="ns-tag-duration ">
                <a href={`${reactHandler.props.siteurl}/SitePages/News-CategoryBased.aspx?Mode=TagBased&env=WebView&Tag=${item.Tag}`} data-interception='off' className="tags"> {item.Tag} </a> 
            </div>
          </li>
      );
      }else{
        return (                    
          <li> 
          <div className="top-img-wrap">
              <img src={`${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/Error%20Handling%20Images/home_news_noimage.png`} alt="image" />
          </div>
          <a href={`${item.DetailsPageUrl}?env=WebView&ItemID=${item.ID}&AppliedTag=${item.Tag}&Dept=${item.Dept.Title}&SitePageID=${item.SitePageID.Id}`} data-interception="off" className="nw-list-main top-news-a"> {item.Title} </a>
          <div className="ns-tag-duration ">
              <a href={`${reactHandler.props.siteurl}/SitePages/News-CategoryBased.aspx?Mode=TagBased&env=WebView&Tag=${item.Tag}`} data-interception='off' className="tags"> {item.Tag} </a> 
          </div>
        </li>
        );
      }
    });
    return (
      <div className={ styles.remoNewsCategoryBased }>
        <section>
        <div className="relative">
    
            <div className="section-rigth">

                <div className="inner-banner-header relative m-b-20">

                    <div className="inner-banner-overlay"></div>
                    <div className="inner-banner-contents">
                        <h1> News </h1>
                        <ul className="breadcums">
                            <li>  <a href={`${this.props.siteurl}/SitePages/Home.aspx?env=WebView`} data-interception="off"> Home </a> </li>
                            <li>  <a href={`${this.props.siteurl}/SitePages/NewsViewMore.aspx?env=WebView`} data-interception="off"> All News </a> </li>
                            <li>  <a href="#" style={{pointerEvents:"none"}}> {this.state.CurrentPage} </a> </li>
                        </ul>
                    </div>

                </div>
                <div className="inner-page-contents ">
                
                <div className="top-news-sections category-news-sec m-b-20">
                    <div className="sec">

                        <div className="row"> 
                            <div className="col-md-9 category-main-lists">
                                <div className="heading clearfix">
                                    <div className="pull-left">
                                     {this.state.CurrentPage}
                                    </div>
                                 </div>
                                 <div className="section-part clearfix">
                                    <ul className="paginate 1">
                                      <div className="items">
                                        {CategoryBasedNews}
                                      </div>
                                    </ul>
                                </div>
                            </div>    
                            <div className="col-md-3 category-news-list">
                                <div className="heading clearfix">
                                    <div className="pull-left">
                                     Related News
                                    </div>
                                 </div>
                                 <div className="section-part clearfix ">
                                     <ul className="available-depts-or-tags">
                                        {/*TagBasedNews*/}   
                                        
                                     </ul>
                                 </div>   
                            </div>    
                        </div>                                       
                    </div>
                </div>
            </div>   
            <div className="pagination" style={{display:"none"}}>
              <div className="pager">
                <div className="firstPage">&laquo;</div>
                <div className="previousPage">&lsaquo;</div>
                <div className="pageNumbers"></div>
                <div className="nextPage">&rsaquo;</div>
                <div className="lastPage">&raquo;</div>
              </div>
            </div>            
        </div> 
          </div>
    </section>
      </div>
    );
  }
}
