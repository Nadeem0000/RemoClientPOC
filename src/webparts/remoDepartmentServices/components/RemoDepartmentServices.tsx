import * as React from 'react';
import styles from './RemoDepartmentServices.module.scss';
import { IRemoDepartmentServicesProps } from './IRemoDepartmentServicesProps';
import { escape } from '@microsoft/sp-lodash-subset';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as moment from 'moment';
import * as $ from 'jquery';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { Web } from "@pnp/sp/webs";
import { Markup } from 'interweave';

export interface IRemoDepartmentServicesState{
  Items:any[];
  ServiceDescription:string;
}

export default class RemoDepartmentServices extends React.Component<IRemoDepartmentServicesProps, IRemoDepartmentServicesState, {}> {
  public constructor(props: IRemoDepartmentServicesProps, state: IRemoDepartmentServicesState){
    super(props);
    this.state = {
      Items: [],
      ServiceDescription:""
    };
  }

    public componentDidMount(){
      //var handler = this;
      this.GetDepartmentServices(); 
    }

    private GetDepartmentServices() {
      var reactHandler = this;
      $.ajax({
        url: `${this.props.siteurl}/_api/web/lists/getbytitle('Services')/items?$select=ID,Title,Description&$filter=IsActive eq 1&$orderby=Order0 asc`,  
        type: "GET",
        headers:{'Accept': 'application/json; odata=verbose;'},
        success: function(resultData) {
          if(resultData.d.results.length == 0){
            $("#if-service-present").hide();
            $("#if-no-service-present").show();            
          }else{
            $("#if-service-present").show();
            $("#if-no-service-present").hide();
            reactHandler.setState({
              Items: resultData.d.results,
              ServiceDescription: resultData.d.results[0].Description
            });
          }         
        },
        error : function(jqXHR, textStatus, errorThrown) {
        }
      });    
    }

    public LoadServiceDescription(ItemID){
      var reactHandler = this;
      $.ajax({
        url: `${this.props.siteurl}/_api/web/lists/getbytitle('Services')/items?$select=ID,Title,Description&$filter=ID eq ${ItemID}`,  
        type: "GET",
        headers:{'Accept': 'application/json; odata=verbose;'},
        success: function(resultData) {          
          reactHandler.setState({
            ServiceDescription: resultData.d.results[0].Description
          });              
             
        },
        error : function(jqXHR, textStatus, errorThrown) {
        }
      });
    }

  public render(): React.ReactElement<IRemoDepartmentServicesProps> {
    $("#service-main li").on("click", function(){
      
        $(this).siblings().removeClass("active");
      $(this).addClass("active");

      
    });

    var reactHandler = this;
    const DeptServices: JSX.Element[] = this.state.Items.map(function(item,key) {   
      if(key == 0){            
        return (          
          <li className="active" onClick={()=>reactHandler.LoadServiceDescription(item.ID)}> <a href="#" data-interception="off"> {item.Title} </a>  </li>
        );    
      } else{
        return(
          <li onClick={()=>reactHandler.LoadServiceDescription(item.ID)}> <a href="#" data-interception="off"> {item.Title} </a>  </li>
        );
      } 
    });


    return (
      <div className={ styles.remoDepartmentServices }>
        <div className="relative">    
          <div className="section-rigth">
        <div className="depat-key-people m-b-20">
                                <div className="sec">
                                    <div className="heading">
                                       Our Services
                                    </div>
                                    <div className="section-part clearfix">

                                        <div className="ourservices-left">
                                            <ul id="service-main">
                                                {DeptServices}
                                            </ul>
                                        </div>
                                        <div className="ourservices-right">
                                        <p> <Markup content={this.state.ServiceDescription} /> </p>
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
