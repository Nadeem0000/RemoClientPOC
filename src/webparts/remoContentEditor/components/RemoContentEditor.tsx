import * as React from 'react';
import styles from './RemoContentEditor.module.scss';
import { IRemoContentEditorProps } from './IRemoContentEditorProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Web } from "@pnp/sp/webs";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";
import * as $ from 'jquery';
import { SPComponentLoader } from '@microsoft/sp-loader';

export interface IRemoContentEditorState{
  Items:any[];
  ContentEditorAdmin:boolean;
  Tabs:any[];
}

const NewWeb = Web("https://remodigital.sharepoint.com/sites/ClientPOC/");
const ActivePageUrl = (window.location.href.split('?') ? window.location.href.split('?')[0] : window.location.href).toLowerCase();

export default class RemoContentEditor extends React.Component<IRemoContentEditorProps, IRemoContentEditorState, {}> {
  public constructor(props: IRemoContentEditorProps, state: IRemoContentEditorState){  
    super(props);              
    //SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css");  
    SPComponentLoader.loadScript("https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js");
    SPComponentLoader.loadScript("https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/js/bootstrap.bundle.min.js");
    this.state = {               
      Items: [],
      ContentEditorAdmin: false,
      Tabs:[]
    }
  }

  public componentDidMount(){    
    $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
    setTimeout(function(){
      $('div[data-automation-id="CanvasControl"]').attr('style', 'padding: 0px !important; margin: 0px !important');
    },500);
    this.CheckPermission();    
    this.Addclass();
    
  }

  public Addclass(){
    setTimeout(() => {
      $("#accordion .card .card-header").on('click',function(){
          $(this).removeClass("active");      
        $(this).addClass("active");
      });
    }, 1000);    
  }

  public async CheckPermission(){        
    let groups = await NewWeb.currentUser.groups();                
    for(var i=0; i<groups.length;i++){
      if(groups[i].Title == "ContentPageEditors"){ 
        this.setState({ContentEditorAdmin:true});            
      }
    }
    if(this.state.ContentEditorAdmin == true){
      this.GetContentEditorTabs();    
      this.GetContentEditorNavigations(1);  
    }
  }

  public GetContentEditorTabs(){
    var reactHandler = this;
    $.ajax({  
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Content Editor Master Category')/items?$select=Title,ID&$filter=IsActive eq 1`,  
        type: "GET",  
        headers:{'Accept': 'application/json; odata=verbose;'},  
        success: function(resultData) {              
          reactHandler.setState({  
            Tabs: resultData.d.results  
          });                           
        },  
        error : function(jqXHR, textStatus, errorThrown) {  
        }  
    });
  }  

  public GetContentEditorNavigations(ID){
    var reactHandler = this;
    $.ajax({  
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Content Editor Master')/items?$select=Title,URL,Icon,BelongsTo/Title&$expand=BelongsTo&$orderby=Title asc&$filter=IsActive eq 1 and BelongsTo/Id eq ${ID}`,  
        type: "GET",  
        headers:{'Accept': 'application/json; odata=verbose;'},  
        success: function(resultData) {              
          reactHandler.setState({  
            Items: resultData.d.results  
          });                           
        },  
        error : function(jqXHR, textStatus, errorThrown) {  
        }  
    });
  }

  public render(): React.ReactElement<IRemoContentEditorProps> {
    

    var reactHandler = this;  

    const ContentEditorTAB: JSX.Element[] = this.state.Tabs.map(function(item,key) {     
      if(key == 0) {     
      return (          
        <div className="card">
          <div className="card-header active">
            <a href="#" onClick={()=>reactHandler.GetContentEditorNavigations(item.Id)} className="card-link collapsed"> {item.Title} </a>
          </div>                                        
        </div>                    
      );
      }else{
        return (          
          <div className="card">
            <div className="card-header">
              <a href="#" onClick={()=>reactHandler.GetContentEditorNavigations(item.Id)} className="card-link collapsed"> {item.Title} </a>
            </div>                                        
          </div>                    
        );
      }                                               
    });

    const ContentEditorElements: JSX.Element[] = this.state.Items.map(function(item,key) {                                    
      let RawImageTxt = item.Icon;
        if(RawImageTxt != ""){
          var ImgObj = JSON.parse(RawImageTxt);          
            return (          
              <li className="ifcontentpresent"> 
                <a href={`${item.URL.Url}`} target="_blank" data-interception="off">
                  <div className="inner-qiuicklinks-inner">                
                    <img src={`${ImgObj.serverRelativeUrl}`}/>
                    <p> {item.Title} </p>
                  </div>
                </a>
              </li>               
            );            
        }                                 
    });
    return (
      <div className={ styles.remoContentEditor }>
        <section>
        <div className="relative">
    
            <div className="section-rigth">

                <div className="inner-banner-header relative m-b-20">

                    <div className="inner-banner-overlay"></div>
                    <div className="inner-banner-contents">
                        <h1> Content Editor </h1>
                        <ul className="breadcums">
                          <li>  <a href={`${this.props.siteurl}/SitePages/Home.aspx?env=WebView`} data-interception="off"> Home </a> </li>                            
                          <li>  <a href="#" style={{pointerEvents:"none"}}> Content Editor </a> </li>
                        </ul>
                    </div>

                </div>
                <div className="inner-page-contents ">
                
                <div className="top-news-sections content-editir-secs m-b-20">

                        <div className="row"> 
                            <div className="col-md-6">
                                <div id="accordion">
                                    
                                    {ContentEditorTAB}
                                                                       
                                </div>
                            </div>   
                            <div className="col-md-6 direct-conttent-sreas">
                                <div className="sec">
                                    <ul className="clearfix">
                                        {ContentEditorElements}
                                    </ul>
                                </div>
                            </div>  
                        </div>
                    </div>
            </div>   
        </div>         
        </div>        
    </section>
      </div>
    );
  }
}
