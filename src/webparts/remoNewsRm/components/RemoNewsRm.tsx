import * as React from 'react';
import styles from './RemoNewsRm.module.scss';
import { IRemoNewsRmProps } from './IRemoNewsRmProps';
import { escape } from '@microsoft/sp-lodash-subset';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as moment from 'moment';
import * as $ from 'jquery';
import { Markup } from 'interweave';
import { Web } from "@pnp/sp/webs";
export interface IRemoNewsRmState{
  Items:any[];
  TagBasedMoreNews:any[];
  RawJsonHtml:any[];
  Tag:string;
  Department:string;
  SitePageID:number;
  NewsViewCount:number;
  ActiveMainNewsID:number;
}

const NewWeb = Web("https://remodigital.sharepoint.com/sites/ClientPOC/");
export default class RemoNewsRm extends React.Component<IRemoNewsRmProps, IRemoNewsRmState,{}> {
  constructor(props: IRemoNewsRmProps, state: IRemoNewsRmState) {
    super(props);
    this.state = {
      Items: [],
      TagBasedMoreNews:[],
      RawJsonHtml:[],
      Tag:"",
      Department:"",
      SitePageID:null,
      NewsViewCount:0,
      ActiveMainNewsID:null
    };
    }

    public componentDidMount(){
      $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
      var reactHandler = this;
      const url : any = new URL(window.location.href);
      const ItemID = url.searchParams.get("ItemID");
      const AppliedTage:string = url.searchParams.get("AppliedTag");
      const Dept:string = url.searchParams.get("Dept");
      const SitePageID = url.searchParams.get("SitePageID");
      reactHandler.setState({Tag:""+AppliedTage+"",Department:""+Dept+"",SitePageID:SitePageID,ActiveMainNewsID:ItemID});
      reactHandler.GetNews(ItemID);
      reactHandler.GetTagBasedNews(AppliedTage,Dept,ItemID);      
    }

    private GetNews(ItemID) {
    var reactHandler = this;
      $.ajax({
        url: `${this.props.siteurl}/_api/web/lists/getbytitle('News')/items?$select=ID,Title,Description,Created,Image,Tag,Dept/Title,DetailsPageUrl,SitePageID/Id,TransactionItemID/Id&$filter=ID eq ${ItemID}&$orderby=Created desc&$expand=SitePageID,TransactionItemID,Dept`,  
        type: "GET",
        headers:{'Accept': 'application/json; odata=verbose;'},
        success: function(resultData) {          
          reactHandler.setState({
            Items: resultData.d.results
          });
          var SiteUrl = resultData.d.results[0].DetailsPageUrl;          
          var temp = SiteUrl.split("/").pop();
          var TransID = resultData.d.results[0].TransactionItemID.Id;
          reactHandler.GetNewsViewCount(temp,TransID);
        },
        error : function(jqXHR, textStatus, errorThrown) {
        }
      });
    }

    public GetTagBasedNews(AppliedTage,Dept,ItemID){
      var reactHandler = this;
      $.ajax({
        //url: `${this.props.siteurl}/_api/web/lists/getbytitle('News')/items?$select=ID,Title,Description,Created,Image,Tag,Dept/Title,DetailsPageUrl,SitePageID/Id&$filter=Tag eq '${AppliedTage}' and Dept/Title eq '${Dept}' and IsActive eq 1 and Id ne ${ItemID}&$orderby=Created desc&$expand=SitePageID,Dept`,  
        url: `${this.props.siteurl}/_api/web/lists/getbytitle('News')/items?$select=ID,Title,Description,Created,Image,Tag,Dept/Title,DetailsPageUrl,SitePageID/Id&$filter=Tag eq '${AppliedTage}' and IsActive eq 1 and Id ne ${ItemID}&$orderby=Created desc&$expand=SitePageID,Dept`,  
        type: "GET",
        headers:{'Accept': 'application/json; odata=verbose;'},
        success: function(resultData) {          
          reactHandler.setState({
            TagBasedMoreNews: resultData.d.results
          });
          if(resultData.d.results.length == 0){
            $('.view-all-news-l-col').addClass('col-md-12').removeClass('col-md-8');
            $(".sub-news-section").hide();
          }else{
            $('.view-all-news-l-col').addClass('col-md-8').removeClass('col-md-12');
            $(".sub-news-section").show();
          }
        },
        error : function(jqXHR, textStatus, errorThrown) {
        }
      });
    }

    public GetMoreNewsSpecifictoTag(Tag){

    }

    public GetNewsViewCount(Page,TransID){ // Page ==> PageName.aspx
      var reactHandler = this;
      let siteID = reactHandler.props.siteID;
      let ViewCount;
      $.ajax({           
          url: `${this.props.siteurl}/_api/search/query?querytext='${Page}'&selectproperties='ViewsLifetime'`,  
          type: "GET",  
          headers:{'Accept': 'application/json; odata=verbose;'},  
          success: function(resultData) {    
            let ResultsArr = resultData.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results[0].Cells.results;            
            for(var i = 0; i < ResultsArr.length; i++){
              if(ResultsArr[i].Key == "ViewsLifeTime"){
                if(ResultsArr[i].Value == null || ResultsArr[i].Value == "null"){
                  ViewCount = 0;
                }else{
                  ViewCount = ResultsArr[i].Value;
                }
                                
                reactHandler.setState({NewsViewCount:ViewCount});
                reactHandler.AddViewcounttoList(ViewCount,TransID);                
              }
            }
            $(".no-of-views").text(reactHandler.state.NewsViewCount+ " Views ");
          },  
          error : function(jqXHR, textStatus, errorThrown) {  
          }  
      });
    }

