import * as React from 'react';
import styles from './RemoNewsVm.module.scss';
import { IRemoNewsVmProps } from './IRemoNewsVmProps';
import { escape } from '@microsoft/sp-lodash-subset';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as moment from 'moment';
import * as $ from 'jquery';
import { Web } from "@pnp/sp/webs";
import { SPComponentLoader } from '@microsoft/sp-loader';
import Slider from "react-slick";
import { Items } from '@pnp/sp/items';

SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.css");
SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.css");
SPComponentLoader.loadScript("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js");
export interface IRemoNewsVmState{
  Items:any[];
  RecentNewsItems:any[];
  ViewBasedTopNews:any[];
  OneWkOldNews:any[];
  status:boolean;
  AvailableDepts:any[];
  DeptNewsArr:any[];
}

const NewWeb = Web("https://remodigital.sharepoint.com/sites/ClientPOC/");
let NewsAvailableDepts = [];
let DeptNames = [];
let DeptNamesExitsUnique = [];
let DeptWithBanner = [];
let DepartmentBasedNewsFinal = [];
let DeptNews = [];
let rawarr = [];
export default class RemoNewsVm extends React.Component<IRemoNewsVmProps, IRemoNewsVmState, {}> {
  constructor(props: IRemoNewsVmProps, state: IRemoNewsVmState) {
    super(props);
    this.state = {
      Items: [],
      RecentNewsItems: [],
      ViewBasedTopNews:[],
      OneWkOldNews:[],      
      status:false,
      AvailableDepts:[],
      DeptNewsArr:[]
    };
    }

    public componentDidMount(){
      $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
      var reactHandler = this;
      reactHandler.GetAllNews(); 
      reactHandler.GetAllTopNews();
      reactHandler.GetAllNewsAvailableDepartments();
      reactHandler.GetWeekOldNews();
    }

    private GetAllNews() {
      var reactHandler = this;
      $.ajax({
        url: `${this.props.siteurl}/_api/web/lists/getbytitle('News')/items?$select=ID,Title,Description,Created,Image,Tag,Dept/Title,DetailsPageUrl,SitePageID/Id,TransactionItemID/Id&$filter=IsActive eq 1&$orderby=Created desc&$expand=SitePageID,TransactionItemID,Dept&$top=1`,  
        type: "GET",
        headers:{'Accept': 'application/json; odata=verbose;'},
        success: function(resultData) {              
          reactHandler.setState({
            Items: resultData.d.results
          });  
          let ItemID = resultData.d.results[0].Id;
          reactHandler.GetAllRecentNews(ItemID);
        },
        error : function(jqXHR, textStatus, errorThrown) {
        }
      });
    }

    private GetAllRecentNews(ID) {
      var reactHandler = this;
      $.ajax({
        url: `${this.props.siteurl}/_api/web/lists/getbytitle('News')/items?$select=ID,Title,Description,Created,Image,Tag,Dept/Title,DetailsPageUrl,SitePageID/Id,TransactionItemID/Id&$filter=IsActive eq 1 and ID ne ${ID}&$orderby=Created desc&$expand=SitePageID,TransactionItemID,Dept&$top=4`,  
        type: "GET",
        headers:{'Accept': 'application/json; odata=verbose;'},
        success: function(resultData) {              
          reactHandler.setState({
            RecentNewsItems: resultData.d.results
          });               
        },
        error : function(jqXHR, textStatus, errorThrown) {
        }
      });
    }

    private GetAllTopNews() {
      var reactHandler = this;
      var today = moment().format('YYYY-MM-DD');
      var dateFrom = moment(today,'YYYY-MM-DD').subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
      
      $.ajax({
        url: `${this.props.siteurl}/_api/web/lists/getbytitle('News')/items?$select=ID,Title,Description,Created,Image,Tag,Dept/Title,DetailsPageUrl,SitePageID/Id,TransactionItemID/Id,PageViewCount&$filter=IsActive eq 1 and Created gt '${dateFrom}' &$orderby=PageViewCount desc&$expand=SitePageID,TransactionItemID,Dept`,  
        type: "GET",
        headers:{'Accept': 'application/json; odata=verbose;'},
        success: function(resultData) {  
          if(resultData.d.results.length != 0){
            $(".top-news-block-current-month").show();
            reactHandler.setState({
              ViewBasedTopNews: resultData.d.results
            }); 
          }else{
            $(".top-news-block-current-month").hide();
          }                       
        },
        error : function(jqXHR, textStatus, errorThrown) {
        }
      });
    }

