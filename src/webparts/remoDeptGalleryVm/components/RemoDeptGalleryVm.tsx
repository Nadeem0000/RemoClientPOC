import * as React from 'react';
import styles from './RemoDeptGalleryVm.module.scss';
import { IRemoDeptGalleryVmProps } from './IRemoDeptGalleryVmProps';
import { escape } from '@microsoft/sp-lodash-subset';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/folders";
import "@pnp/sp/files/folder";
import * as $ from 'jquery';
import { Item, Items } from '@pnp/sp/items';
import { SPComponentLoader } from '@microsoft/sp-loader';
import Slider from "react-slick";
import { Web } from "@pnp/sp/webs";



//const NewWeb = Web("https://remodigital.sharepoint.com/sites/ClientPOC/"); 

SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.css");
SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.css");
SPComponentLoader.loadScript("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js");
export interface IRemoGalleryVmState{  
  Galleryitems:any[];  
  VideoItemsss:any[]; 
  FolderItems:any[];  
  nav1;
  nav2;
  FolderURL:string;
  Mode:string; 
}

var FolderNames = [];
var FolderNamesExits= [];

var FolderNamesVideo = [];
var FolderNamesExitsVideo= [];

let ImgArr = [];
export default class RemoDeptGalleryVm extends React.Component<IRemoDeptGalleryVmProps, IRemoGalleryVmState, {}> {
  slider2: any; 
  slider1: any;
  public lightGallery: any;
  public constructor(props: IRemoDeptGalleryVmProps, state: IRemoGalleryVmState){    
    super(props);      
    this.state = {               
      Galleryitems: [],
      VideoItemsss:[],
      FolderItems:[],
      nav1:null,
      nav2: null,
      FolderURL:"",
      Mode:""
    };         
  }

  public componentDidMount(){        
    $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
    this.GetGalleryFilesFolder();  
    $(".img-galler-section-cls ul li").on("click",function(){
      $(this).siblings().removeClass("active");
      $(this).addClass("active");
    });  
    
    this.setState({
      nav1: this.slider1,
      nav2: this.slider2
    }); 
  }

  public GetGalleryFilesFolder(){    
		var reactHandler = this;
            $.ajax({
                url: `${reactHandler.props.siteurl}/_api/Web/Lists/getByTitle('Picture Gallery')/items?$expand=Folder,File&$top=1000&$orderby=Created desc&$select=ID,Title,FileRef,FileSystemObjectType,FileLeafRef,Folder/ServerRelativeUrl,Folder/Name`,// URL to fetch data from sharepoint Picture Library                
                method: "GET",  
                async: false,
                headers: {
                    "accept": "application/json;odata=verbose",    
                    "content-type": "application/json;odata=verbose"    
                },
                success: function(resultData) {                                                                     
                  if(resultData.d.results.length != 0){
                    reactHandler.setState({  
                      Galleryitems: resultData.d.results                                    
                    }); 
                    
                    //for(var i = 0; i < ImgArr.length; i++){
                      ImgArr.push(resultData.d.results);
                    //}
                  }else{
                    $("#if-gallery-present").hide();
                    $("#if-no-gallery-present").show();
                  }                  
                },
                error: function (error) {
                    console.log(JSON.stringify(error));
                }
            });
  }

