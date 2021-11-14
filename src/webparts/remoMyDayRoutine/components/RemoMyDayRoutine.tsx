import * as React from 'react';
import styles from './RemoMyDayRoutine.module.scss';
import { IRemoMyDayRoutineProps } from './IRemoMyDayRoutineProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as moment from 'moment';
import * as $ from 'jquery';
import { ServiceProvider } from '../components/ServiceProvider/Service';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";
import { DatePicker } from 'office-ui-fabric-react/lib/DatePicker';
import ReactTooltip from "react-tooltip";

export interface IRemoMyDayRoutineState{
  myroutineDatas:any[];
  mypastroutineDatas:any[];
  myfutureroutineDatas:any[];
  MyQuickLinksPrefference:any[];
  MyQuickLinkData:any[];
  MarginValue:any;
  DynamicSectionWidth:any;

  WeekDates:any[];

  skippedFutureDate:string;
  SelectedDate:any;
  myFutureEventDatas:any[];
  IsCurrentFuture:string;
  IsCuurentMeetingPresent:string;

  FirstLoop:boolean;
}


let dywidth = "";


var uniqueTime=[];
var uniqueCountItem=[];
var uniqueCountItemFuture=[];
var uniqueCountItemFuture2=[];
export default class RemoMyDayRoutine extends React.Component<IRemoMyDayRoutineProps, IRemoMyDayRoutineState, {}>
    {
    private serviceProvider;    
    public constructor(props: IRemoMyDayRoutineProps, state: IRemoMyDayRoutineState){
    super(props);
    this.serviceProvider = new ServiceProvider(this.props.context);
    this.state = {
    myroutineDatas: [],
    mypastroutineDatas:[],
    myfutureroutineDatas:[],
    MyQuickLinksPrefference:[],
    MyQuickLinkData:[],
    MarginValue: 0,
    DynamicSectionWidth:0,

    WeekDates:[],
    skippedFutureDate:"",
    SelectedDate:"",
    myFutureEventDatas:[],
    IsCurrentFuture:"",
    IsCuurentMeetingPresent:"",
    FirstLoop:true,
    };
    }


    public componentDidMount(){              
      var reacthandler = this;     
      reacthandler.getmytodaysroutines();
      reacthandler.getmytodaysPastroutines();      
    }
    
    public getmytodaysroutines(){     
    uniqueTime=[];
    uniqueCountItem=[];
    this.serviceProvider.
    getmytodaysroutine()
    .then(
    (result: any[]): void => {        
    this.setState({myroutineDatas: result}); 
    var myMeetingscount = this.state.myroutineDatas.length;        
    
        for(var i=0; i< result.length; i++){
            var Starttime = moment.utc(result[i].start.dateTime);
            var Endtime = moment.utc(result[i].end.dateTime);
            let CTime = moment().format('DD-MM-YYYY');
            var subject = result[i].subject;
            
            if(moment(CTime,'DD-MM-YYYY').format('DD-MM-YYYY') == moment(Starttime).local().format('DD-MM-YYYY')){                
                uniqueCountItem.push(subject);
            }
        }

    if(uniqueCountItem.length == 0){        
        $(".present").hide();
        $("#current-event").hide();
        $(".future").show();
        this.getmyFutureEvents();
    }else{
        this.setState({IsCurrentFuture:""});        
        $(".future").hide();
        $(".present").show();
        $("#current-event").show();
        $("#dt-current").text(moment().format("DD/MM/YYYY") + " My Meetings");
        
        setTimeout(function(){
            $(".ms-TextField-field").val(moment().format("D/M/YYYY"));
        },1500);
    }
    }
    );
    }

    public getmytodaysPastroutines(){        
    this.serviceProvider.
    getmytodaysroutinepast()
    .then(
    (result: any[]): void => {        
    this.setState({mypastroutineDatas: result});        
    var myMeetingscount = this.state.mypastroutineDatas.length;
    for(var i = 0; i < myMeetingscount; i++){
        var PastMeetingTime = this.state.mypastroutineDatas[i].end.dateTime;
        let ShortEndTime = moment.utc(PastMeetingTime).local().format("HHMM");
        var now = moment().format("HHMM");
        if(ShortEndTime < now){
            $("#past-event").show();
        }
    }    
    }
    );   
    }

    public getmytodaysFutureroutines(date){
        uniqueCountItemFuture=[];
        this.serviceProvider.
        getmytodaysroutinefuture(date)
        .then(
        (result: any[]): void => {
        this.setState({myfutureroutineDatas: result}); 
        this.setState({IsCurrentFuture:"true"});   
        var myFutureMeetingscount = this.state.myfutureroutineDatas.length;


        for(var i=0; i< result.length; i++){
            var Starttime = moment.utc(result[i].start.dateTime);
            var Endtime = moment.utc(result[i].end.dateTime);
            let CTime = moment().format('DD-MM-YYYY');
            var subject = result[i].subject;
            
            if(moment(date).format('DD-MM-YYYY') == moment(Starttime).local().format('DD-MM-YYYY')){                
                uniqueCountItemFuture.push(subject);
            }
        }


        if(uniqueCountItemFuture.length == 0){
            $(".future").hide();
            $(".present").hide();
            $(".no-upcoming-events").show();
            $("#dt-upcoming").text("Plan your Schedule");
        }else{
            $(".present").hide();
            $(".no-upcoming-events").hide();
            $(".future").show();
        }

        let today = moment().format("DD-MM-YYYY");
        let selToday = moment(date,"D/M/YYYY").format("DD/MM/YYYY");
        
        let dt = moment(date,"D/M/YYYY").format("YYYY-M-D"); 

        let now = moment();
        let then = moment(dt);

        if (now > then) {
            $("#dt-upcoming").text("Past Events");
          } else if(now < then){              
            $("#dt-upcoming").text("Upcoming Events");     
            $(".fut-dt").hide();        
          }                    
        }
        );
        var dywidth = $(".dynamic-innerwidth-calc").width()-6;
        $(".ul-group").css("width",""+dywidth+"");    
        
        
    }

    public getmyFutureEvents(){
        this.serviceProvider.
        getMyFutureMeetings()
        .then(
        (result: any[]): void => {            
        this.setState({myfutureroutineDatas: result});    
        var myFutureMeetingscount = this.state.myfutureroutineDatas.length;
        
        if(myFutureMeetingscount == 0){
            $(".future").hide();
            $(".no-upcoming-events").show();
        }else{
            $(".present").hide();
            $(".no-upcoming-events").hide();
            $(".future").show();
            setTimeout(function(){
            $(".fut-dt").show();
            },200);
        }
        }
        );
    }

    public openoutlookcal = () =>{
    window.open(
    'https://outlook.office365.com/calendar/view/month',
    '_blank'
    );
    }

    public openteamsmeeting = (url) =>{
    window.open(
    ''+url+'',
    '_blank'
    );
    }
    
    public handler=(URL)=>{
    window.open(
    ''+URL+'',
    '_blank'
    );
    }


    private _onSelectDate = (date: Date | null | undefined): void => {
        this.setState({ SelectedDate: date });    
        this.getmytodaysFutureroutines(date);
        var selecteddt = moment(date).format("DDMMYYYY");
        var tdaydt = moment().format("DDMMYYYY");
        if(selecteddt ==  tdaydt){
            $("#dt-current").text(moment().format("DD/MM/YYYY") + " My Meetings"); 
            $("#dt-upcoming").empty();
            setTimeout(function(){
                $("#dt-upcoming").text(moment().format("DD/MM/YYYY") + " My Meetings"); 
            },800);          
        }
    }
 
    private _onFormatDate = (date: Date): string => {
        return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    }

    public render(): React.ReactElement<IRemoMyDayRoutineProps>
        {
        var today = moment().format("DD-MM-YYYY");
        
            var Focusthis = $('#current-event');
        if (Focusthis.length) {
            var TopValue = Focusthis.offset().top;
            $('.routine-timeline-scroll').animate({
                scrollTop: TopValue
            }, 'slow');
        }

        var reacthandler = this;
        var i = 0;

        const AllMyEvents: JSX.Element[] = this.state.myroutineDatas.map(function(item,key) {
            
            if(item.isAllDay == false){

                var Starttime = moment.utc(item.start.dateTime);            
                var Endtime = moment.utc(item.end.dateTime);

                var localStart = moment(Starttime).local().format("h:mma");
                var localEnd = moment(Endtime).local().format("h:mma");

                let isTeamsMeeting:any = item.isOnlineMeeting;
                let webink:any = item.webLink;
                let bodypreview = item.bodyPreview;
                let ETime = moment(Endtime).local().format('DD-MM-YYYY h:mma');
                let EnTime = moment(Endtime).local().format('YYYY-MM-DD h:mma');
                let CuTime = moment().format('YYYY-MM-DD h:mma');

                let CTime = moment().format('DD-MM-YYYY h:mma');
                let Curtime = moment().format('DD-MM-YYYY');

                if(isTeamsMeeting == true && moment(CTime,'DD-MM-YYYY h:mma').format('DD-MM-YYYY') == moment(Starttime).local().format('DD-MM-YYYY') && moment(EnTime,'YYYY-MM-DD h:mma').isAfter(moment(CuTime,'YYYY-MM-DD h:mma')) ){ // || moment(Curtime,'DD-MM-YYYY').isSameOrAfter(moment.utc(item.end.dateTime).local().format("DD-MM-YYYY")) && Curtime == moment(Starttime).format('DD-MM-YYYY')    && moment(CTime,'DD-MM-YYYY h:mma').isBefore(moment(ETime,'DD-MM-YYYY h:mma'))   && moment(CTime,'DD-MM-YYYY h:mma').isBefore(moment(ETime,'DD-MM-YYYY h:mma'))   && ETime > CTime || ETime == CTime // ShortStartTime >= currentTime &&  ShortStartTime >= currentTime &&  && ShortStartTime <= UpcommingTime
                   
                    return(
                        <li className="clearfix relative" id={ETime}>
                            <h5><img src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/clock.svg`} alt="Time"></img> {localStart} - {localEnd}</h5><img className="seperator" src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/line.svg`} alt="line"></img>
                            <h4>{item.subject}</h4><img className="seperator" src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/line.svg`} alt="line"></img>
                            <span id="teamsmeetingjoinlink-yes">
                                <a href="#" onClick={() => reacthandler.openteamsmeeting(item.onlineMeeting.joinUrl)} data-tip data-for={"React-tooltip"+key} data-custom-class="tooltip-custom">
                                    <img src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/microsoft-teams-logo.svg`}></img>
                                </a>
                                <ReactTooltip id={"React-tooltip"+key} place="right" type="dark" effect="solid">
                                  <span>Click to Join</span>
                                </ReactTooltip>
                            </span>
                            <div className="new-tooltip-event">
                                <div className="wrapper-of-tooltip">
                                    <h4>{item.subject}</h4>
                                    <p> {bodypreview} </p>
                                </div>
                            </div>
                        </li>
                    );
                }else if(isTeamsMeeting == false && moment(CTime,'DD-MM-YYYY h:mma').format('DD-MM-YYYY') == moment(Starttime).local().format('DD-MM-YYYY') && moment(EnTime,'YYYY-MM-DD h:mma').isAfter(moment(CuTime,'YYYY-MM-DD h:mma')) ){ // || moment().format("DD-MM-YYYY") <= moment(item.end.dateTime).local().format("DD-MM-YYYY")        && moment(CTime,'DD-MM-YYYY h:mma').isBefore(moment(ETime,'DD-MM-YYYY h:mma'))   && ETime > CTime || ETime == CTime  // ShortStartTime >= currentTime &&  && ShortStartTime <= UpcommingTime
                    return(
                        <li className="clearfix relative" id={ETime}>
                            <h5><img src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/clock.svg`} alt="Time"></img> {localStart} - {localEnd}</h5><img className="seperator" src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/line.svg`} alt="line"></img>
                            <h4>{item.subject}</h4> 
                            <div className="new-tooltip-event">
                                <div className="wrapper-of-tooltip">
                                    <h4>{item.subject}</h4>
                                    <p> {bodypreview} </p>
                                </div>
                            </div>                       
                        </li>
                    );
                }            
            }else{
                var Starttime = moment(item.start.dateTime);            
                var Endtime = moment(item.end.dateTime);
                var localStart = moment(Starttime).local().format("h:mma");
                var localEnd = moment(Endtime).local().format("h:mma");    
                let isTeamsMeeting:any = item.isOnlineMeeting;
                let webink:any = item.webLink;
                let bodypreview = item.bodyPreview;
                let ETime = moment(Endtime).local().format('DD-MM-YYYY h:mma');
                let EnTime = moment(Endtime).local().format('YYYY-MM-DD h:mma');
                let CuTime = moment().format('YYYY-MM-DD h:mma');
                let CTime = moment().format('DD-MM-YYYY h:mma');

                if(isTeamsMeeting == true && moment(CTime,'DD-MM-YYYY h:mma').format('DD-MM-YYYY') == moment(Starttime).local().format('DD-MM-YYYY') && moment(EnTime,'YYYY-MM-DD h:mma').isAfter(moment(CuTime,'YYYY-MM-DD h:mma')) || moment().format("DD-MM-YYYY") <= moment.utc(Endtime).local().format("DD-MM-YYYY") ){ // && moment(CTime,'DD-MM-YYYY h:mma').isBefore(moment(ETime,'DD-MM-YYYY h:mma'))   && moment(CTime,'DD-MM-YYYY h:mma').isBefore(moment(ETime,'DD-MM-YYYY h:mma'))   && ETime > CTime || ETime == CTime // ShortStartTime >= currentTime &&  ShortStartTime >= currentTime &&  && ShortStartTime <= UpcommingTime
                    return(
                        <li className="clearfix relative" id={ETime}>
                            <h5><img src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/clock.svg`} alt="Time"></img> {localStart} - {localEnd}</h5><img className="seperator" src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/line.svg`} alt="line"></img>
                            <h4>{item.subject}</h4><img className="seperator" src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/line.svg`} alt="line"></img>
                            <span id="teamsmeetingjoinlink-yes">
                                <a href="#" onClick={() => reacthandler.openteamsmeeting(item.onlineMeeting.joinUrl)} data-tip data-for={"React-tooltip"+key} data-custom-class="tooltip-custom">
                                    <img src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/microsoft-teams-logo.svg`}></img>
                                </a>
                                <ReactTooltip id={"React-tooltip"+key} place="right" type="dark" effect="solid">
                                  <span>Click to Join</span>
                                </ReactTooltip>
                            </span>
                            <div className="new-tooltip-event">
                                <div className="wrapper-of-tooltip">
                                    <h4>{item.subject}</h4>
                                    <p> {bodypreview} </p>
                                </div>
                            </div>
                        </li>
                    );
                }else if(isTeamsMeeting == false && moment(CTime,'DD-MM-YYYY h:mma').format('DD-MM-YYYY') == moment(Starttime).local().format('DD-MM-YYYY') && moment(EnTime,'YYYY-MM-DD h:mma').isAfter(moment(CuTime,'YYYY-MM-DD h:mma')) || moment().format("DD-MM-YYYY") <= moment.utc(Endtime).local().format("DD-MM-YYYY") ){ // && moment(CTime,'DD-MM-YYYY h:mma').isBefore(moment(ETime,'DD-MM-YYYY h:mma'))   && ETime > CTime || ETime == CTime  // ShortStartTime >= currentTime &&  && ShortStartTime <= UpcommingTime
                    return(
                        <li className="clearfix relative" id={ETime}>
                            <h5><img src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/clock.svg`} alt="Time"></img> {localStart} - {localEnd}</h5><img className="seperator" src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/line.svg`} alt="line"></img>
                            <h4>{item.subject}</h4> 
                            <div className="new-tooltip-event">
                                <div className="wrapper-of-tooltip">
                                    <h4>{item.subject}</h4>
                                    <p> {bodypreview} </p>
                                </div>
                            </div>                       
                        </li>
                    );
                }
            }
        });
        
        const AllMyPastEvents: JSX.Element[] = this.state.mypastroutineDatas.map(function(item,key) {
            if(item.isAllDay == false){
                var currentTime = moment().format("HHMM");
                var UpcommingTime =  moment().add(3, 'hours').format("HH");
                var Starttime = moment.utc(item.start.dateTime);
                var Endtime = moment.utc(item.end.dateTime);
                let ShortStartTime = moment(Starttime).local().format("HH");
                let ShortEndTime = moment(Endtime).local().format("HHMM");
                var localStart = moment(Starttime).local().format("h:mma");
                var localEnd = moment(Endtime).local().format("h:mma");
                let isTeamsMeeting:any = item.isOnlineMeeting;
                let webink:any = item.webLink;
                let bodypreview = item.bodyPreview;   
                
                let ETime = moment(Endtime).local().format("YYYY-MM-DD h:mma");
                let CTime = moment().format("YYYY-MM-DD h:mma");

                if(isTeamsMeeting == true  && moment(CTime,'YYYY-MM-DD h:mma').format('DD-MM-YYYY') == moment(Starttime).local().format('DD-MM-YYYY') && moment(ETime,'YYYY-MM-DD h:mma').isBefore(moment(CTime,'YYYY-MM-DD h:mma'))){// && moment(ETime,'h:mma').isBefore(moment(CTime,'h:mma')) && ShortEndTime < currentTime  // && ShortEndTime < currentTime
                    return(
                        <li className="clearfix relative ended">
                            <h5><img src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/clock.svg`} alt="Time"></img> {localStart} - {localEnd}</h5><img className="seperator" src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/line.svg`} alt="line"></img>
                            <h4>{item.subject}</h4><img className="seperator" src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/line.svg`} alt="line"></img>
                            <span id="teamsmeetingjoinlink-yes">
                                <a href="#" onClick={() => reacthandler.openteamsmeeting(item.onlineMeeting.joinUrl)} data-tip data-for={"React-tooltip"+key} data-custom-class="tooltip-custom" >
                                    <img src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/microsoft-teams-logo.svg`}></img>
                                </a>
                                <ReactTooltip id={"React-tooltip"+key} place="right" type="dark" effect="solid">
                                  <span>Click to Join</span>
                                </ReactTooltip>
                            </span>
                            <div className="new-tooltip-event">
                                <div className="wrapper-of-tooltip">
                                    <h4>{item.subject}</h4>
                                    <p> {bodypreview} </p>
                                </div>
                            </div>
                        </li>
                    );
                }
                else if(isTeamsMeeting == false && moment(CTime,'YYYY-MM-DD h:mma').format('DD-MM-YYYY') == moment(Starttime).local().format('DD-MM-YYYY') && moment(ETime,'YYYY-MM-DD h:mma').isBefore(moment(CTime,'YYYY-MM-DD h:mma'))){ // && ShortEndTime < currentTime  // && ShortEndTime < currentTime
                    return(
                        <li className="clearfix relative ended">
                            <h5><img src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/clock.svg`} alt="Time"></img> {localStart} - {localEnd}</h5><img className="seperator" src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/line.svg`} alt="line"></img>
                            <h4>{item.subject}</h4> 
                            <div className="new-tooltip-event">
                                <div className="wrapper-of-tooltip">
                                    <h4>{item.subject}</h4>
                                    <p> {bodypreview} </p>
                                </div>
                            </div>                       
                        </li>
                    );
                }

            }else{
                var Starttime = moment(item.start.dateTime);
                var Endtime = moment(item.end.dateTime);
                var localStart = moment(Starttime).local().format("h:mma");
                var localEnd = moment(Endtime).local().format("h:mma");
                let isTeamsMeeting:any = item.isOnlineMeeting;
                let webink:any = item.webLink;
                let bodypreview = item.bodyPreview;   
                
                let ETime = moment(Endtime).local().format("YYYY-MM-DD h:mma");
                let CTime = moment().format("YYYY-MM-DD h:mma");

                if(isTeamsMeeting == true  && moment(CTime,'YYYY-MM-DD h:mma').format('DD-MM-YYYY') == moment(Starttime).local().format('DD-MM-YYYY') && moment(ETime,'YYYY-MM-DD h:mma').isBefore(moment(CTime,'YYYY-MM-DD h:mma'))){// && moment(ETime,'h:mma').isBefore(moment(CTime,'h:mma')) && ShortEndTime < currentTime  // && ShortEndTime < currentTime
                    return(
                        <li className="clearfix relative ended">
                            <h5><img src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/clock.svg`} alt="Time"></img> {localStart} - {localEnd}</h5><img className="seperator" src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/line.svg`} alt="line"></img>
                            <h4>{item.subject}</h4><img className="seperator" src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/line.svg`} alt="line"></img>
                            <span id="teamsmeetingjoinlink-yes">
                                <a href="#" onClick={() => reacthandler.openteamsmeeting(item.onlineMeeting.joinUrl)} data-tip data-for={"React-tooltip"+key} data-custom-class="tooltip-custom">
                                    <img src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/microsoft-teams-logo.svg`}></img>
                                </a>
                                <ReactTooltip id={"React-tooltip"+key} place="right" type="dark" effect="solid">
                                  <span>Click to Join</span>
                                </ReactTooltip>
                            </span>
                            <div className="new-tooltip-event">
                                <div className="wrapper-of-tooltip">
                                    <h4>{item.subject}</h4>
                                    <p> {bodypreview} </p>
                                </div>
                            </div>
                        </li>
                    );
                }
                else if(isTeamsMeeting == false && moment(CTime,'YYYY-MM-DD h:mma').format('DD-MM-YYYY') == moment(Starttime).local().format('DD-MM-YYYY') && moment(ETime,'YYYY-MM-DD h:mma').isBefore(moment(CTime,'YYYY-MM-DD h:mma'))){ // && ShortEndTime < currentTime  // && ShortEndTime < currentTime
                    return(
                        <li className="clearfix relative ended">
                            <h5><img src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/clock.svg`} alt="Time"></img> {localStart} - {localEnd}</h5><img className="seperator" src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/line.svg`} alt="line"></img>
                            <h4>{item.subject}</h4> 
                            <div className="new-tooltip-event">
                                <div className="wrapper-of-tooltip">
                                    <h4>{item.subject}</h4>
                                    <p> {bodypreview} </p>
                                </div>
                            </div>                       
                        </li>
                    );
                }
            }         
        });

        const AllMyEventsFuture: JSX.Element[] = this.state.myfutureroutineDatas.map(function(item,key) {
            if(item.isAllDay == false){
                var currentTime = moment().format("HH");
                var UpcommingTime =  moment().add(3, 'hours').format("HH");
                var Starttime = moment.utc(item.start.dateTime);
                var Endtime = moment.utc(item.end.dateTime);

                let ShortStartTime = moment.utc(Starttime).local().format("HH");
                let ShortEndTime = moment.utc(Endtime).local().format("HH");
                var localStartDate = moment.utc(Starttime).local().format("DD-MM-YYYY,");
                var localStart = moment.utc(Starttime).local().format("hh:mma");
                var localEnd = moment.utc(Endtime).local().format("hh:mma");
                let isTeamsMeeting:any = item.isOnlineMeeting;
                let webink:any = item.webLink;
                let bodypreview = item.bodyPreview;  
                
                if(reacthandler.state.IsCurrentFuture == ""){
                    if(isTeamsMeeting == true){
                        return(
                            <li className="clearfix relative" id={moment.utc(Starttime).local().format("DD-MM-YYYY")}>
                                <h5><img src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/clock.svg`} alt="Time"></img> <span className="fut-dt" style={{display:"none"}}>{localStartDate} </span>{localStart} - {localEnd}</h5><img className="seperator" src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/line.svg`} alt="line"></img>
                                <h4>{item.subject}</h4><img className="seperator" src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/line.svg`} alt="line"></img>
                                <span id="teamsmeetingjoinlink-yes">
                                    <a href="#" onClick={() => reacthandler.openteamsmeeting(item.onlineMeeting.joinUrl)} data-tip data-for={"React-tooltip"+key} data-custom-class="tooltip-custom">
                                        <img src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/microsoft-teams-logo.svg`}></img>
                                    </a>
                                    <ReactTooltip id={"React-tooltip"+key} place="right" type="dark" effect="solid">
                                  <span>Click to Join</span>
                                </ReactTooltip>
                                </span>
                                <div className="new-tooltip-event">
                                <div className="wrapper-of-tooltip">
                                    <h4>{item.subject}</h4>
                                    <p> {bodypreview} </p>
                                </div>
                            </div>
                            </li>
                        );
                    }else if(isTeamsMeeting == false){
                        return(
                            <li className="clearfix relative" id={moment.utc(Starttime).local().format("DD-MM-YYYY")}>
                                <h5><img src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/clock.svg`} alt="Time"></img> <span className="fut-dt" style={{display:"none"}}>{localStartDate} </span> {localStart} - {localEnd}</h5><img className="seperator" src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/line.svg`} alt="line"></img>
                                <h4>{item.subject}</h4> 
                                <div className="new-tooltip-event">
                                <div className="wrapper-of-tooltip">
                                    <h4>{item.subject}</h4>
                                    <p> {bodypreview} </p>
                                </div>
                            </div>                       
                            </li>
                        );
                    }
                }else{
                    if(reacthandler.state.SelectedDate !=""){
                        var selecteddt = moment(reacthandler.state.SelectedDate).format("DD-MM-YYYY");
                        var tdaydt = moment().format("DD-MM-YYYY");

                        var stime = moment(Starttime).local().format("DD-MM-YYYY");

                        let dt = moment(reacthandler.state.SelectedDate).format("YYYY-M-D");
                        let Today = moment().format("YYYY-M-D"); 
                        let now = moment(Today);
                        let then = moment(dt);


                        if(isTeamsMeeting == true && moment(reacthandler.state.SelectedDate).format("DD-MM-YYYY") == moment(Starttime).local().format("DD-MM-YYYY") || moment(reacthandler.state.SelectedDate).format("DD-MM-YYYY") <= moment(Endtime).local().format("DD-MM-YYYY") ){
                            return(
                                <li className="clearfix relative same" id={stime}>
                                    <h5><img src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/clock.svg`} alt="Time"></img> {localStart} - {localEnd}</h5><img className="seperator" src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/line.svg`} alt="line"></img>
                                    <h4>{item.subject}</h4><img className="seperator" src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/line.svg`} alt="line"></img>
                                    <span id="teamsmeetingjoinlink-yes">
                                        <a href="#" onClick={() => reacthandler.openteamsmeeting(item.onlineMeeting.joinUrl)} data-tip data-for={"React-tooltip"+key} data-custom-class="tooltip-custom">
                                            <img src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/microsoft-teams-logo.svg`}></img>
                                        </a>
                                        <ReactTooltip id={"React-tooltip"+key} place="right" type="dark" effect="solid">
                                  <span>Click to Join</span>
                                </ReactTooltip>
                                    </span>
                                    <div className="new-tooltip-event">
                                <div className="wrapper-of-tooltip">
                                    <h4>{item.subject}</h4>
                                    <p> {bodypreview} </p>
                                </div>
                            </div>
                                </li>
                            );
                        }
                        else if(isTeamsMeeting == false && moment(reacthandler.state.SelectedDate).format("DD-MM-YYYY") == moment(Starttime).local().format("DD-MM-YYYY") || moment(reacthandler.state.SelectedDate).format("DD-MM-YYYY") <= moment(Endtime).local().format("DD-MM-YYYY") ){
                            return(
                                <li className="clearfix relative samefalse" id={stime}>
                                    <h5><img src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/clock.svg`} alt="Time"></img> {localStart} - {localEnd}</h5><img className="seperator" src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/line.svg`} alt="line"></img>
                                    <h4>{item.subject}</h4> 
                                    <div className="new-tooltip-event">
                                <div className="wrapper-of-tooltip">
                                    <h4>{item.subject}</h4>
                                    <p> {bodypreview} </p>
                                </div>
                            </div>                       
                                </li>
                            );
                        }                
                    }
                }   
            }else{
                var currentTime = moment().format("HH");
                var UpcommingTime =  moment().add(3, 'hours').format("HH");
                var Starttime = moment(item.start.dateTime);
                var Endtime = moment(item.end.dateTime);

                let ShortStartTime = moment(Starttime).local().format("HH");
                let ShortEndTime = moment(Endtime).local().format("HH");
                var localStartDate = moment(Starttime).local().format("DD-MM-YYYY,");
                var localStart = moment(Starttime).local().format("hh:mma");
                var localEnd = moment(Endtime).local().format("hh:mma");
                let isTeamsMeeting:any = item.isOnlineMeeting;
                let webink:any = item.webLink;
                let bodypreview = item.bodyPreview;  
                
                if(reacthandler.state.IsCurrentFuture == ""){
                    if(isTeamsMeeting == true){
                        return(
                            <li className="clearfix relative" id={moment.utc(Starttime).local().format("DD-MM-YYYY")}>
                                <h5><img src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/clock.svg`} alt="Time"></img> <span className="fut-dt" style={{display:"none"}}>{localStartDate} </span>{localStart} - {localEnd}</h5><img className="seperator" src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/line.svg`} alt="line"></img>
                                <h4>{item.subject}</h4><img className="seperator" src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/line.svg`} alt="line"></img>
                                <span id="teamsmeetingjoinlink-yes">
                                    <a href="#" onClick={() => reacthandler.openteamsmeeting(item.onlineMeeting.joinUrl)} data-tip data-for={"React-tooltip"+key} data-custom-class="tooltip-custom">
                                        <img src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/microsoft-teams-logo.svg`}></img>
                                    </a>
                                    <ReactTooltip id={"React-tooltip"+key} place="right" type="dark" effect="solid">
                                  <span>Click to Join</span>
                                </ReactTooltip>
                                </span>
                                <div className="new-tooltip-event">
                                <div className="wrapper-of-tooltip">
                                    <h4>{item.subject}</h4>
                                    <p> {bodypreview} </p>
                                </div>
                            </div>
                            </li>
                        );
                    }else if(isTeamsMeeting == false){
                        return(
                            <li className="clearfix relative" id={moment.utc(Starttime).local().format("DD-MM-YYYY")}>
                                <h5><img src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/clock.svg`} alt="Time"></img> <span className="fut-dt" style={{display:"none"}}>{localStartDate} </span> {localStart} - {localEnd}</h5><img className="seperator" src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/line.svg`} alt="line"></img>
                                <h4>{item.subject}</h4> 
                                <div className="new-tooltip-event">
                                <div className="wrapper-of-tooltip">
                                    <h4>{item.subject}</h4>
                                    <p> {bodypreview} </p>
                                </div>
                            </div>                       
                            </li>
                        );
                    }
                }else{
                    if(reacthandler.state.SelectedDate !=""){
                        var selecteddt = moment(reacthandler.state.SelectedDate).format("DD-MM-YYYY");
                        var tdaydt = moment().format("DD-MM-YYYY");

                        var stime = moment(Starttime).local().format("DD-MM-YYYY");

                        let dt = moment(reacthandler.state.SelectedDate).format("YYYY-M-D");
                        let Today = moment().format("YYYY-M-D"); 
                        let now = moment(Today);
                        let then = moment(dt);


                        if(isTeamsMeeting == true && moment(reacthandler.state.SelectedDate).format("DD-MM-YYYY") == moment(Starttime).local().format("DD-MM-YYYY") || moment(reacthandler.state.SelectedDate).format("DD-MM-YYYY") < moment.utc(Endtime).local().format("DD-MM-YYYY") ){
                            return(
                                <li className="clearfix relative same" id={stime}>
                                    <h5><img src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/clock.svg`} alt="Time"></img> {localStart} - {localEnd}</h5><img className="seperator" src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/line.svg`} alt="line"></img>
                                    <h4>{item.subject}</h4><img className="seperator" src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/line.svg`} alt="line"></img>
                                    <span id="teamsmeetingjoinlink-yes">
                                        <a href="#" onClick={() => reacthandler.openteamsmeeting(item.onlineMeeting.joinUrl)} data-tip data-for={"React-tooltip"+key} data-custom-class="tooltip-custom">
                                            <img src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/microsoft-teams-logo.svg`}></img>
                                        </a>
                                        <ReactTooltip id={"React-tooltip"+key} place="right" type="dark" effect="solid">
                                  <span>Click to Join</span>
                                </ReactTooltip>
                                    </span>
                                    <div className="new-tooltip-event">
                                <div className="wrapper-of-tooltip">
                                    <h4>{item.subject}</h4>
                                    <p> {bodypreview} </p>
                                </div>
                            </div>
                                </li>
                            );
                        }
                        else if(isTeamsMeeting == false && moment(reacthandler.state.SelectedDate).format("DD-MM-YYYY") == moment(Starttime).local().format("DD-MM-YYYY") || moment(reacthandler.state.SelectedDate).format("DD-MM-YYYY") < moment.utc(Endtime).local().format("DD-MM-YYYY") ){
                            return(
                                <li className="clearfix relative samefalse" id={stime}>
                                    <h5><img src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/clock.svg`} alt="Time"></img> {localStart} - {localEnd}</h5><img className="seperator" src={`${reacthandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/line.svg`} alt="line"></img>
                                    <h4>{item.subject}</h4> 
                                    <div className="new-tooltip-event">
                                <div className="wrapper-of-tooltip">
                                    <h4>{item.subject}</h4>
                                    <p> {bodypreview} </p>
                                </div>
                            </div>                       
                                </li>
                            );
                        }                
                    }
                }   
            }
        });           
       
        return (
        <div className={[styles.remoMyDayRoutine,"m-b-20 m-b-50 m-b-routine clearfix"].join(' ')}>
            <div className="routine-wrap">
                <div className="sec dynamic-innerwidth-calc shadoww">
                    <div className="Ssec-wrapper">
                        {/*For Present*/}
                        <div className="today-routine-blockk present" style={{display:"none"}}>
                            <div className="routine-Heading clearfix" id="current-date">                                                                
                            <span id="dt-current"> My Meetings </span>                            
                                <DatePicker placeholder="Select a date..."
                                    onSelectDate={this._onSelectDate}
                                    value={this.state.SelectedDate}
                                    formatDate={this._onFormatDate}
                                    isMonthPickerVisible={false}
                                />
                            </div>

                            <div className="routine-time-wrap scroller">
                                <div className="routine-timeline routine-timeline-scroll" id="top-parent-event" style={{'position': 'relative','marginLeft':''+this.state.MarginValue+''}}>
                                    <ul id="past-event" style={{display:"none"}}>
                                        {AllMyPastEvents}
                                    </ul>
                                    <ul id="current-event">
                                        {AllMyEvents}
                                    </ul>                                     
                                </div>                                
                            </div>
                        </div>

                        {/*For Future*/}
                        <div className="today-routine-blockk future" style={{display:"none"}}>
                            <div className="routine-Heading clearfix" id="current-date-future">                                  
                            <span id="dt-upcoming"> Upcoming Events </span>                            
                                <DatePicker placeholder="Select a date..."
                                    onSelectDate={this._onSelectDate}
                                    value={this.state.SelectedDate}
                                    formatDate={this._onFormatDate}
                                    isMonthPickerVisible={false}
                                />
                            </div>

                            <div className="routine-time-wrap scroller">
                                <div className="routine-timeline routine-timeline-noscroll" style={{'position': 'relative','marginLeft':''+this.state.MarginValue+''}}>                                    
                                    <ul id="current-event-future">
                                        {AllMyEventsFuture}
                                    </ul>                                                                       
                                </div>                                
                            </div>
                        </div>

                        {/*For No Events*/}
                        <div className="today-routine-blockk no-upcoming-events" style={{display:"none"}}>
                            <div className="routine-Heading clearfix">                                  
                            <span id="dt-upcoming-no-events"> Schedule your Event </span>                            
                                <DatePicker placeholder="Select a date..."
                                    onSelectDate={this._onSelectDate}
                                    value={this.state.SelectedDate}
                                    formatDate={this._onFormatDate}
                                    isMonthPickerVisible={false}
                                />
                            </div>

                            <div className="routine-time-wrap scroller">
                                <div className="routine-timeline" style={{'position': 'relative','marginLeft':''+this.state.MarginValue+''}}>                                    
                                    <div className="Schedule-ur-event">
                                        <a href="#" onClick={()=>this.openoutlookcal()}><i className="fa fa-calendar" aria-hidden="true"></i>Schedule Now</a>
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
