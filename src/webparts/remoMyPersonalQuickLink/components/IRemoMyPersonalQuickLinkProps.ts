import { WebPartContext } from "@microsoft/sp-webpart-base";
export interface IRemoMyPersonalQuickLinkProps {
  description: string;
  siteurl:string;
  context: WebPartContext;
  userid:any;
}