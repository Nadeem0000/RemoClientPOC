import { WebPartContext } from "@microsoft/sp-webpart-base";
import { MSGraphClient } from "@microsoft/sp-http";
import * as moment from 'moment';
export class ServiceProvider {
  public _graphClient: MSGraphClient;
  private spcontext: WebPartContext;
  public constructor(spcontext: WebPartContext) {
    this.spcontext = spcontext;
  }
//To get Current and Upcomming Meetings
  public getmytodaysroutine = async (): Promise<[]> => {
    this._graphClient = await this.spcontext.msGraphClientFactory.getClient(); //TODO       
    var td = moment().subtract(2,'days').format('YYYY-MM-DD');        
    //var enddate = moment().add(1,'days').format("YYYY-MM-DD");

    //var td = moment().format('YYYY-MM-DD');        
    var enddate = moment().add(1,'days').format("YYYY-MM-DD");
    let myroutineDatas: [] = [];        
    try {        
      //const meetingResponse = await this._graphClient.api(`/me/calendarView?startDateTime=${td}T21:00:00.000Z&endDateTime=${enddate}T21:00:00.000Z&$orderBy=start/dateTime`).top(499).version('v1.0').get();//&$'+filterstring+'
      const meetingResponse = await this._graphClient.api(`/me/calendarView?startDateTime=${td}T21:00:00.000Z&endDateTime=${enddate}T21:00:00.000Z&$orderBy=start/dateTime`).top(499).version('v1.0').get();//&$'+filterstring+'
      myroutineDatas = meetingResponse.value as [];        
    } catch (error) {
      console.log('Unable to get my Meetings Datas', error);
    }
    return myroutineDatas;
  }   
  
  public getmytodaysroutinepast = async (): Promise<[]> => {
    this._graphClient = await this.spcontext.msGraphClientFactory.getClient(); //TODO   
    var today = moment().subtract(2,'days').format('YYYY-MM-DD');
    var enddate = moment().add(1, "days").format("YYYY-MM-DD");
    let mypastroutineDatas: [] = [];
    //var filterstring = `start/dateTime ge %27${today}%27 and end/dateTime lt %27${enddate}%27`;
    var filterstring = `start/dateTime ge %27${today}%27 and end/dateTime lt %27${enddate}%27`;
    try {
      //const meetingResponse = await this._graphClient.api('me/events?$select=*,subject,body,bodyPreview,organizer,attendees,start,end,location&$orderby=end/dateTime asc&$top=499').filter(filterstring).version('v1.0').get();
      const meetingResponse = await this._graphClient.api(`/me/calendarView?startDateTime=${today}T21:00:00.000Z&endDateTime=${enddate}T21:00:00.000Z&$orderBy=start/dateTime`).top(499).version('v1.0').get();
      mypastroutineDatas = meetingResponse.value as [];      
    } catch (error) {
      console.log('Unable to get my Past Meetings Datas', error);
    }
    return mypastroutineDatas;
  }

  public getmytodaysroutinefuture = async (date): Promise<[]> => {
    //alert("FromService: " + LeftRightCounter);
    this._graphClient = await this.spcontext.msGraphClientFactory.getClient(); //TODO   
    var tmrrw = moment(date).subtract(2,'days').format('YYYY-MM-DD');    
    //var enddate = moment(tmrrw,'YYYY-MM-DD').add(1, "days").format("YYYY-MM-DD");
    var enddate = moment(tmrrw,'YYYY-MM-DD').add(2, "days").format("YYYY-MM-DD");
    let myfutureroutineDatas: [] = [];
    var filterstring = `start/dateTime ge %27${tmrrw}%27 and end/dateTime lt %27${enddate}%27`;
    try {
      //const meetingResponse = await this._graphClient.api('me/events?$select=*,subject,body,bodyPreview,organizer,attendees,start,end,location&$orderby=end/dateTime asc&$top=499').filter(filterstring).version('v1.0').get();
      //const meetingResponse = await this._graphClient.api(`/me/calendarView?startDateTime=${tmrrw}T21:00:00.000Z&endDateTime=${enddate}T21:00:00.000Z&$orderBy=start/dateTime`).top(499).version('v1.0').get();
      const meetingResponse = await this._graphClient.api(`/me/calendarView?startDateTime=${tmrrw}T21:00:00.000Z&endDateTime=${enddate}T21:00:00.000Z&$orderBy=start/dateTime`).top(499).version('v1.0').get();
      myfutureroutineDatas = meetingResponse.value as [];      
    } catch (error) {
      console.log('Unable to get my Future Meetings Datas', error);
    }
    return myfutureroutineDatas;
  }

  public getMyFutureMeetings = async (): Promise<[]> => {
    this._graphClient = await this.spcontext.msGraphClientFactory.getClient(); //TODO   
    var tday = moment().format('YYYY-MM-DD');
    var tmrrw = moment(tday).subtract(1, "days").format("YYYY-MM-DD");
    var enddate = moment(tmrrw).add(14, "days").format("YYYY-MM-DD");
    let myFutureEventDatas: [] = [];
    var filterstring = `start/dateTime ge %27${tmrrw}%27 and end/dateTime lt %27${enddate}%27`;
    try {
      //const meetingResponse = await this._graphClient.api('me/events?$select=*,subject,body,bodyPreview,organizer,attendees,start,end,location&$orderby=end/dateTime asc&$top=499').filter(filterstring).version('v1.0').get();
      const meetingResponse = await this._graphClient.api(`/me/calendarView?startDateTime=${tmrrw}T21:00:00.000Z&endDateTime=${enddate}T21:00:00.000Z&$orderBy=start/dateTime`).top(499).version('v1.0').get();
      myFutureEventDatas = meetingResponse.value as [];      
    } catch (error) {
      console.log('Unable to get my Future Meetings Datas', error);
    }
    return myFutureEventDatas;
  }
}