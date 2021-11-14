import * as React from 'react';
import { useState, useEffect } from "react";
import styles from './RemoEventsVm.module.scss';
import { IRemoEventsVmProps } from './IRemoEventsVmProps';
import { escape } from '@microsoft/sp-lodash-subset';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as moment from 'moment';
import * as $ from 'jquery';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { Web } from "@pnp/sp/webs";
import RevoCalendar from 'revo-calendar';
import { filter } from 'lodash';
import 'evo-calendar';

export interface IRemoEventsVmState{
  Items:any[];
  SelectedDate:any;
  Date:any;
  Mode:string;
}

const NewWeb = Web("https://remodigital.sharepoint.com/sites/ClientPOC/"); 
const eventList = [];

export default class RemoEventsVm extends React.Component<IRemoEventsVmProps, IRemoEventsVmState, {}> {
  public constructor(props: IRemoEventsVmProps, state: IRemoEventsVmState){
    super(props);
    SPComponentLoader.loadCss(`https://cdn.jsdelivr.net/npm/evo-calendar@1.1.2/evo-calendar/css/evo-calendar.min.css`);   
    SPComponentLoader.loadScript('https://cdn.jsdelivr.net/npm/evo-calendar@1.1.2/evo-calendar/js/evo-calendar.min.js');
    this.state = {
      Items: [],
      SelectedDate:""+moment().format("MMM DD")+"",
      Date:"",
      Mode:""
    };
  }

  public componentDidMount(){
    var handler = this;      
                                  
    $('#calendar').on('selectDate', function(event, newDate, oldDate) {
      let SelectedDate = moment(newDate,"MM/DD/YYYY").format("DD/MM/YYYY")
      handler.GetEventsofSelectedDate(SelectedDate);           
    });    
    const url : any = new URL(window.location.href);
    const Date = url.searchParams.get("SelectedDate");
    const Mode = url.searchParams.get("Mode");
    if(Mode == "EvRM"){
      this.setState({Mode:"EvRM",Date:moment(Date,"YYYYMMDD").format('MMMM DD, YYYY')});
      var tdaydateAdd = moment(Date,"YYYYMMDD").subtract(1,'d').format('YYYY-MM-DD');  
      handler.GetEvents(tdaydateAdd,'EvRM');
    }else{
      this.setState({Mode:"EvVM",Date:moment().format('MMMM DD, YYYY')});
      handler.GetEvents(tdaydateAdd,'EvVM');
    }  
  }
   

  private async GetEvents(Date,Mode) { 
    var reactHandler = this;    
    var ApiUrl = "";
    if(Mode == "EvRM"){
      ApiUrl = `${this.props.siteurl}/_api/web/lists/getbytitle('Events')/items?$select=ID,Title,Image,Description,EventDate,Location,EndDate&$orderby=EventDate asc&$filter=filter=EventDate gt '${Date}'`;
    }else{
      ApiUrl = `${this.props.siteurl}/_api/web/lists/getbytitle('Events')/items?$select=ID,Title,Image,Description,EventDate,Location,EndDate&$orderby=EventDate asc&$filter=filter=EndDate gt '${moment().format('YYYY-MM-DD')}'`;
    }

    this.GetEventsForDots(Mode); 

    $.ajax({                 
        url: ApiUrl,
        type: "GET", 
        async:false, 
        headers:{'Accept': 'application/json; odata=verbose;'},  
        success: function(resultData) {              
                       
          if(resultData.d.results.length != 0){
            reactHandler.setState({  
              Items: resultData.d.results              
            }); 
            console.log(resultData.d.results);
            $("#if-event-present").show();
            $("#if-no-event-present").hide();
          }else{
            $("#if-event-present").hide();
            $("#if-no-event-present").show();
          }                                                
        },  
        error : function(jqXHR, textStatus, errorThrown) {  
        }  
    });
  }

