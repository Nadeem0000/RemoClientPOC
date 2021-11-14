import * as React from 'react';
import styles from './RemoEventsAnnouncements.module.scss';
import { IRemoEventsAnnouncementsProps } from './IRemoEventsAnnouncementsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Web } from "@pnp/sp/webs";
import { sp } from "@pnp/sp";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import * as $ from 'jquery';
import * as moment from 'moment';
import { SPComponentLoader } from '@microsoft/sp-loader';

export interface IRemoEventsAnnouncementsState {
  Items:any[];  
  Events:any[];  
}

const NewWeb = Web("https://remodigital.sharepoint.com/sites/ClientPOC/"); 

export default class RemoEventsAnnouncements extends React.Component<IRemoEventsAnnouncementsProps, IRemoEventsAnnouncementsState,{}> {
  constructor(props: IRemoEventsAnnouncementsProps, state: IRemoEventsAnnouncementsState) {
    super(props);
      this.state = {
        Items: [],
        Events:[]
      };
  }

  public componentDidMount(){
    var reactHandler = this;    
    reactHandler.GetAnnouncements(); 
    reactHandler.GetEvents();
    }

    private async GetAnnouncements() {
      var reactHandler = this;    
      var Date = moment().toISOString();  
      try{
        $.ajax({  
            url: `${this.props.siteurl}/_api/web/lists/getbytitle('Announcement')/items?$select=Title,Description,ID,Created&$filter=IsActive eq 1&$orderby=Created desc&$top=1`,  
            type: "GET",  
            headers:{'Accept': 'application/json; odata=verbose;'},  
            success: function(resultData) {  
              if(resultData.d.results.length != 0){
                $("#if-annc-present").show();          
                reactHandler.setState({  
                  Items: resultData.d.results                                    
                }); 
              }else{
                $("#if-no-annc-present").show();
              }                                           
            },  
            error : function(jqXHR, textStatus, errorThrown) {  
            }  
        });
      }catch(err){
        console.log("Events : " + err);
      }      
    }
    
    private async GetEvents() {
      var reactHandler = this;
      const tdaydate = moment().format('MM-DD-YYYY');
      try{
        $.ajax({  
            url: `${this.props.siteurl}/_api/web/lists/getbytitle('Events')/items?$select=Title,Description,EventDate,EndDate,ID&$filter=EndDate ge '${tdaydate}'&$orderby=Created desc&$top=3`,  
            type: "GET",  
            headers:{'Accept': 'application/json; odata=verbose;'},  
            success: function(resultData) {  
              if(resultData.d.results.length != 0){
                $("#if-events-present").show();
                $("#if-no-events-present").hide();
                reactHandler.setState({  
                  Events: resultData.d.results                                    
                }); 
              }else{
                $("#if-events-present").hide();
                $("#if-no-events-present").show();
              }                                           
            },  
            error : function(jqXHR, textStatus, errorThrown) {  
            }  
        });
      }catch(err){
        console.log("Events : " + err);
      }
    }







  public render(): React.ReactElement<IRemoEventsAnnouncementsProps> {
    var handler = this;
        const AnncItems: JSX.Element[] = this.state.Items.map(function(item,key) {
          let dummyElement = document.createElement("DIV");
          dummyElement .innerHTML = item.Description;
          var outputText = dummyElement.innerText;

          let DateofPublish = "";
          let CreatedDate = moment(item.Created).format("DD/MM/YYYY");
          let CurrentDate = moment().format("DD/MM/YYYY"); 
          if(CreatedDate == CurrentDate){
            DateofPublish = "Today";
          }else{
            DateofPublish = ""+CreatedDate+"";
          }         
            return (
              <div className="sec gradient">
                <div className="annoy-heading">
                  <a href={`${handler.props.siteurl}/SitePages/Announcement-View-More.aspx?ItemID=${item.ID}&env=WebView`} data-interception='off'>
                    <h4> Announcements </h4>  
                  </a>
                  <p> {DateofPublish}  </p>
                </div>        
                <div className="ann-detibck">
                  <a href={`${handler.props.siteurl}/SitePages/Announcement-Read-More.aspx?ItemID=${item.ID}&env=WebView`} data-interception='off'>
                    <h2>{item.Title} </h2>
                  </a>
                  <p> {outputText}</p>
                </div>
              </div>
            );                    
        });

        const Events: JSX.Element[] = handler.state.Events.map(function(item,key) {  
          var Date = moment(item.EventDate).format("DD");
          var Month = moment(item.EventDate).format("MMM");
    
          let dummyElement = document.createElement("DIV");
          dummyElement .innerHTML = item.Description;
          var outputText = dummyElement.innerText;     
                  
          return (          
            <li className="clearfix"> 
              <div className="latest-eventsleft relative">
                <h2> {Date} </h2>
                <p> {Month} </p>
                <div className="inner-shaodw"> </div>
              </div>
              <div className="latest-eventsright">
                <h4><a href={`${handler.props.siteurl}/SitePages/EventsViewMore.aspx?env=WebView&Mode=EvRM&ItemID=${item.ID}&SelectedDate=${moment(item.EventDate).format("YYYYMMDD")}`} data-interception='off'>{item.Title}</a> </h4>
                <p> {outputText}  </p>
              </div>
            </li>
          );              
        });
    return (
      <div className={ styles.remoEventsAnnouncements } id="events-and-anncmnts">
        <div className="latest-news-announcemnst">
          <div className="row">
            <div className="col-md-6">
              <div className="sec event-cal" id="if-events-present">
                <div className="heading">
                  <a href={`${handler.props.siteurl}/SitePages/EventsViewMore.aspx?env=WebView&Mode=EvVM`} data-interception='off'>
                    Latest Events
                  </a>
                </div>
                <div className="section-part clearfix latest-events-bck">
                  <ul>
                    {Events}                                              
                  </ul>
                </div>
              </div> 

              <div className="sec event-cal" id="if-no-events-present" style={{display:"none"}}>
                <div className="heading">
                  <a href='#'>
                    Latest Events
                  </a>
                </div>
                <div className="section-part clearfix latest-events-bck">
                  <ul>
                    {Events}                                              
                  </ul>
                </div>
              </div>  
            </div>
            <div className="col-md-6" style={{display:"none"}} id="if-annc-present">
              {AnncItems}
            </div>
            <div className="col-md-6" style={{display:"none"}} id="if-no-annc-present">
              <div className="sec gradient">
                <div className="annoy-heading">
                  <a href="#">
                    <h4> Announcements </h4>  
                  </a>
                  <p>  </p>
                </div>        
                <div className="ann-detibck">
                  <img className="err-img" src={`${handler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/Error%20Handling%20Images/ContentEmpty.png`} alt="no-image-uploaded" />
                </div>
              </div>
            </div>
        </div>                  
      </div>
    </div>
  );
  }
}
