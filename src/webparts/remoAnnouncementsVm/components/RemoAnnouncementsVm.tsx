import * as React from 'react';
import styles from './RemoAnnouncementsVm.module.scss';
import { IRemoAnnouncementsVmProps } from './IRemoAnnouncementsVmProps';
import { escape } from '@microsoft/sp-lodash-subset';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as $ from 'jquery';
import * as moment from 'moment';

export interface IRemoAnnouncementsVmState{
  Items:any[]; 
}

export default class RemoAnnouncementsVm extends React.Component<IRemoAnnouncementsVmProps, IRemoAnnouncementsVmState, {}> {
  constructor(props: IRemoAnnouncementsVmProps, state: IRemoAnnouncementsVmState) {
    super(props);
    this.state = {
    Items: []
    };
    }

    public componentDidMount(){
    var reactHandler = this;        
    $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
    reactHandler.GetAllAnnouncements(); 
    }

    private GetAllAnnouncements() {
      var reactHandler = this;          
      var APIUrl = `${this.props.siteurl}/_api/web/lists/getbytitle('Announcement')/items?$select=Title,Image,ID,Created&$filter=IsActive eq 1`;
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
  public render(): React.ReactElement<IRemoAnnouncementsVmProps> {
    var handler = this;
    var Dt = "";
    const AnncAllDetails: JSX.Element[] = this.state.Items.map(function(item,key) {
      let RawImageTxt = item.Image;
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
            <a href={`${handler.props.siteurl}/SitePages/Announcement-Read-More.aspx?env=WebView&ItemID=${item.ID}`} data-interception='off' className="nw-list-main top-news-a"> {item.Title} </a>
            <div className="ns-tag-duration ">
                <a href="#" className="tags" style={{pointerEvents:"none"}}> {Dt} </a> 
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
            <a href={`${handler.props.siteurl}/SitePages/Announcement-Read-More.aspx?env=WebView&ItemID=${item.ID}`} data-interception='off' className="nw-list-main top-news-a"> {item.Title} </a>
            <div className="ns-tag-duration ">
                <a href="#" className="tags" style={{pointerEvents:"none"}}> {Dt} </a> 
            </div>
         </li>
        );
      }
    });
    return (
      <div className={ styles.remoAnnouncementsVm }>
        <section>
        <div className="relative">
    
            <div className="section-rigth">

                <div className="inner-banner-header relative m-b-20">

                    <div className="inner-banner-overlay"></div>
                    <div className="inner-banner-contents">
                        <h1> Announcements </h1>
                        <ul className="breadcums">
                        <li>  <a href={`${this.props.siteurl}/SitePages/Home.aspx?env=WebView`} data-interception="off"> Home </a> </li>
                            <li>  <a href="#" data-interception="off" style={{pointerEvents:"none"}}>  All Announcements </a> </li>
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
                                        {AnncAllDetails}                                             
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
