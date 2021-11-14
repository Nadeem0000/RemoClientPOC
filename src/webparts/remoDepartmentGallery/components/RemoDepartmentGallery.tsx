import * as React from 'react';
import styles from './RemoDepartmentGallery.module.scss';
import { IRemoDepartmentGalleryProps } from './IRemoDepartmentGalleryProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as $ from 'jquery';
import { SPComponentLoader } from '@microsoft/sp-loader';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/folders";
import { sp } from "@pnp/sp";
import { Web } from "@pnp/sp/webs";   

export interface IRemoDepartmentGalleryState {  
  Items:any[];
  Galleryitems:any[];  
  VideoItemsss:any[]; 
}

var FolderNames = [];
var FolderNamesExits= [];

var FolderNamesVideo = [];
var FolderNamesExitsVideo= [];

export default class RemoDepartmentGallery extends React.Component<IRemoDepartmentGalleryProps, IRemoDepartmentGalleryState,{}> {
  public constructor(props: IRemoDepartmentGalleryProps, state: IRemoDepartmentGalleryState) {
    super(props);
    this.state = {
      Items: [],
      Galleryitems: [],
      VideoItemsss:[]
    };
  }

  public componentDidMount(){               
    this.GetGalleryFilesFolder(); 
      
  }


  public GetGalleryFilesFolder(){    
		var reactHandler = this;
            $.ajax({
                url: `${reactHandler.props.siteurl}/_api/Web/Lists/getByTitle('Picture Gallery')/items?$expand=Folder,File&$top=1000&$orderby=Created desc&$select=ID,Title,FileRef,FileSystemObjectType,FileLeafRef,Folder/ServerRelativeUrl,Folder/Name`,// URL to fetch data from sharepoint Picture Library                
                method: "GET",  
                headers: {
                    "accept": "application/json;odata=verbose",    
                    "content-type": "application/json;odata=verbose"    
                },
                success: function(resultData) {                                                         
                  if(resultData.d.results.length != 0){
                    reactHandler.setState({  
                      Galleryitems: resultData.d.results                                    
                    });
                  }else{
                    $("#if-gallery-present").hide();
                    $("#if-no-gallery-present").show();
                  }    
                  //reactHandler.calculateDynamicHeight();              
                },
                error: function (error) {
                    console.log(JSON.stringify(error));
                }
            });
  }

 

  public findValueInArray(value,arr){
    var result = false;
   
    for(var i=0; i<arr.length; i++){
      var name = arr[i];
      if(name == value){
        result = true;
        break;
      }
    }
    return result;
  }

  public findValueInArrayVideos(value,arr){
    var result1 = false;
   
    for(var j=0; j<arr.length; j++){
      var name = arr[j];
      if(name == value){
        result1 = true;
        break;
      }
    }
    return result1;
  }


  
  public render(): React.ReactElement<IRemoDepartmentGalleryProps> {
    var reactHandler = this;
    var x=1;
    let y=1;
    const Images: JSX.Element[] = this.state.Galleryitems.map(function(item,key) {   
      var filename=item.FileLeafRef;
      var completeurl=item.FileRef;                        
      var Len = filename.length; 
      var Dot = filename.lastIndexOf(".");
      var type = Len - Dot;
      var res = filename.substring(Dot+1, Len);
					  
      if(item.FileSystemObjectType==1)
      {       
                       
      }
      if (item.FileSystemObjectType !=1)  {
        var string=completeurl.split('/');    
        var str2 = "Videos";
        if(string.indexOf(str2) != -1){
            //console.log(str2 + " found");
        }else{                                                
        var foldernameval = string[string.length -2];                          
        var gFolderUrl=(completeurl).replace(filename,'');
        FolderNames.push(foldernameval);
		    if(reactHandler.findValueInArray(foldernameval,FolderNamesExits)){
		                         		
		    }
		    else{
			    if(reactHandler.findValueInArray(foldernameval,FolderNames)){
			      FolderNamesExits.push(foldernameval);			                        	 	
			        if(x<6){				                         						                         						                         		
                return (  
                  <li>           
                    <a className="relative image-hover-gal" href={reactHandler.props.siteurl+"/SitePages/Gallery-Grid-View.aspx?env=WebView&FolderName='"+gFolderUrl+"'&Type=Img"} data-interception="off"> <img src={`${item.FileRef}`} alt={item.FileLeafRef}/> 
                      <p>{foldernameval} </p>
                    </a>                    
                  </li>                                                                           
                );					                         					                         					                            					                            
				      } 
              x+=1;
			      }
			    }	
        }
	      }                               
    });
    return (
      <div className={ styles.remoDepartmentGallery } id="dept-gallery-home">
        <div className="images-social">
          <div className="row">
            <div className="col-md-6" id="if-gallery-present">
              <div className="sec event-cal image-videos">
                <div className="heading clearfix">
                  <h3> <a href={`${this.props.siteurl}/SitePages/Gallery-ViewMore.aspx?env=WebView`} data-interception="off"> Gallery </a> </h3>  
                  {/*<h3 className=""><a href="#" onClick={()=> this.ShowVideos()}>Videos</a> </h3>*/}
                </div>                
                
                <div className="section-part clearfix latest-events-bck">
                  <ul className="clearfix img-block-area">
                    {Images}
                  </ul>

                  {/*<ul className="clearfix vdo-block-area" style={{display:"none"}}>
                    
                  </ul>*/}
                </div>                
              </div>        
            </div>

            <div className="col-md-12" id="if-no-gallery-present" style={{display:"none"}}>
              <div className="sec event-cal image-videos">
                <div className="heading clearfix">
                  <h3 className="images active"> 
                  <a href="#" data-interception="off"> Gallery </a> </h3> 
                  {/*<h3 className=""><a href="#" onClick={()=> this.ShowVideos()}>Videos</a> </h3>*/}
                </div>
                
                <div className="section-part clearfix latest-events-bck">
                  <div className="clearfix img-block-area">
                    <img className="err-img" src={`https://remodigital.sharepoint.com/sites/ClientPOC/SiteAssets/Remo%20Portal%20Assets/img/Error%20Handling%20Images/ContentEmpty.png`} alt="no-image-uploaded" />        
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
