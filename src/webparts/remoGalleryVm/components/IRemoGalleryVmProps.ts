import { SPHttpClient } from '@microsoft/sp-http';  
export interface IRemoGalleryVmProps {
  description: string;
  siteurl: string;
  spHttpClient: SPHttpClient;
}