  /*public GetGalleryVideoFilesFolder(){   
		var reactHandler = this;
    let y = 1;
            $.ajax({
                url: `${reactHandler.props.siteurl}/_api/Web/Lists/getByTitle('Video Gallery')/items?$expand=Folder,File&$top=1000&$orderby=Created desc&$select=ID,Title,FileRef,FileSystemObjectType,FileLeafRef,Folder/ServerRelativeUrl,Folder/Name`,// URL to fetch data from sharepoint Picture Library                
                method: "GET",  
                async: false,
                headers: {
                    "accept": "application/json;odata=verbose",    
                    "content-type": "application/json;odata=verbose"    
                },
                success: function(resultData) {    
                    if(resultData.d.results.length != 0){                                          
                      for(var i=0; i< resultData.d.results.length; i++){
                        var filename=resultData.d.results[i].FileLeafRef;
                        var completeurl=resultData.d.results[i].FileRef;                        
                        var Len = filename.length; 
                        var Dot = filename.lastIndexOf(".");
                        var type = Len - Dot;
                        var res = filename.substring(Dot+1, Len);
                              
                        if(resultData.d.results[i].FileSystemObjectType==1)
                        {       
                                         
                        }
                        if (resultData.d.results[i].FileSystemObjectType !=1)  {
                          var string=completeurl.split('/');                                                    
                          var foldernameval = string[string.length -2];                          
                          var gFolderUrl=(completeurl).replace(filename,'');
                          
                          FolderNamesVideo.push(foldernameval);
                          if(reactHandler.findValueInArrayVideos(foldernameval,FolderNamesExitsVideo)){
                                                   
                          }
                          else{
                            if(reactHandler.findValueInArrayVideos(foldernameval,FolderNamesVideo)){
                              FolderNamesExitsVideo.push(foldernameval);			                        	 				                         						                         						                         		
                                  $('.vdo-block-area').append(`  
                                    <li>
                                      <a className="relative image-hover-gal" href="${reactHandler.props.siteurl}/SitePages/GalleryReadMore.aspx?FolderName='${gFolderUrl}'&Type=Vdo&env=WebView" data-interception="off">
                                        <video className="lg-video-object lg-html5">
                                          <source src="${resultData.d.results[i].FileRef}" type="video/mp4" />
                                        </video>
                                        <p>${foldernameval} </p>
                                      </a>
                                    </li>`                                                                           
                                  );					                         					                         					                            					                            
                              }
                            }	
                          }
                      }                     
                    }else{
                      $("#if-gallery-present").hide();
                      $("#if-no-gallery-present").show();
                    }                                                                    
                },
                error: function (error) {
                    console.log(JSON.stringify(error));
                }
            });
  }*/

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

  /*public ShowImages(){
    $(".img-block-area").show();
    $(".vdo-block-area").hide();    
  }

  public ShowVideos(){
    $(".img-block-area").hide();
    $(".vdo-block-area").show();    
    this.GetGalleryVideoFilesFolder();
  }*/

  public async GetImagesInsideFolder(FolderURL,Mode){   

    this.GetGalleryFilesFolder();
    var siteurl:string;    
    this.setState({FolderURL:FolderURL});
    $(".lightbox").addClass("open");    
    var reactHandler = this;   
    reactHandler.setState({Mode:Mode}); 
    if(Mode == "Image"){     
      $("#trigger-image").hide();  
      $("#trigger-video").show(); 
     
      siteurl = `${reactHandler.props.siteurl}/_api/Web/GetFolderByServerRelativeUrl('${FolderURL}')?$select=ID,Title,FileRef,FileSystemObjectType,FileLeafRef,File/ServerRelativeUrl,File/Name&$expand=Folders,Files`;
    }else if(Mode == "Video"){
      $("#trigger-video").hide();            
      $("#trigger-image").show();            
      siteurl = `${reactHandler.props.siteurl}/_api/Web/GetFolderByServerRelativeUrl('${FolderURL}/Videos')?$select=ID,Title,FileRef,FileSystemObjectType,FileLeafRef,File/ServerRelativeUrl,File/Name&$expand=Folders,Files`;          
    }

    
    
    $.ajax({
      async: false,
      url: siteurl,// URL to fetch data from sharepoint Picture Library                
      method: "GET",  
      headers: {
        "accept": "application/json;odata=verbose",    
        "content-type": "application/json;odata=verbose"    
      },
      success: async function(resultData) {            
         reactHandler.setState({
          FolderItems: resultData.d.Files.results
        });         
        if(Mode == "Video"){
          if(resultData.d.Files.results != 0){
          $("#trigger-video").show();
          }else{
            $("#trigger-video").hide();
          }
        }           
      },
      error: function (error) {
        console.log(JSON.stringify(error));
      }
    });
  }

  public CloseLightBox(){
    //this.GetGalleryFilesFolder();  
    $(".lightbox").removeClass("open");
    location.reload();
  }

