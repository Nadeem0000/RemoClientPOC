import * as React from 'react';
import styles from './RemoAboutDepartment.module.scss';
import { IRemoAboutDepartmentProps } from './IRemoAboutDepartmentProps';
import { escape } from '@microsoft/sp-lodash-subset';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as moment from 'moment';
import * as $ from 'jquery';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { Web } from "@pnp/sp/webs";
import { Markup } from 'interweave';

export interface IRemoAboutDepartmentState{
  Items:any[];
}

export default class RemoAboutDepartment extends React.Component<IRemoAboutDepartmentProps, IRemoAboutDepartmentState, {}> {
  public constructor(props: IRemoAboutDepartmentProps, state: IRemoAboutDepartmentState){
    super(props);
    this.state = {
      Items: []
    };
  }

    public componentDidMount(){
    this.GetDepartmentAbout();
      setTimeout(function(){
        $('div[data-automation-id="CanvasControl"]').attr('style', 'padding: 0px !important; margin: 0px !important');
      },500);
    }

    private GetDepartmentAbout() {
      var reactHandler = this;
      $.ajax({
        url: `${this.props.siteurl}/_api/web/lists/getbytitle('AboutDepartment')/items?$select=ID,Title,Description,DepartmentBannerImage&$filter=IsActive eq 1&$orderby=Created desc&$top=1`,  
        type: "GET",
        headers:{'Accept': 'application/json; odata=verbose;'},
        success: function(resultData) {
          if(resultData.d.results.length == 0){
            $("#if-about-present").hide();
            $("#if-no-about-present").show();            
          }else{
            $("#if-about-present").show();
            $("#if-no-about-present").hide();
            reactHandler.setState({
              Items: resultData.d.results
            });
          }         
        },
        error : function(jqXHR, textStatus, errorThrown) {
        }
      });    
    }
  public render(): React.ReactElement<IRemoAboutDepartmentProps> {
    var reactHandler = this;
    const AboutDept: JSX.Element[] = this.state.Items.map(function(item,key) {
      let RawImageTxt = item.DepartmentBannerImage;
      if(RawImageTxt != "" && RawImageTxt != null){      
        var ImgObj = JSON.parse(RawImageTxt);
        return (          
          <div className="col-md-12 m-b-0 clearfix">                       
            <div className="department-detailsi-img">
              <img src={`${ImgObj.serverRelativeUrl}`} alt="image" />
            </div>
            <div className="department-detailsi-conts">
              <h2>  {item.Title} </h2> 
              <p> <Markup content={item.Description} /> </p>
            </div>
          </div>
        );
      }
    });
    return (
      <div className={ styles.remoAboutDepartment }>
        <div className="relative">    
          <div className="section-rigth">
            <div className="inner-banner-header relative m-b-20">
              <div className="inner-banner-overlay"></div>
              <div className="inner-banner-contents">
                <h1> Department </h1>
                <ul className="breadcums">
                    <li>  <a href="https://remodigital.sharepoint.com/sites/ClientPOC/SitePages/Home.aspx?env=WebView" data-interception="off"> Home </a> </li>
                    <li>  <a href="#" style={{pointerEvents:"none"}}> {this.props.PageName} </a> </li>
                </ul>
              </div>
            </div>
            <div className="inner-page-contents">
              <div className="sec m-b-20"> 
                <div className="row" style={{display:"none"}} id="if-about-present">
                  {AboutDept}
                </div>

                <div className="row" style={{display:"none"}} id="if-no-about-present">
                  <div className="col-md-12 m-b-0 clearfix">
                    <img src="https://remodigital.sharepoint.com/sites/ClientPOC/SiteAssets/Remo%20Portal%20Assets/img/Error%20Handling%20Images/ContentEmpty.png" alt="no-content"></img>
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
