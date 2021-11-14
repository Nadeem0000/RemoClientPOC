import * as React from 'react';
import styles from './RemoCeoMessage.module.scss';
import { IRemoCeoMessageProps } from './IRemoCeoMessageProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from "@pnp/sp/presets/all";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as moment from 'moment';
import * as $ from 'jquery';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { Web } from "@pnp/sp/presets/all";

export interface IRemoCeoMessageState{
  Items:any[];
}

const NewWeb = Web("https://remodigital.sharepoint.com/sites/ClientPOC/"); 
export default class RemoCeoMessage extends React.Component<IRemoCeoMessageProps, IRemoCeoMessageState,{}> {
  public constructor(props: IRemoCeoMessageProps, state: IRemoCeoMessageState){
    super(props);
    this.state = {
      Items: []
    };
    }

    public componentDidMount(){
    this.GetCEOMessage();
    }

    private async GetCEOMessage() {
      var reactHandler = this;       
      $.ajax({
        url: `${this.props.siteurl}/_api/web/lists/getbytitle('CEO Message')/items?$select=ID,Title,Description,Created,Name,Image,Designation,Name&$filter=IsActive eq 1&$orderby=Created desc&$top=1`,  
      type: "GET",
      headers:{'Accept': 'application/json; odata=verbose;'},
      success: function(resultData) {
        if(resultData.d.results.length == 0){          
          $("#if-no-ceo-msg-present").show();
          $("#if-ceo-msg-present").hide();
        }else{
          reactHandler.setState({
            Items: resultData.d.results
          });
          $("#if-no-ceo-msg-present").hide();
          $("#if-ceo-msg-present").show();
        }      
      },
      error : function(jqXHR, textStatus, errorThrown) {
      }
      });
    }
  public render(): React.ReactElement<IRemoCeoMessageProps> {
    var handler = this;
    const CEOMessage: JSX.Element[] = this.state.Items.map(function(item,key) {
      let dummyElement = document.createElement("DIV");
      dummyElement .innerHTML = item.Description;
      var outputText = dummyElement.innerText;

      $("#ceo-title-dynamic").html(`${item.Title}`);
      let RawImageTxt = item.Image;
      if(RawImageTxt != "" && RawImageTxt != null){
        var ImgObj = JSON.parse(RawImageTxt);
          return (
            <>
              <div className="section-part clearfix">
                <div className="ceo-message-left">
                  <h4> {item.Name} </h4>
                  <p> {outputText} </p>
                  <a href={handler.props.siteurl+`/SitePages/CEO-Read-More.aspx?ItemID=${item.ID}&env=WebView`} data-interception="off" className="readmore transition" > Read more <img src={`${handler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/right_arrow.svg`} className="transition" alt="image" />  </a>
                </div>            
              </div>
              <div className="ceo-message-right">
                  <img src={ImgObj.serverRelativeUrl} alt="no-image-uploaded" />
              </div>
            </>
          );                   
      }else{
        return(
          <>
            <div className="section-part relative clearfix">
              <div className="ceo-message-left">
                <h4> {item.Name} </h4>
                <p> {outputText} </p>
                <a href={handler.props.siteurl+`/SitePages/CEO-Read-More.aspx?ItemID=${item.ID}&env=WebView`} data-interception="off" className="readmore transition"> Read more <img src="https://taqeef.sharepoint.com/sites/intranet/SiteAssets/Style%20Library/img/Landing%20Page%20Imgs/right_arrow.svg" className="transition" alt="image" />  </a>
              </div>            
            </div>
            <div className="ceo-message-right">
              <img src={`${handler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/Error%20Handling%20Images/ceo_no_found.png`} alt="img" />
            </div>
          </>
        );
      }
    });
    return (
      <div className={ styles.remoCeoMessage }>
        <div className="row">
          <div className="col-md-12">
            <div className="sec relative" id="if-ceo-msg-present">
              <div className="heading" id="ceo-title-dynamic">
                
              </div>
                {CEOMessage}
            </div>
            <div className="sec shadoww relative" id="if-no-ceo-msg-present" style={{display:"none"}}>
              <div className="heading">            
                  CEO's Message
              </div>
              <img className="err-img" src={`${handler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/Error%20Handling%20Images/ContentEmpty.png`} alt="ceoimg"></img>                                    
            </div>
          </div>
        </div>
      </div>
    );
  }
}