    public GetWeekOldNews(){
      var reactHandler = this;
      let today = moment().format("YYYY-MM-DD");
      let WkDate = moment(today,"YYYY-MM-DD").subtract(1,"week").format("YYYY-MM-DD");
      
      $.ajax({
        url: `${this.props.siteurl}/_api/web/lists/getbytitle('News')/items?$select=ID,Title,Description,Created,Image,Tag,Dept/Title,DetailsPageUrl,SitePageID/Id,TransactionItemID/Id&$filter=IsActive eq 1 and Created lt '${WkDate}'&$orderby=Created desc&$expand=SitePageID,TransactionItemID,Dept&$top=20`,  
        type: "GET",
        headers:{'Accept': 'application/json; odata=verbose;'},
        success: function(resultData) {    
          if(resultData.d.results.length != 0){
            $(".PastNewsData").show();
            reactHandler.setState({
              OneWkOldNews: resultData.d.results
            });
          }else{
            $(".PastNewsData").hide();
          }                                
        },
        error : function(jqXHR, textStatus, errorThrown) {
        }
      });
    }

    private GetAllNewsAvailableDepartments() {    
      NewsAvailableDepts = [];
      DeptNames = [];
      DeptNamesExitsUnique= [];
      var reactHandler = this;
      $.ajax({
        url: `${this.props.siteurl}/_api/web/lists/getbytitle('News')/items?$select=ID,Dept/Id,Dept/Title,Image&$filter=IsActive eq 1&$orderby=Created desc&$expand=Dept`,  
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
          console.log(reactHandler.state.AvailableDepts);       
          reactHandler.GetDeptNews();
        },
        error : function(jqXHR, textStatus, errorThrown) {
        }
      });
    }


    public GetDeptNews(){
      var reactHandler = this;      
     for(var j = 0; j < this.state.AvailableDepts.length;){
      var string = this.state.AvailableDepts[j].Title;
      var Title = string.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-');
      var CustomID = ""+Title+"-Dept-News";
      var DeptID = this.state.AvailableDepts[j].ID;
      if(DeptID != "" || DeptID != undefined || DeptID != null){
        $.ajax({
          url: `${this.props.siteurl}/_api/web/lists/getbytitle('News')/items?$select=ID,Title,Description,Created,Image,Tag,Dept/Title,DetailsPageUrl,SitePageID/Id,TransactionItemID/Id&$filter=IsActive eq 1 and Dept/Id eq '${DeptID}'&$orderby=Created desc&$expand=SitePageID,TransactionItemID,Dept&$top=4`,  
          type: "GET",
          async:false,
          headers:{'Accept': 'application/json; odata=verbose;'},
          success: function(resultData) {                              
            for(var i = 0; i < resultData.d.results.length;){
              $("#"+CustomID+"").append(`<li><a href="${resultData.d.results[i].DetailsPageUrl}?env=WebView&ItemID=${resultData.d.results[i].ID}&AppliedTag=${resultData.d.results[i].Tag}&Dept=${resultData.d.results[i].Dept.Title}&SitePageID=${resultData.d.results[i].SitePageID.Id}" data-interception="off"><p>${resultData.d.results[i].Title}</p></a></li>`);
              i++;
            } 
            j++;
          },
          error : function(jqXHR, textStatus, errorThrown) {
          }
        });
      }            
     }    
    }

    public SampleNextArrow(props) {
      const { className, style, onClick } = props;
      return (        
        <a href="#" className={className} onClick={onClick}> <img src={`${this.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/right.svg`} alt="image" /> </a>
      );
    }
    
    public SamplePrevArrow(props) {
      const { className, style, onClick } = props;
      return (
        <a href="#" className={className} onClick={onClick}> <img src={`${this.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/left.svg`} alt="image" /> </a>
      );
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

  public render(): React.ReactElement<IRemoNewsVmProps> {
    const settings = {
      dots: false,
      arrows: true,
      infinite: false,
      speed: 500,
      autoplay: false,
      slidesToShow: 5, //Value Comes From State
      slidesToScroll: 4,
      draggable: true,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            infinite: true,
            dots: false,
            arrows: false,
            autoplay: false,
            centerMode: false
          }
        }
      ]
      /*prevArrow: <this.SamplePrevArrow />,
      nextArrow: <this.SampleNextArrow />*/
      };

    var reactHandler = this;
    var Dt = "";
    var Dte = "";
    const TopRecentNews: JSX.Element[] = this.state.Items.map(function(item,key) {
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
          <div className="view-all-news-recent-left">
            <div className="view-all-news-recent-img-cont">
              <img src={`${ImgObj.serverRelativeUrl}`} alt="image" />
            </div>                
            <div className="ns-tag-duration clearfix">
              <div className="pull-left">
                <a href={`${reactHandler.props.siteurl}/SitePages/News-CategoryBased.aspx?env=WebView&Mode=TagBased&Tag=${item.Tag}`} data-interception='off' className="tags"> {item.Tag} </a>
              </div>
              <div className="pull-right">
                <img src={`${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/clock.svg`} alt="image" />  {Dt}
              </div>
            </div>
            <a href={`${item.DetailsPageUrl}?env=WebView&ItemID=${item.ID}&AppliedTag=${item.Tag}&Dept=${item.Dept.Title}&SitePageID=${item.SitePageID.Id}`} data-interception="off" className="nw-list-main"> {item.Title} </a>
          </div>
      );
      }else{
        return (          
          <div className="view-all-news-recent-left">
            <div className="view-all-news-recent-img-cont">
              <img src={`${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/Error%20Handling%20Images/home_news_noimage.png`} alt="image" />
            </div>                
            <div className="ns-tag-duration clearfix">
              <div className="pull-left">
                <a href={`${reactHandler.props.siteurl}/SitePages/News-CategoryBased.aspx?env=WebView&Mode=TagBased&Tag=${item.Tag}`} data-interception='off' className="tags"> {item.Tag} </a>
              </div>
              <div className="pull-right">
                <img src={`${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/clock.svg`} alt="image" />  {Dt}
              </div>
            </div>
            <a href={`${item.DetailsPageUrl}?env=WebView&ItemID=${item.ID}&AppliedTag=${item.Tag}&Dept=${item.Dept.Title}&SitePageID=${item.SitePageID.Id}`} data-interception="off" className="nw-list-main"> {item.Title} </a>
          </div>
        );
      }
    });

    const TopRecentOtherNews: JSX.Element[] = this.state.RecentNewsItems.map(function(item,key) {
      let RawImageTxt = item.Image;      
      if(RawImageTxt != "" && RawImageTxt != null){      
      var ImgObj = JSON.parse(RawImageTxt);
      var RawPublishedDt = moment(item.Created).format("DD/MM/YYYY");
      var tdaydt = moment().format("DD/MM/YYYY");
      if(RawPublishedDt == tdaydt){
          Dte = "Today";
      }else{
          Dte = ""+moment(RawPublishedDt,"DD/MM/YYYY").format("MMM Do, YYYY")+"";
      }
      return (
          <li className="clearfix"> 
            <div className="list-li-recent-news-img">
                <img src={`${ImgObj.serverRelativeUrl}`} alt="image" />
            </div>
            <div className="list-li-recent-news-desc">
              <a href={`${item.DetailsPageUrl}?env=WebView&ItemID=${item.ID}&AppliedTag=${item.Tag}&Dept=${item.Dept.Title}&SitePageID=${item.SitePageID.Id}`} data-interception="off" className="nw-list-main"> {item.Title} </a>
              <div className="ns-tag-duration ">
                <a href={`${reactHandler.props.siteurl}/SitePages/News-CategoryBased.aspx?env=WebView&Mode=TagBased&Tag=${item.Tag}`} data-interception='off' className="tags"> {item.Tag} </a> <p> {Dte} </p> 
              </div>
            </div>
          </li>
      );
      }else{
        return (          
          <li className="clearfix"> 
            <div className="list-li-recent-news-img">
              <img src={`${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/Error%20Handling%20Images/home_news_noimage.png`} alt="image" />
            </div>
            <div className="list-li-recent-news-desc">
              <a href={`${item.DetailsPageUrl}?env=WebView&ItemID=${item.ID}&AppliedTag=${item.Tag}&Dept=${item.Dept.Title}&SitePageID=${item.SitePageID.Id}`} data-interception="off" className="nw-list-main"> {item.Title} </a>
              <div className="ns-tag-duration ">
                <a href={`${reactHandler.props.siteurl}/SitePages/News-CategoryBased.aspx?env=WebView&Mode=TagBased&Tag=${item.Tag}`} data-interception='off' className="tags"> {item.Tag} </a> <p> {Dte} </p> 
              </div>
            </div>
          </li>
        );
      }
    });

    const TopNewsBasedonViews: JSX.Element[] = this.state.ViewBasedTopNews.map(function(item,key) {
      let RawImageTxt = item.Image;      
      if(RawImageTxt != "" && RawImageTxt != null){      
      var ImgObj = JSON.parse(RawImageTxt);
      var RawPublishedDt = moment(item.Created).format("DD/MM/YYYY");
      var tdaydt = moment().format("DD/MM/YYYY");
      if(RawPublishedDt == tdaydt){
          Dte = "Today";
      }else{
          Dte = ""+moment(RawPublishedDt,"DD/MM/YYYY").format("MMM Do, YYYY")+"";
      }
      return (
          <li> 
            <div className="top-img-wrap">
                <img src={`${ImgObj.serverRelativeUrl}`} alt="image" />
            </div>
            <a href={`${item.DetailsPageUrl}?env=WebView&ItemID=${item.ID}&AppliedTag=${item.Tag}&Dept=${item.Dept.Title}&SitePageID=${item.SitePageID.Id}`} data-interception="off" className="nw-list-main top-news-a"> {item.Title} </a>
            <div className="ns-tag-duration ">
                <a href={`${reactHandler.props.siteurl}/SitePages/News-CategoryBased.aspx?env=WebView&Mode=TagBased&Tag=${item.Tag}`} data-interception='off' className="tags"> {item.Tag} </a> 
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
                <a href={`${reactHandler.props.siteurl}/SitePages/News-CategoryBased.aspx?env=WebView&Mode=TagBased&Tag=${item.Tag}`} data-interception='off' className="tags"> {item.Tag} </a> 
            </div>
          </li>
        );
      }
    });

    const OneWkOldNews: JSX.Element[] = this.state.OneWkOldNews.map(function(item,key) {
      let RawImageTxt = item.Image;      
      if(RawImageTxt != "" && RawImageTxt != null){      
      var ImgObj = JSON.parse(RawImageTxt);      
      return (
          <li> 
            <div className="top-img-wrap">
              <img src={`${ImgObj.serverRelativeUrl}`} alt="image" />
            </div>
            <a href={`${item.DetailsPageUrl}?env=WebView&ItemID=${item.ID}&AppliedTag=${item.Tag}&Dept=${item.Dept.Title}&SitePageID=${item.SitePageID.Id}`} data-interception="off" className="nw-list-main top-news-a"> {item.Title} </a>
            <div className="ns-tag-duration ">
              <a href={`${reactHandler.props.siteurl}/SitePages/News-CategoryBased.aspx?env=WebView&Mode=TagBased&Tag=${item.Tag}`} data-interception='off' className="tags"> {item.Tag} </a> 
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
                <a href={`${reactHandler.props.siteurl}/SitePages/News-CategoryBased.aspx?env=WebView&Mode=TagBased&Tag=${item.Tag}`} data-interception='off' className="tags"> {item.Tag} </a> 
            </div>
          </li>
        );
      }
    });

    const AllDepartmentNews: JSX.Element[] = this.state.AvailableDepts.map(function(item,key) {            
      var string = item.Title;
      var Title = string.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-');
      var CustomID = ""+Title+"-Dept-News";
      
      return (
        <div className="col-md-3  m-b-0">
          <div className="heading clearfix">
            <a href={`${reactHandler.props.siteurl}/SitePages/News-CategoryBased.aspx?env=WebView&Mode=DeptBased&Dept=${item.Title}`} data-interception='off'>
              {item.Title}
            </a>
          </div>
          <div className="section-part">
            <img src={`${item.URL}`} alt="image" />
            <ul id={`${Title}-Dept-News`}>
              
            </ul>
          </div>    
        </div>
      );      
    });
    return (
      <div className={ styles.remoNewsVm }>
        <section>
          <div className="container relative">    
            <div className="section-rigth">
              <div className="inner-banner-header relative m-b-20">
                <div className="inner-banner-overlay"></div>
                <div className="inner-banner-contents">
                  <h1> News </h1>
                  <ul className="breadcums">
                    <li>  <a href={`${this.props.siteurl}/SitePages/Home.aspx?env=WebView`} data-interception="off"> Home </a> </li>
                    <li>  <a href="#" style={{pointerEvents:"none"}}> All News </a> </li>
                  </ul>
                </div>
              </div>
              <div className="inner-page-contents ">
                <div className="sec m-b-20"> 
                  <div className="row">
                    <div className="col-md-6 view-all-news-l-col">
                      {TopRecentNews}
                    </div>
                    <div className="col-md-6">
                      <div className="list-news-latests">
                        <ul>
                          {TopRecentOtherNews}                                                                
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="top-news-sections m-b-20 top-news-block-current-month" style={{display:"none"}}>
                  <div className="sec">
                    <div className="heading clearfix">
                      <div className="pull-left">
                        Top News
                      </div>
                      <div className="pull-right">
                        
                      </div>
                    </div>
                    <div className="section-part clearfix">
                      <ul>
                        <Slider {...settings}>
                          {TopNewsBasedonViews} 
                        </Slider>                                
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="education-government-track sec m-b-20">
                  <div className="row dept-based-news-block">
                    <Slider {...settings}>
                      {AllDepartmentNews}     
                    </Slider>            
                  </div>
                </div>
                <div className="top-news-sections m-b-20 PastNewsData" style={{display:"none"}}>
                  <div className="sec">
                    <div className="heading clearfix">
                      <div className="pull-left">
                        Past News
                      </div>
                      <div className="pull-right">
                        
                      </div>
                    </div>
                    <div className="section-part clearfix">
                      <ul>
                        <Slider {...settings}>
                          {OneWkOldNews} 
                        </Slider>                                                 
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