  public render(): React.ReactElement<IRemoDeptGalleryVmProps> {
    const settings = {
      dots: false,
      arrows: true,
      infinite: false,
      speed: 500,
      autoplay: false,      
      slidesToShow: 1,
      slidesToScroll: 1   
      };

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
					  
      if(item.FileSystemObjectType==1) //Folder = 1
      {       
                       
      }
      if (item.FileSystemObjectType !=1)  {  //File = 0
        var string=completeurl.split('/'); 

        var str2 = "Videos";
        if(string.indexOf(str2) != -1){
            
        }else{
        var foldernameval = string[string.length -2];                          
        var gFolderUrl=(completeurl).replace(filename,'');        
        FolderNames.push(foldernameval);
		    if(reactHandler.findValueInArray(foldernameval,FolderNamesExits)){
		                         		
		    }
		    else{
			    if(reactHandler.findValueInArray(foldernameval,FolderNames)){
			      FolderNamesExits.push(foldernameval);			                        	 			                         						                         						                         		
                return (  
                  <li onClick={()=>reactHandler.GetImagesInsideFolder(gFolderUrl,"Image")}>           
                    <a href="#"> 
                      <img src={`${item.FileRef}`} alt={item.FileLeafRef} data-interception="off"/> 
                      <p>{foldernameval} </p>
                    </a>                    
                  </li>                                                                           
                );					                         					                         					                            					                            
			      }
			    }	
        }
	      }                               
    });    

    const MAslider2: JSX.Element[] = this.state.FolderItems.map(function(item,key) {
      if(reactHandler.state.Mode == "Image"){
        return(
          <li> <a href="#" data-interception="off"> <img src={`${item.ServerRelativeUrl}`} alt="image" /> </a> </li>
        );
      }else if(reactHandler.state.Mode == "Video"){
        return(
        <li><a href="#" data-interception="off">
          <video className="lg-video-object lg-html5">
            <source src={`${item.ServerRelativeUrl}`} type="video/mp4" />
          </video> 
        </a></li>
        );
      }
    });

    return (
      <div className={ styles.remoDeptGalleryVm }>
        <section>
          <div className="container relative">    
            <div className="section-rigth">
                <div className="inner-banner-header relative m-b-20">
                  <div className="inner-banner-overlay"></div>
                  <div className="inner-banner-contents">
                    <h1> Gallery </h1>
                    <ul className="breadcums">
                      <li>  <a href={`${this.props.siteurl}/SitePages/Home.aspx?env=WebView`} data-interception="off"> Home </a> </li>
                      <li>  <a href="#" style={{pointerEvents:"none"}}> Gallery Folders </a> </li>
                    </ul>
                  </div>
                </div>
                <div className="inner-page-contents gallery-viewall-folders">                
                  <div className="top-news-sections category-news-sec m-b-20">
                    <div className="sec">
                      <div className="row"> 
                        <div className="col-md-12">                            
                          <div className="section-part clearfix">
                            <ul className="clearfix img-block-area">
                              {Images}
                              {/*ImgArr && ImgArr.map(function(item,key){
                                console.log(item);
                                var filename=item.FileLeafRef;
                                var completeurl=item.FileRef;                        
                                //var Len = filename.length; 
                                //var Dot = filename.lastIndexOf(".");
                                //var type = Len - Dot;
                                //var res = filename.substring(Dot+1, Len);
                                      
                                if(item.FileSystemObjectType==1) //Folder = 1
                                {       
                                                 
                                }
                                if (item.FileSystemObjectType !=1)  {  //File = 0
                                  var string=completeurl.split('/'); 
                          
                                  var str2 = "Videos";
                                  if(string.indexOf(str2) != -1){
                                      
                                  }else{
                                  var foldernameval = string[string.length -2];                          
                                  var gFolderUrl=(completeurl).replace(filename,'');        
                                  FolderNames.push(foldernameval);
                                  if(reactHandler.findValueInArray(foldernameval,FolderNamesExits)){
                                                           
                                  }
                                  else{
                                    if(reactHandler.findValueInArray(foldernameval,FolderNames)){
                                      FolderNamesExits.push(foldernameval);	
                                      return(
                                        <li onClick={()=>reactHandler.GetImagesInsideFolder(gFolderUrl,"Image")}>           
                                          <a href="#"> 
                                            <img src={`${item.FileRef}`} alt={item.FileLeafRef} data-interception="off"/> 
                                            <p>{foldernameval} </p>
                                          </a>                    
                                        </li>
                                      );
                                    }
                                  }	
                                }
                              }  
                              })*/}
                            </ul>
                            <ul className="clearfix vdo-block-area" style={{display:"none"}}>
                                          
                            </ul>
                          </div>                                
                        </div>                               
                      </div>                                       
                    </div>
                  </div>
                </div> 
            </div>  
          </div> 
                  
        </section>

        <div className="lightbox">
              <div className="gallery-lightbox-contents">
                <div className="lightbox-contents-img">
                  <div className="lightbox-contents-header clearfix">
                    
                    <ul>
                      <li id="trigger-image" className={this.state.Mode=="Image" ? "imageblock":""} > <a href="#" onClick={()=>reactHandler.GetImagesInsideFolder(this.state.FolderURL,"Image")}> Pictures  </a> </li>
                      <li id="trigger-video" className={this.state.Mode=="Video" ? "videoblock":""} > <a href="#" onClick={()=>reactHandler.GetImagesInsideFolder(this.state.FolderURL,"Video")}> Videos  </a> </li>
                      {/*<li> <a href={this.props.siteurl+"/SitePages/Gallery-Grid-View.aspx?FolderName='"+this.state.FolderURL+"'&Type=Img&env=WebView"} data-interception="off"> Grid View  </a> </li>*/}
                      <li> <a href={`${this.props.siteurl}/SitePages/Gallery-Grid-View.aspx?FolderName='${this.state.FolderURL}'&Type=Img&env=WebView`} data-interception="off"> Grid View  </a> </li>
                    </ul>
                  </div>
                  <div className="lightbox-contents-body">
                    <Slider {...settings} 
                      asNavFor={this.state.nav2}
                      ref={slider => (this.slider1 = slider)}
                      >              
                        {this.state.FolderItems && this.state.FolderItems.map(function(item,key) {      
                          if(reactHandler.state.Mode == "Image"){
                            return(
                              <>
                                <img src={`${item.ServerRelativeUrl}`} alt="image" />
                                <h4 style={{color:'#ffffff'}}>{item.Name}</h4>
                              </>
                            );
                          }else if(reactHandler.state.Mode == "Video"){
                            return(
                              <>
                                <video className="lg-video-object lg-html5" controls>
                                  <source src={`${item.ServerRelativeUrl}`} type="video/mp4" />
                                </video>
                                <h4 style={{color:'#ffffff'}}>{item.Name}</h4>
                              </>
                            );
                          }
                        })}   
                    </Slider>
                  </div>
                  <div className="lightbox-conent-thumbnails">
                    <ul className="clearfix">
                      <Slider
                        asNavFor={this.state.nav1}
                        ref={slider => (this.slider2 = slider)}
                        slidesToShow={4}
                        swipeToSlide={true}
                        focusOnSelect={true}
                        infinite={false}
                        autoplay={false}
                        arrows={false}
                        centerMode={false}
                        responsive={ [
                          {
                            breakpoint: 1000,
                            settings: {
                              slidesToShow: 3,
                              slidesToScroll: 1,
                              infinite: false,
                              dots: false,
                              arrows: false,
                              autoplay: false,
                              centerMode: false
                            }
                          }
                        ]
                      }
                      >
                        {MAslider2}
                      </Slider>                            
                    </ul>
                  </div>
                  <div className="lightbox-close">
                    <img src="https://remodigital.sharepoint.com/sites/ClientPOC/SiteAssets/Remo%20Portal%20Assets/img/close.svg" alt="close" onClick={() => this.CloseLightBox()} />
                  </div>
                </div>
              </div>
            </div>

        
      </div>
    );
  }
}
