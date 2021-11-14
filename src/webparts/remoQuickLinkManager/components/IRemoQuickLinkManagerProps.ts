import { SPHttpClient } from '@microsoft/sp-http';  

export interface IRemoQuickLinkManagerProps {
  description: string;
  siteurl:string;
  userid:any;
  spHttpClient: SPHttpClient;  
}