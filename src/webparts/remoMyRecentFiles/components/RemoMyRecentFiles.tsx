import * as React from 'react';
import styles from './RemoMyRecentFiles.module.scss';
import { IRemoMyRecentFilesProps } from './IRemoMyRecentFilesProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { ServiceProvider } from '../components/services/ServiceProvider';
import { SPComponentLoader } from '@microsoft/sp-loader';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as $ from 'jquery';
import { ICamlQuery } from "@pnp/sp/lists";
import "@pnp/sp/folders";
import { sp } from "@pnp/sp";
import { Web } from "@pnp/sp/webs";   
import { Item, Items } from '@pnp/sp/items';
import * as moment from 'moment';

export interface IRemoMyRecentFilesState {
  myonedriveRecentData:any[];
}

export default class RemoMyRecentFiles extends React.Component<IRemoMyRecentFilesProps, IRemoMyRecentFilesState,{}> {
  private serviceProvider;
  public constructor(props: IRemoMyRecentFilesProps, state: IRemoMyRecentFilesState) {
    super(props);
    this.serviceProvider = new ServiceProvider(this.props.context);   
    
    this.state = {
      myonedriveRecentData: [],
    }
  }

  public componentDidMount(){
    this.GetMyOneDriveRecents();
    this.calculateDynamicHeight();
  }


