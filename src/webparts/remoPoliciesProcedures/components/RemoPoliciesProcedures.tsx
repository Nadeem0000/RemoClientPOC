import * as React from 'react';
import styles from './RemoPoliciesProcedures.module.scss';
import { IRemoPoliciesProceduresProps } from './IRemoPoliciesProceduresProps';
import { escape } from '@microsoft/sp-lodash-subset';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as moment from 'moment';
import * as $ from 'jquery'

export interface IRemoPoliciesProcedureState{  
  items:any[];         
}

export default class RemoPoliciesProcedures extends React.Component<IRemoPoliciesProceduresProps, IRemoPoliciesProcedureState, {}> {
  public constructor(props: IRemoPoliciesProceduresProps, state: IRemoPoliciesProcedureState){  
    super(props);          
    this.state = {               
      items: [],          
    };         
  }

  public componentDidMount(){
    $('#spCommandBar').attr('style', 'display: none !important');
    $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
    this.GetDocumentCenterLinks();  
       
  }

  public GetDocumentCenterLinks(){  
    var reactHandler = this;
    $.ajax({  
        url: `${this.props.siteurl}/_api/web/lists/getbytitle('Policy and Procedure Master')/items?$select=Title,HoverOnImage,HoverOffImage,URL&$orderby=Order0 asc&$filter=IsActive eq 1`,  
        type: "GET",  
        headers:{'Accept': 'application/json; odata=verbose;'},  
        success: function(resultData) {              
          reactHandler.setState({  
            items: resultData.d.results  
          });                             
        },  
        error : function(jqXHR, textStatus, errorThrown) {  
        }  
    });
  }
  public render(): React.ReactElement<IRemoPoliciesProceduresProps> {
    var reactHandler = this;
    const policiesandProcedures: JSX.Element[] = this.state.items.map(function(item,key) {                        
      let Title = item.Title;
      let RawImageTxt = item.HoverOnImage;
      let RawHoverOffImage = item.HoverOffImage;
      if(RawImageTxt != "" && RawHoverOffImage != ""){
      var ImgObj = JSON.parse(RawImageTxt);
      var ImgObjHoverImage = JSON.parse(RawHoverOffImage);       
        return (   
            <li> 
              <a href={`${item.URL.Url}`} data-interception="off" target="_blank"> 
                <img className="DarkImage" src={ImgObjHoverImage.serverRelativeUrl} alt="image"/>
                <img className="LightImage" src={ImgObj.serverRelativeUrl} alt="image"/> 
                <p>{Title}</p>    
              </a> 
            </li>                                   
        );         
    }                   
  });
    return (
      <div className={ styles.remoPoliciesProcedures }>
        <section>
          <div className="relative">
            <div className="section-rigth"></div>
            <div className="inner-banner-header relative m-b-20">
              <div className="inner-banner-overlay"></div>
              <div className="inner-banner-contents">
                <h1> Policy &amp; Procedure </h1>
                <ul className="breadcums">
                  <li>  <a href={`${this.props.siteurl}/SitePages/Home.aspx?env=WebView`} data-interception="off"> Home </a> </li>
                  <li>  <a href="#" style={{pointerEvents:"none"}}> Policy &amp; Procedure </a> </li>
                </ul>
              </div>
            </div>
            <div className="direct-conttent-sreas">
              <div className="sec">
                <ul className="clearfix">
                  {policiesandProcedures}                        
                </ul>
              </div>
            </div>
          </div>        
        </section>
      </div>
    );
  }
}