    public async AddViewcounttoList(ViewCount,TransID){
      let list = await NewWeb.lists.getByTitle("TransactionViewsCount");
      const i = await list.items.getById(TransID).update({
        ViewCountofNews: ViewCount
      });           
    }
    

  public render(): React.ReactElement<IRemoNewsRmProps> {
    var reactHandler = this;
    var Dt = "";
    
    const NewsDetails: JSX.Element[] = this.state.Items.map(function(item,key) {
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
          <div className='view-all-news-recent-left'>
            <a href='#' className='nw-list-main'> {item.Title} </a>
            <div className='ns-tag-duration clearfix'>
              <div className='pull-left'>
                <a href={`${reactHandler.props.siteurl}/SitePages/News-CategoryBased.aspx?env=WebView&Mode=TagBased&Tag=${item.Tag}`} data-interception='off' className='tags'> {item.Tag} </a>
              </div>
              <div className='pull-right'>
                <img src={`${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/clock.svg`} alt='image' />  {Dt}
              </div>
            </div>
            <div className='view-all-news-recent-img-cont'>
              <img className='placeholder-main-banner-image' src={`${ImgObj.serverRelativeUrl}`} alt='image' />
            </div>
            <div className='ns-tag-duration clearfix'>
              <div className='pull-left det-pg-post-dura'>
                <img src={`${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/clock.svg`} alt='image' /> {Dt} <p className='no-of-views'> 0 Views </p>
              </div>              
            </div>
            <div className='mews-details-para'>
              <p> <Markup content={item.Description} /> </p>										
            </div>
          </div>
      );
      }else{
        return (          
          <div className='view-all-news-recent-left'>
            <a href='#' className='nw-list-main'> {item.Title} </a>
            <div className='ns-tag-duration clearfix'>
              <div className='pull-left'>
                <a href={`${reactHandler.props.siteurl}/SitePages/News-CategoryBased.aspx?env=WebView&Mode=TagBased&Tag=${item.Tag}`} data-interception='off' className='tags'> {item.Tag} </a>
              </div>
              <div className='pull-right'>
                <img src={`${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/clock.svg`} alt='image' />  {Dt}
              </div>
            </div>
            <div className='view-all-news-recent-img-cont'>
              <img className='placeholder-main-banner-image' src={`${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/Error%20Handling%20Images/home_news_noimage.png`} alt='image' />
            </div>
            <div className='ns-tag-duration clearfix'>
              <div className='pull-left det-pg-post-dura'>
                <img src={`${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/clock.svg`} alt='image' /> {Dt} <p className='no-of-views'> 0 Views </p>
              </div>            
            </div>
            <div className='mews-details-para'>
              <p> <Markup content={item.Description} /> </p>										
            </div>
          </div>
        );
      }
      });

      const MoreNewsBasedonTag: JSX.Element[] = this.state.TagBasedMoreNews.map(function(item,key) {
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
          return(
            <li className="clearfix"> 
              <div className="list-li-recent-news-img">
                <img src={`${ImgObj.serverRelativeUrl}`} alt="image" />
              </div>
              <div className="list-li-recent-news-desc">
                <a href={`${item.DetailsPageUrl}?env=WebView&ItemID=${item.ID}&AppliedTag=${item.Tag}&Dept=${item.Dept.Title}&SitePageID=${item.SitePageID.Id}`} data-interception="off" className="nw-list-main"> {item.Title} </a>
                <div className="ns-tag-duration ">
                  <p> {Dt} </p> 
                </div>
              </div>
            </li>
          );
        }else{
          return(
            <li className="clearfix"> 
              <div className="list-li-recent-news-img">
                <img src={`${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/Error%20Handling%20Images/home_news_noimage.png`} alt="image" />
              </div>
              <div className="list-li-recent-news-desc">
                <a href={`${item.DetailsPageUrl}?env=WebView&ItemID=${item.ID}&AppliedTag=${item.Tag}&Dept=${item.Dept.Title}&SitePageID=${item.SitePageID.Id}`} data-interception="off" className="nw-list-main"> {item.Title} </a>
                <div className="ns-tag-duration ">
                  <p> {Dt} </p> 
                </div>
              </div>
            </li>
          );
        }
      });
    
    return (
      <div className={ styles.remoNewsRm }>
        <section>
          <div className='container relative'>
            <div className='section-rigth'>
              <div className='inner-banner-header relative m-b-20'>
                <div className='inner-banner-overlay'></div>
                  <div className='inner-banner-contents'>
                    <h1> News </h1>
                    <ul className='breadcums'>
                      <li>  <a href={`${reactHandler.props.siteurl}/SitePages/Home.aspx?env=WebView`} data-interception="off"> Home </a> </li>
                      <li>  <a href={`${reactHandler.props.siteurl}/SitePages/NewsViewMore.aspx?env=WebView`} data-interception="off"> All News </a> </li>
                      <li>  <a href="#" style={{pointerEvents:"none"}}> News ReadMore </a> </li>
                    </ul>
                  </div>
                </div>
                <div className='inner-page-contents '>
                  <div className='sec m-b-20'> 
                    <div className='row news-details-page'>
                      <div className='col-md-8 view-all-news-l-col'>
                                              
                      {NewsDetails}

                      </div>
                    <div className='col-md-4 sub-news-section'>
                      <div className='heading clearfix'>
                        <a href={`${reactHandler.props.siteurl}/SitePages/News-CategoryBased.aspx?env=WebView&Mode=TagBased&Tag=${this.state.Tag}`} data-interception='off' onClick={()=>reactHandler.GetMoreNewsSpecifictoTag(this.state.Tag)}>
                          More news on {this.state.Tag}
                        </a>
                      </div> 
                      <div className="section-part clearfix">
                        <div className="list-news-latests">
                          <ul>
                            {MoreNewsBasedonTag}
                          </ul>
                        </div>
                      </div>                            
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