    private async GetEventsForDots(Mode) {  
      if(Mode == "EvVM"){    
        await NewWeb.lists.getByTitle("Events").items.select("Title","Description","Location","Image","Location","EventDate","EndDate","ID").orderBy("Created", false).getAll().then((items) => { // //orderby is false -> decending                  
          for(var i = 0; i < items.length; i++){
            /*if(moment(items[i].EventDate).format("DD/MM/YYYY") != moment(items[i].EndDate).format("DD/MM/YYYY")){
              eventList.push( 
                {id:""+items[i].ID+"",name: ""+items[i].Title+"",date: [""+moment(items[i].EventDate).format("MMMM/D/YYYY")+"", ""+moment(items[i].EndDate).format("MMMM/D/YYYY")+""],type: "event",description:""+items[i].Description+""} 
              );
            }*/
            eventList.push( 
              {id:""+items[i].ID+"",name: ""+items[i].Title+"",date: ""+moment(items[i].EventDate).format("MMMM/D/YYYY")+"",type: "holiday",description:""+items[i].Description+""}                        
            );                   
          }                

          ($('#calendar')as any).evoCalendar({
            calendarEvents: eventList,
            'todayHighlight': true,
            'eventListToggler': false,
            'eventDisplayDefault': false,
            'sidebarDisplayDefault': false
          });       
        }).catch((err) => {        
          console.log(err);
        });  
      }else{
        //this.GetEventsofSelectedDate('07/09/2021');
        await NewWeb.lists.getByTitle("Events").items.select("Title","Description","Location","Image","Location","EventDate","EndDate","ID").orderBy("Created", false).getAll().then((items) => { // //orderby is false -> decending                  
          for(var i = 0; i < items.length; i++){
            /*if(moment(items[i].EventDate).format("DD/MM/YYYY") != moment(items[i].EndDate).format("DD/MM/YYYY")){
              eventList.push( 
                {id:""+items[i].ID+"",name: ""+items[i].Title+"",date: [""+moment(items[i].EventDate).format("MMMM/D/YYYY")+"", ""+moment(items[i].EndDate).format("MMMM/D/YYYY")+""],type: "event",description:""+items[i].Description+""} 
              );
            }*/
            eventList.push( 
              {id:""+items[i].ID+"",name: ""+items[i].Title+"",date: ""+moment(items[i].EventDate).format("MMMM/D/YYYY")+"",type: "holiday",description:""+items[i].Description+""}                        
            );                   
          }                

          ($('#calendar')as any).evoCalendar({
            calendarEvents: eventList,
            'todayHighlight': true,
            'eventListToggler': false,
            'eventDisplayDefault': false,
            'sidebarDisplayDefault': false,
            'selectDate': "07/09/2021"//this.state.Date
          });       
        }).catch((err) => {        
          console.log(err);
        });  
      }  
    }

    private GetEventsofSelectedDate(Date) {      
      
        var tdaydateAdd = moment(Date,"DD/MM/YYYY").subtract(1,'d').format('YYYY-MM-DD'); 
        this.setState({Items:[],Date:moment(tdaydateAdd).add(1,'d').format('YYYY-MM-DD'),SelectedDate:""+moment(Date,"DD/MM/YYYY").format("MMM D")+""});       
        var reactHandler = this;
        $.ajax({              
            url: `${this.props.siteurl}/_api/web/lists/getbytitle('Events')/items?$select=ID,Title,Image,Description,EventDate,Location,EndDate&$orderby=EventDate asc&$filter=EventDate gt '${tdaydateAdd}'`,                          
            type: "GET", 
            async:false, 
            headers:{'Accept': 'application/json; odata=verbose;'},  
            success: function(resultData) {              
              reactHandler.setState({  
                Items: resultData.d.results              
              });  
              if(resultData.d.results.length == 0){
                $("#if-event-present").hide();
                $("#if-no-event-present").show();
              }  else{
                $("#if-event-present").show();
                $("#if-no-event-present").hide();
              }                                              
            },  
            error : function(jqXHR, textStatus, errorThrown) {  
            }  
        });                
    }

    public checkSame(date1, date2) {
      return moment(date1).isSame(date2);
    }

