import * as React from 'react';
import styles from './RemoDepartmentQuickLink.module.scss';
import { IRemoDepartmentQuickLinkProps } from './IRemoDepartmentQuickLinkProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as moment from 'moment';
import * as $ from 'jquery';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";

export interface IRemoDepartmentQuickLinkState{  
  QuickLinkData:any[];
}

export default class RemoDepartmentQuickLink extends React.Component<IRemoDepartmentQuickLinkProps, IRemoDepartmentQuickLinkState,{}> {
  public constructor(props: IRemoDepartmentQuickLinkProps, state: IRemoDepartmentQuickLinkState){
    super(props);
    this.state = {    
    QuickLinkData:[]
    };
    }

    public componentDidMount(){
      var reacthandler = this;
      reacthandler.getcurrentusersQuickLinks();
      }
  
      public getcurrentusersQuickLinks(){
      var reactHandler = this;      
      $.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Quick Links')/items?$select=ID,Title,URL,HoverOffImage,HoverOnImage&$filter=IsActive eq 1&$top=5&$orderby=Order0 asc`,
      type: "GET",
      headers:{'Accept': 'application/json; odata=verbose;'},
      success: function(resultData) {
        reactHandler.setState({
        QuickLinkData: resultData.d.results
        });
        if(resultData.d.results.length == 0){
          $(".if-no-qlinks-present").show();
          $(".if-qlinks-present").hide();
        }else{
          $(".if-no-qlinks-present").hide();
          $(".if-qlinks-present").show();
        }      
      },
      error : function(jqXHR, textStatus, errorThrown) {
      }
      });
      }
  public render(): React.ReactElement<IRemoDepartmentQuickLinkProps> {
    var reactHandler = this;
    const DeptQuickLinks: JSX.Element[] = this.state.QuickLinkData.map(function(item,key) {
      let RawImageTxt = item.HoverOffImage;
      let RawImageTxt2 = item.HoverOnImage;
      if(RawImageTxt != "" && RawImageTxt != null && RawImageTxt2 != "" && RawImageTxt2 != null){      
        var ImgObj = JSON.parse(RawImageTxt);
        var ImgObj2 = JSON.parse(RawImageTxt2);
        return (          
          <li>
            <a href={`${item.URL.Url}`} target="_blank" data-interception="off" className="clearfix"> 
                <img src={`${ImgObj.serverRelativeUrl}`} alt="image" className="quick-def"/> 
                <img src={`${ImgObj2.serverRelativeUrl}`} alt="image" className="quick-hov"/> 
                <p> {item.Title} </p>
            </a>    
          </li>
        );
      }
    });
    return (
      <div className={ styles.remoDepartmentQuickLink }>
        <div className="relative">    
          <div className="section-rigth">
            <div className="quicklinks-wrap personal-qlinks-wrap m-b-20">
              <div className="sec">
                <div className="heading">
                  Quick Links
                </div>
                <div className="section-part clearfix if-qlinks-present">
                  <ul>
                    {DeptQuickLinks}
                  </ul>
                </div>    

                <div className="section-part clearfix if-no-qlinks-present" style={{display:"none"}}>
                  <img src="https://remodigital.sharepoint.com/sites/ClientPOC/SiteAssets/Remo%20Portal%20Assets/img/Error%20Handling%20Images/ContentEmpty.png" alt="no-content"></img>
                </div>

              </div> 
            </div>
          </div>
        </div>
      </div>
    );
  }
}
