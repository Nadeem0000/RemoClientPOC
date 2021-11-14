import * as React from 'react';
import styles from './RemoHeroBannerVm.module.scss';
import { IRemoHeroBannerVmProps } from './IRemoHeroBannerVmProps';
import { escape } from '@microsoft/sp-lodash-subset';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { SPComponentLoader } from '@microsoft/sp-loader';
import * as $ from 'jquery';
import Slider from "react-slick";
import * as moment from 'moment';

export interface IRemoHeroBannerVmState{
  Items:any[]; 
}

export default class RemoHeroBannerVm extends React.Component<IRemoHeroBannerVmProps, IRemoHeroBannerVmState, {}> {
  constructor(props: IRemoHeroBannerVmProps, state: IRemoHeroBannerVmState) {
    super(props);
    this.state = {
    Items: []
    };
    }

    public componentDidMount(){
    var reactHandler = this;        
    $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
    reactHandler.GetBanner(); 
    }

    private GetBanner() {
      var reactHandler = this;    
      const d = new Date().toISOString();
      var APIUrl = `${this.props.siteurl}/_api/web/lists/getbytitle('Hero Banner')/items?$select=Title,Description,Image,ID&$filter=IsActive eq 1 and ExpiresOn ge datetime'${d}'`;
      $.ajax({
        url: APIUrl,
        type: "GET",
        headers:{'Accept': 'application/json; odata=verbose;'},
        success: function(resultData) {              
          reactHandler.setState({
            Items: resultData.d.results
          });             
        },
        error : function(jqXHR, textStatus, errorThrown) {
        }
      });
    }
  public render(): React.ReactElement<IRemoHeroBannerVmProps> {
    var handler = this;
    var Dt = "";
    const BannerAllDetails: JSX.Element[] = this.state.Items.map(function(item,key) {
      let RawImageTxt = item.Image;
      let dummyElement = document.createElement("DIV");
      dummyElement .innerHTML = item.Description;
      var outputText = dummyElement.innerText;
      var RawPublishedDt = moment(item.Created).format("DD/MM/YYYY");
      var tdaydt = moment().format("DD/MM/YYYY");
      if(RawPublishedDt == tdaydt){
          Dt = "Today";
      }else{
          Dt = ""+moment(RawPublishedDt,"DD/MM/YYYY").format("MMM Do, YYYY")+"";
      }

      if(RawImageTxt != "" && RawImageTxt != null){
        var ImgObj = JSON.parse(RawImageTxt);
        return (
          <li> 
            <div className="top-img-wrap">
                <img src={`${ImgObj.serverRelativeUrl}`} alt="image" />
            </div>
            <a href={`${handler.props.siteurl}/SitePages/Hero-Banner-ReadMore.aspx?env=WebView&ItemID=${item.ID}`} data-interception='off' className="nw-list-main top-news-a"> {item.Title} </a>
            <div className="ns-tag-duration ">
                <a href="#" className="tags"> {Dt} </a> 
            </div>
           </li>
        );
      }
      else if(RawImageTxt == "" || RawImageTxt == null){
        return (            
          <li> 
            <div className="top-img-wrap">
                <img src={`${handler.props.siteurl}/SiteAssets/Portal%20Assets/Img/Error%20Handling%20Images/home_banner_noimage.png`} alt="image" />
            </div>
            <a href={`${handler.props.siteurl}/SitePages/Hero-Banner-ReadMore.aspx?env=WebView&ItemID=${item.ID}`} data-interception='off' className="nw-list-main top-news-a"> {item.Title} </a>
            <div className="ns-tag-duration ">
                <a href="#" className="tags"> {Dt} </a> 
            </div>
         </li>
        );
      }
    });
    return (
      <div className={ styles.remoHeroBannerVm }>
        <section>
        <div className="container relative">
    
            <div className="section-rigth">

                <div className="inner-banner-header relative m-b-20">

                    <div className="inner-banner-overlay"></div>
                    <div className="inner-banner-contents">
                        <h1> Home Banner </h1>
                        <ul className="breadcums">
                        <li>  <a href={`${this.props.siteurl}/SitePages/Home.aspx?env=WebView`} data-interception="off"> Home </a> </li>
                            <li>  <a href="#" style={{pointerEvents:"none"}}>  Hero Banner ViewMore </a> </li>
                        </ul>
                    </div>

                </div>
                <div className="inner-page-contents banner-viewall">
                
                <div className="top-news-sections category-news-sec m-b-20">
                    <div className="sec">

                        <div className="row"> 
                            <div className="col-md-12">
                             
                                 <div className="section-part clearfix">
                                    <ul>
                                        {BannerAllDetails}                                             
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