  public render(): React.ReactElement<IRemoEventsVmProps> {
    var handler = this;           
    const EventsfromCalender: JSX.Element[] = this.state.Items.map(function(item,key) {         
      var EventDateStart = moment(item.EventDate).format('YYYY-MM-DD');     
      if(handler.checkSame(handler.state.Date,EventDateStart)){   
          var Title = item.Title;
          let dummyElement = document.createElement("DIV");
          dummyElement .innerHTML = item.Description;
          var outputText = dummyElement.innerText;
          var Location = item.Location;
          var EndDate = moment(item.EndDate).format("DD/MM/YYYY h:mm A"); 
          var StartDate = moment(item.EventDate).format("DD/MM/YYYY h:mm A");   
          let RawImageTxt = item.Image;
          if(RawImageTxt != "" && RawImageTxt != null){
            var ImgObj = JSON.parse(RawImageTxt);
            return(
              <li className="clearfix">
                <div className="inner-event-body-left">
                  <img src={`${ImgObj.serverRelativeUrl}`} alt="image" />
                </div>  
                <div className="inner-event-body-right">
                  <div className="event-location-duration clearfix">
                    <div className="event-location-duration-left ">
                    <img src={`${handler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/duration.svg`}/> {StartDate} to {EndDate}
                    </div>
                    <div className="event-location-duration-right">
                    <img src={`${handler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/location.svg`}/> {Location}
                    </div>
                  </div>
                  <h4> {Title} </h4>
                  <p> {outputText} </p>
                </div>
              </li>
            );
          }else{
            return(
              <li className="clearfix">
                <div className="inner-event-body-left">
                  <img src={`${handler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/No-Events-Image.svg`} alt="image" />
                </div>  
                <div className="inner-event-body-right">
                  <div className="event-location-duration clearfix">
                    <div className="event-location-duration-left ">
                    <img src={`${handler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/duration.svg`}/> {StartDate} to {EndDate}
                    </div>
                    <div className="event-location-duration-right">
                      <img src={`${handler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/location.svg`}/> {Location}
                    </div>
                  </div>
                  <h4> {Title} </h4>
                  <p> {outputText} </p>
                </div>
              </li>
            );
          }        
      }
    });
    return (
      <div className={ styles.remoEventsVm }>
        <div className="container relative">
          <div className="section-rigth">
            <div className="inner-banner-header relative m-b-20">
              <div className="inner-banner-overlay"></div>
              <div className="inner-banner-contents">
                <h1> Events </h1>
                <ul className="breadcums">
                  <li>  <a href={`${this.props.siteurl}/SitePages/Home.aspx?env=WebView`} data-interception="off"> Home </a> </li>
                  <li>  <a href="#" style={{pointerEvents:"none"}}> Events </a> </li>
                </ul>
              </div>
            </div>
            <div className="inner-page-contents sec">
              <div className="row">
                <div className="col-md-6">
                  {/*<RevoCalendar
                    events={eventList}
                    date={new Date()}      
                    primaryColor="#33b6b2"
                    secondaryColor="#ffffff"
                    todayColor="#1bc7b3"
                    textColor="#333333"
                    indicatorColor="#15d732"              
                    showDetailToggler={false}
                    showSidebarToggler={true}
                    openDetailsOnDateSelection={false}
                    dateSelected={(date: Date) => {
                      this.GetSelectedDateEvents(date);                    
                    }}
                  />*/}

                  <div id="calendar"></div>
                    
                  
                </div>
                <div className="col-md-6">
                  <div className="inner-event-wrap">
                    <div className="inner-event-main-wrap">
                      <div className="inner-event-header">
                        {this.state.SelectedDate}
                      </div>
                      <div className="inner-event-body" id="if-event-present" style={{display:"none"}}>
                        <ul>
                          {EventsfromCalender}
                        </ul>
                      </div>

                      <div className="inner-event-body" id="if-no-event-present" style={{display:"none"}}>
                        <p>No events on selected date</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> 
        </div>
      </div>
    );
  }
}
