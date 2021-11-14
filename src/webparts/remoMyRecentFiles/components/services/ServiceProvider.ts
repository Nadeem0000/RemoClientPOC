import { WebPartContext } from "@microsoft/sp-webpart-base";
import { MSGraphClient } from "@microsoft/sp-http";
import * as moment from 'moment';
export class ServiceProvider {
  public _graphClient: MSGraphClient;
  private spcontext: WebPartContext;
  public constructor(spcontext: WebPartContext) {
    this.spcontext = spcontext;
  }
  //To Get recents
  public getMyDriveRecents = async (): Promise<[]> => {
    this._graphClient = await this.spcontext.msGraphClientFactory.getClient(); //TODO    
    let myDriveRecents: [] = [];
    try{
      const teamsResponse2 = await this._graphClient.api('/me/drive/recent').version('v1.0').get();
      myDriveRecents = teamsResponse2.value as [];
    }catch(error){
      console.log('unable to get myDriveRecents', error);
    }
    return myDriveRecents;
  }   
}