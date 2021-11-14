import { WebPartContext } from "@microsoft/sp-webpart-base";
import { MSGraphClient } from "@microsoft/sp-http";
import * as moment from 'moment';
export class ServiceProvider {
  public _graphClient: MSGraphClient;
  private spcontext: WebPartContext;
  public constructor(spcontext: WebPartContext) {
    this.spcontext = spcontext;
  }
  //To Get Unread Mail Count
  public getmymailcount = async (): Promise<[]> => {
    this._graphClient = await this.spcontext.msGraphClientFactory.getClient(); //TODO

    let myMailDatas: [] = [];
    try {
      const mailResponse = await this._graphClient.api('me/mailFolders/Inbox/messages?$filter=isRead ne true&$count=true&$top=5000').version('v1.0').get();
      //const mailResponse = await this._graphClient.api('me/mailFolders/Inbox/messages?$count=true&$top=5000').version('v1.0').get();
      myMailDatas = mailResponse.value as [];
    } catch (error) {
      console.log('Unable to get my mail count', error);
    }
    return myMailDatas;
  }
//To get Current and Upcomming Meetings
  public getmymeetingscount = async (): Promise<[]> => {
    this._graphClient = await this.spcontext.msGraphClientFactory.getClient(); //TODO 
    var today = moment().format('YYYY-MM-DD');
    let myMeetingsDatas: [] = [];
    var filterstring = `start/dateTime ge %27${today}%27`;
    var td = moment().format('YYYY-MM-DD');
    var enddate = moment(td).add(30, "days").format("YYYY-MM-DD");
    try {
      //const meetingResponse = await this._graphClient.api('me/calendar/events?$select=subject,body,bodyPreview,organizer,attendees,start,end,location&$orderby=end/dateTime asc&$top=499').filter(filterstring).version('v1.0').get();
      const meetingResponse = await this._graphClient.api('/me/calendarview?startdatetime='+td+'&enddatetime='+enddate+'&$orderBy=end/dateTime').top(499).version('v1.0').get();
      myMeetingsDatas = meetingResponse.value as [];
    } catch (error) {
      console.log('Unable to get my Meetings Datas', error);
    }
    return myMeetingsDatas;
  }    
}