  public GetMyOneDriveRecents(){
    this.serviceProvider.
    getMyDriveRecents()
      .then(
        (result: any[]): void => {          
          this.setState({ myonedriveRecentData: result });          
        }               
      )
      .catch(error => {
        console.log(error);
      });
  }
  public calculateDynamicHeight(){
    
      setTimeout(function(){
        let nwsheight = document.getElementById('m-b-20-news').offsetHeight;
        let socialHeight = document.getElementById('events-and-anncmnts').offsetHeight;
        let videoHeight = document.getElementById('social-and-gallery').offsetHeight;
        let TotalHeightLeft = nwsheight+socialHeight+videoHeight;

        let weatherHeight = document.getElementById('m-b-20-weather').offsetHeight;
        let Highlights = document.getElementById('bday-highlights').offsetHeight;
        let pQlinkHeight = 0;
        let TotalHeightRight = 0;
        let TotalCalculatedHeight;
        var Focusthis = $('#m-b-20-PQlink');
        if (Focusthis.length) {
            pQlinkHeight = document.getElementById('m-b-20-PQlink').offsetHeight;
            TotalHeightRight = weatherHeight+Highlights+pQlinkHeight;

            TotalCalculatedHeight = TotalHeightLeft - TotalHeightRight+37;// - 66;//47;//66 ;
            $("#dynamic-height-recentsfiles").css("height",""+TotalCalculatedHeight+"");
        }else{
            TotalCalculatedHeight = TotalHeightLeft - TotalHeightRight+37;// - 47;//66 ;
            $("#dynamic-height-recentsfiles").css("height",""+TotalCalculatedHeight+"");
        }
        //console.log("news:"+nwsheight+"Social:"+socialHeight+"Vide:"+videoHeight+"weath:"+weatherHeight+"Pqlink:"+pQlinkHeight+"bday:"+Highlights);
        
      },1500);

      setTimeout(function(){
        let nwsheight = document.getElementById('m-b-20-news').offsetHeight;
        let socialHeight = document.getElementById('events-and-anncmnts').offsetHeight;
        let videoHeight = document.getElementById('social-and-gallery').offsetHeight;
        let TotalHeightLeft = nwsheight+socialHeight+videoHeight;

        let weatherHeight = document.getElementById('m-b-20-weather').offsetHeight;
        let Highlights = document.getElementById('bday-highlights').offsetHeight;
        let pQlinkHeight = 0;
        let TotalHeightRight = 0;
        let TotalCalculatedHeight;
        var Focusthis = $('#m-b-20-PQlink');
        if (Focusthis.length) {
            pQlinkHeight = document.getElementById('m-b-20-PQlink').offsetHeight;
            TotalHeightRight = weatherHeight+Highlights+pQlinkHeight;

            TotalCalculatedHeight = TotalHeightLeft - TotalHeightRight+37;// - 66;//47;//66 ;
            $("#dynamic-height-recentsfiles").css("height",""+TotalCalculatedHeight+"");
        }else{
            TotalCalculatedHeight = TotalHeightLeft - TotalHeightRight+37;// - 47;//66 ;
            $("#dynamic-height-recentsfiles").css("height",""+TotalCalculatedHeight+"");
        }
        //console.log("news:"+nwsheight+"Social:"+socialHeight+"Vide:"+videoHeight+"weath:"+weatherHeight+"Pqlink:"+pQlinkHeight+"bday:"+Highlights);
        
      },2000);

}
  public render(): React.ReactElement<IRemoMyRecentFilesProps> {
    var reactHandler = this;    
    const OneDriveRecents: JSX.Element[] = reactHandler.state.myonedriveRecentData.map(function (item, key) {        
        var FileTypeImg="";
          var filename=item.name;                       
          var Len = filename.length; 
          var Dot = filename.lastIndexOf(".");
          var extension = filename.substring(Dot+1, Len);
          if(extension != "csv"){
            if(extension == 'docx' || extension == 'doc' || extension == 'pdf' || extension == 'xlsx' || extension == 'pptx' || extension == 'url' || extension == 'txt' || extension == 'css' || extension == 'sppkg' || extension == 'ts' || extension == 'tsx' || extension == 'html' || extension == 'aspx' || extension == 'ts' || extension == 'js' || extension == 'map' || extension == 'php' || extension == 'json' || extension == 'xml' ||
              extension == 'png' || extension == 'PNG' || extension == 'JPG' || extension == 'JPEG'  || extension == 'SVG' || extension == 'svg' || extension == 'jpg' || extension == 'jpeg' || extension == 'gif' || 
              extension == "zip" || extension == "rar"){
              if(extension == 'docx' || extension == 'doc'){
                FileTypeImg = `${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/FluentIcons/WordFluent.png`;                
              }
              if(extension == 'pdf'){
                FileTypeImg = `${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/FluentIcons/pdf.svg`;
              }
              if(extension == 'xlsx'){
                FileTypeImg = `${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/FluentIcons/ExcelFluent.png`;
              }
              if(extension == 'pptx'){
                FileTypeImg = `${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/FluentIcons/PPTFluent.png`;
              }
              if(extension == 'url'){
                FileTypeImg = `${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/FluentIcons/URL.png`;
              }
              if(extension == 'txt'){
                FileTypeImg = `${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/FluentIcons/txt.svg`;
              }
              if(extension == 'css' || extension == 'sppkg' || extension == 'ts' || extension == 'tsx' || extension == 'html' || extension == 'aspx' || extension == 'ts' || extension == 'js' || extension == 'map' || extension == 'php' || extension == 'json' || extension == 'xml'){
                FileTypeImg = `${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/FluentIcons/Code.svg`;
              }
              if(extension == 'png' || extension == 'PNG' || extension == 'JPG' || extension == 'JPEG'  || extension == 'SVG' || extension == 'svg' || extension == 'jpg' || extension == 'jpeg' || extension == 'gif'){
                FileTypeImg = `${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/FluentIcons/photo.svg`;
              }
              if(extension == "zip" || extension == "rar"){
                FileTypeImg=`${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/FluentIcons/zip.svg`;
              }
              return(  
                <li>          
                <a href={item.webUrl} data-interception="off" target="_blank" className="clearfix"> 
                  <img src={FileTypeImg} alt="images"/> 
                    <div className="recent-files-block clearfix">
                        <div className="recent-files-wrap-left">
                            <h4> {item.name} </h4>
                            <h5> {extension} </h5>
                        </div>
                        <div className="recent-files-wrap-right">
                            <h5> {moment(item.lastModifiedDateTime).format('MMM DD h:mm a')} </h5>
                        </div>
                    </div>
                </a>    
              </li>
              );   
            }
          }
               
    });
    return (
      <div className={ styles.remoMyRecentFiles }>
        <div className="recent-file-wrap">
          <div className="sec" id="dynamic-height-recentsfiles-1">
            <div className="heading">
              Recent Files
            </div>
            <div className="section-part clearfix" id="dynamic-height-recentsfiles">
              <ul>
                  {OneDriveRecents}    
              </ul>
            </div>    
          </div> 
        </div>
      </div>
    );
  }
}
