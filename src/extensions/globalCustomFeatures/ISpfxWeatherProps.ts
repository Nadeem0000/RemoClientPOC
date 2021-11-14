import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ISpfxWeatherProps {
  description: string;
  siteurl: string;  
  context: WebPartContext;
  graphClient: any;
  CurrentPageName: string;
}
