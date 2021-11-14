import * as React from 'react';
import styles from './RemoAnnouncementsRm.module.scss';
import { IRemoAnnouncementsRmProps } from './IRemoAnnouncementsRmProps';
import { escape } from '@microsoft/sp-lodash-subset';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as moment from 'moment';
import * as $ from 'jquery';
import { Web } from "@pnp/sp/webs";
import { Markup } from 'interweave';

export interface IRemoAnnouncementsRmState{
  Items:any[];  
  ItemID:number;
}
const NewWeb = Web("https://remodigital.sharepoint.com/sites/ClientPOC/"); 

export default class RemoAnnouncementsRm extends React.Component<IRemoAnnouncementsRmProps, IRemoAnnouncementsRmState, {}> {
  constructor(props: IRemoAnnouncementsRmProps, state: IRemoAnnouncementsRmState) {
    super(props);    
      this.state = {
        Items: [],
        ItemID:null
      };
    }

    public componentDidMount(){
      var reactHandler = this;        
      $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
      const url : any = new URL(window.location.href);
      const ItemID = url.searchParams.get("ItemID");            
      reactHandler.GetAnnouncementsDetails(ItemID);     
    }

    public async GetAnnouncementsDetails(ItemID){      
      await NewWeb.lists.getByTitle("Announcement").items.select("Title","Description", "Created", "Image", "ID").filter(`IsActive eq '1' and ID eq '${ItemID}'`).getAll().then((items) => { // //orderby is false -> decending          
        this.setState({
          Items: items,ItemID:items[0].Id
        });        
      }).catch((err) => {        
        console.log(err);
      });
    }
  public render(): React.ReactElement<IRemoAnnouncementsRmProps> {
    var handler = this;
    var Dte = "";
    const AnncDetails: JSX.Element[] = this.state.Items.map(function(item,key) {
      let RawImageTxt = item.Image;   
      var RawPublishedDt = moment(item.Created).format("DD/MM/YYYY");
      var tdaydt = moment().format("DD/MM/YYYY");
      if(RawPublishedDt == tdaydt){
          Dte = "Today";
      }else{
          Dte = ""+moment(RawPublishedDt,"DD/MM/YYYY").format("MMM Do, YYYY")+"";
      }   
      if(RawImageTxt != "" && RawImageTxt != null){
        var ImgObj = JSON.parse(RawImageTxt);
        return (
          <div className="col-md-12 view-all-news-l-col home-detail-banner">
                              <div className="view-all-news-recent-left">                              
                                  <div className="view-all-news-recent-img-cont">
                                      <img src={`${ImgObj.serverRelativeUrl}`} alt="image" />
                                  </div>
                                  <h2 className="nw-list-main"> {item.Title} </h2>                                   
                                  <div className="ns-tag-duration clearfix">
                                      <div className="pull-left">
                                          <a href="#" className="tags" style={{pointerEvents:"none"}}> {Dte} </a>
                                      </div>
                                  </div>
                                  <div className="mews-details-para">
                                      <p> <Markup content={item.Description} /> </p>
                                  </div>
                              </div>
                          </div>
        );
      }else{
        return(
<div className="col-md-12 view-all-news-l-col home-detail-banner">
                              <div className="view-all-news-recent-left">                              
                                  <div className="view-all-news-recent-img-cont">
                                      <img src={`${handler.props.siteurl}/SiteAssets/Portal%20Assets/Img/Error%20Handling%20Images/home_banner_noimage.png`} alt="image" />
                                  </div>
                                  <h2 className="nw-list-main"> {item.Title} </h2>                                   
                                  <div className="ns-tag-duration clearfix">
                                      <div className="pull-left">
                                          <a href="#" className="tags" style={{pointerEvents:"none"}}> {Dte} </a>
                                      </div>
                                  </div>
                                  <div className="mews-details-para">
                                      <p> <Markup content={item.Description} /> </p>
                                  </div>
                              </div>
                          </div>
        );
      }
    });
    return (
      <div className={ styles.remoAnnouncementsRm }>
        <section>
          <div className="container relative">      
              <div className="section-rigth">  
                  <div className="inner-banner-header relative m-b-20">  
                      <div className="inner-banner-overlay"></div>
                      <div className="inner-banner-contents">
                          <h1> Announcements </h1>
                          <ul className="breadcums">
                            <li>  <a href={`${this.props.siteurl}/SitePages/Home.aspx?env=WebView`} data-interception="off"> Home </a> </li>
                            <li>  <a href={`${this.props.siteurl}/SitePages/Announcement-View-More.aspx?env=WebView`} data-interception="off"> All Announcements </a> </li>
                            <li>  <a href="#" style={{pointerEvents:"none"}}> Announcements ReadMore </a> </li>
                          </ul>
                      </div>  
                  </div>
                  <div className="inner-page-contents ">
                      <div className="sec m-b-20"> 
                      <div className="row">
                          {AnncDetails}               
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
