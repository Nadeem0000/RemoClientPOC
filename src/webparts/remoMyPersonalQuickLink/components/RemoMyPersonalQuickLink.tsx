import * as React from 'react';
import styles from './RemoMyPersonalQuickLink.module.scss';
import { IRemoMyPersonalQuickLinkProps } from './IRemoMyPersonalQuickLinkProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as moment from 'moment';
import * as $ from 'jquery';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";

export interface IRemoMyPersonalQuickLinkState{
  MyQuickLinksPrefference:any[];
  MyQuickLinkData:any[];
}

let Myqlink = [];
export default class RemoMyPersonalQuickLink extends React.Component<IRemoMyPersonalQuickLinkProps, IRemoMyPersonalQuickLinkState,{}> {
  public constructor(props: IRemoMyPersonalQuickLinkProps, state: IRemoMyPersonalQuickLinkState){
    super(props);
    this.state = {
    MyQuickLinksPrefference:[],
    MyQuickLinkData:[],
    };
    }

    public componentDidMount(){
      var reacthandler = this;
      reacthandler.getcurrentusersQuickLinks();
      }
  
      public getcurrentusersQuickLinks(){
        Myqlink = [];
        var i;
      var reactHandler = this;
      let UserID = this.props.userid;
      $.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('UsersQuickLinks')/items?$select=ID,Order0,SelectedQuickLinks/Id,Author/Id&$filter=Author/Id eq '${UserID}'&$expand=SelectedQuickLinks,Author&$top=5&$orderby=Order0 asc`,
      type: "GET",
      headers:{'Accept': 'application/json; odata=verbose;'},
      success: function(resultData) {
        reactHandler.setState({
          MyQuickLinksPrefference: resultData.d.results
        });
        for(i = 0; i < resultData.d.results.length; ){
          Myqlink.push(resultData.d.results[i].SelectedQuickLinks.Id);//,resultData.d.results[1].SelectedQuickLinks.Id,resultData.d.results[2].SelectedQuickLinks.Id,
          //resultData.d.results[3].SelectedQuickLinks.Id,resultData.d.results[4].SelectedQuickLinks.Id
          if(i==0){
            setTimeout(() => {                          
              $.ajax({
                url: `${reactHandler.props.siteurl}/_api/web/lists/getbytitle('Quick Links')/items?$select=ID,Title,URL,Image,ImageHover&$filter=ID eq '${resultData.d.results[0].SelectedQuickLinks.Id}'`,
                type: "GET",
                headers:{'Accept': 'application/json; odata=verbose;'},
                success: function(resultData) {
                if(resultData.d.results.length > 0){
                $(".m-b-routine").addClass("QLinktrue");
                }else{
                $(".m-b-routine").removeClass("QLinktrue");
                }
                  let RawImageTxt = resultData.d.results[0].Image;
                  let RawImageTxtHover = resultData.d.results[0].ImageHover;
                  if(RawImageTxt != "" && RawImageTxtHover != ""){
                    var ImgObj = JSON.parse(RawImageTxt);
                    var ImgObjHover = JSON.parse(RawImageTxtHover);
                    $("#result").append(`<li>`+
                        `<a href='${resultData.d.results[0].URL}' target=_blank class="clearfix">` +              
                                `<img src='${ImgObj.serverRelativeUrl}' class="quick-def" />`+
                                `<img src='${ImgObjHover.serverRelativeUrl}' class="quick-hov" />`+
                                  `<p>${resultData.d.results[0].Title}</p>`+                  
                            `</a>`+
                        `</li>`);
                  }        
                },
                error : function(jqXHR, textStatus, errorThrown) {
                }
              });
            }, 500);
          }

          if(i==1){
            setTimeout(() => {                          
              $.ajax({
                url: `${reactHandler.props.siteurl}/_api/web/lists/getbytitle('Quick Links')/items?$select=ID,Title,URL,Image,ImageHover&$filter=ID eq '${resultData.d.results[1].SelectedQuickLinks.Id}'`,
                type: "GET",
                headers:{'Accept': 'application/json; odata=verbose;'},
                success: function(resultData) {
                if(resultData.d.results.length > 0){
                $(".m-b-routine").addClass("QLinktrue");
                }else{
                $(".m-b-routine").removeClass("QLinktrue");
                }
                  let RawImageTxt = resultData.d.results[0].Image;
                  let RawImageTxtHover = resultData.d.results[0].ImageHover;
                  if(RawImageTxt != "" && RawImageTxtHover != ""){
                    var ImgObj = JSON.parse(RawImageTxt);
                    var ImgObjHover = JSON.parse(RawImageTxtHover);
                    $("#result").append(`<li>`+
                        `<a href='${resultData.d.results[0].URL}' target=_blank class="clearfix">` +              
                                `<img src='${ImgObj.serverRelativeUrl}' class="quick-def" />`+
                                `<img src='${ImgObjHover.serverRelativeUrl}' class="quick-hov" />`+
                                  `<p>${resultData.d.results[0].Title}</p>`+                  
                            `</a>`+
                        `</li>`);
                  }        
                },
                error : function(jqXHR, textStatus, errorThrown) {
                }
              });
            }, 700);
          }
          if(i==2){
            setTimeout(() => {                          
              $.ajax({
                url: `${reactHandler.props.siteurl}/_api/web/lists/getbytitle('Quick Links')/items?$select=ID,Title,URL,Image,ImageHover&$filter=ID eq '${resultData.d.results[2].SelectedQuickLinks.Id}'`,
                type: "GET",
                headers:{'Accept': 'application/json; odata=verbose;'},
                success: function(resultData) {
                if(resultData.d.results.length > 0){
                $(".m-b-routine").addClass("QLinktrue");
                }else{
                $(".m-b-routine").removeClass("QLinktrue");
                }
                  let RawImageTxt = resultData.d.results[0].Image;
                  let RawImageTxtHover = resultData.d.results[0].ImageHover;
                  if(RawImageTxt != "" && RawImageTxtHover != ""){
                    var ImgObj = JSON.parse(RawImageTxt);
                    var ImgObjHover = JSON.parse(RawImageTxtHover);
                    $("#result").append(`<li>`+
                        `<a href='${resultData.d.results[0].URL}' target=_blank class="clearfix">` +              
                                `<img src='${ImgObj.serverRelativeUrl}' class="quick-def" />`+
                                `<img src='${ImgObjHover.serverRelativeUrl}' class="quick-hov" />`+
                                  `<p>${resultData.d.results[0].Title}</p>`+                  
                            `</a>`+
                        `</li>`);
                  }        
                },
                error : function(jqXHR, textStatus, errorThrown) {
                }
              });
            }, 900);
          }
          if(i==3){
            setTimeout(() => {                          
              $.ajax({
                url: `${reactHandler.props.siteurl}/_api/web/lists/getbytitle('Quick Links')/items?$select=ID,Title,URL,Image,ImageHover&$filter=ID eq '${resultData.d.results[3].SelectedQuickLinks.Id}'`,
                type: "GET",
                headers:{'Accept': 'application/json; odata=verbose;'},
                success: function(resultData) {
                if(resultData.d.results.length > 0){
                $(".m-b-routine").addClass("QLinktrue");
                }else{
                $(".m-b-routine").removeClass("QLinktrue");
                }
                  let RawImageTxt = resultData.d.results[0].Image;
                  let RawImageTxtHover = resultData.d.results[0].ImageHover;
                  if(RawImageTxt != "" && RawImageTxtHover != ""){
                    var ImgObj = JSON.parse(RawImageTxt);
                    var ImgObjHover = JSON.parse(RawImageTxtHover);
                    $("#result").append(`<li>`+
                        `<a href='${resultData.d.results[0].URL}' target=_blank class="clearfix">` +              
                                `<img src='${ImgObj.serverRelativeUrl}' class="quick-def" />`+
                                `<img src='${ImgObjHover.serverRelativeUrl}' class="quick-hov" />`+
                                  `<p>${resultData.d.results[0].Title}</p>`+                  
                            `</a>`+
                        `</li>`);
                  }        
                },
                error : function(jqXHR, textStatus, errorThrown) {
                }
              });
            }, 1100);
          }
          if(i==4){
            setTimeout(() => {                          
              $.ajax({
                url: `${reactHandler.props.siteurl}/_api/web/lists/getbytitle('Quick Links')/items?$select=ID,Title,URL,Image,ImageHover&$filter=ID eq '${resultData.d.results[4].SelectedQuickLinks.Id}'`,
                type: "GET",
                headers:{'Accept': 'application/json; odata=verbose;'},
                success: function(resultData) {
                if(resultData.d.results.length > 0){
                $(".m-b-routine").addClass("QLinktrue");
                }else{
                $(".m-b-routine").removeClass("QLinktrue");
                }
                  let RawImageTxt = resultData.d.results[0].Image;
                  let RawImageTxtHover = resultData.d.results[0].ImageHover;
                  if(RawImageTxt != "" && RawImageTxtHover != ""){
                    var ImgObj = JSON.parse(RawImageTxt);
                    var ImgObjHover = JSON.parse(RawImageTxtHover);
                    $("#result").append(`<li>`+
                        `<a href='${resultData.d.results[0].URL}' target=_blank class="clearfix">` +              
                                `<img src='${ImgObj.serverRelativeUrl}' class="quick-def" />`+
                                `<img src='${ImgObjHover.serverRelativeUrl}' class="quick-hov" />`+
                                  `<p>${resultData.d.results[0].Title}</p>`+                  
                            `</a>`+
                        `</li>`);
                  }        
                },
                error : function(jqXHR, textStatus, errorThrown) {
                }
              });
            }, 1300);
          }


          i++ ;
        }
                
        if(resultData.d.results.length != 0){
          $(".if-no-qlinks").show();
        }
         
        /*setTimeout(() => {
          
         if(i < 1)  {
        $.ajax({
          url: `${reactHandler.props.siteurl}/_api/web/lists/getbytitle('Quick Links')/items?$select=ID,Title,URL,Image,ImageHover&$filter=ID eq '${resultData.d.results[0].SelectedQuickLinks.Id}'`,
          type: "GET",
          headers:{'Accept': 'application/json; odata=verbose;'},
          success: function(resultData) {
          if(resultData.d.results.length > 0){
          $(".m-b-routine").addClass("QLinktrue");
          }else{
          $(".m-b-routine").removeClass("QLinktrue");
          }
            let RawImageTxt = resultData.d.results[0].Image;
            let RawImageTxtHover = resultData.d.results[0].ImageHover;
            if(RawImageTxt != "" && RawImageTxtHover != ""){
              var ImgObj = JSON.parse(RawImageTxt);
              var ImgObjHover = JSON.parse(RawImageTxtHover);
              $("#result").append(`<li>`+
                  `<a href='${resultData.d.results[0].URL}' target=_blank class="clearfix">` +              
                          `<img src='${ImgObj.serverRelativeUrl}' class="quick-def" />`+
                          `<img src='${ImgObjHover.serverRelativeUrl}' class="quick-hov" />`+
                            `<p>${resultData.d.results[0].Title}</p>`+                  
                      `</a>`+
                  `</li>`);
            }        
          },
          error : function(jqXHR, textStatus, errorThrown) {
          }
          });
        }
        }, 500);  

      
        setTimeout(() => {
          
          if(i < 2)  {
          $.ajax({
            url: `${reactHandler.props.siteurl}/_api/web/lists/getbytitle('Quick Links')/items?$select=ID,Title,URL,Image,ImageHover&$filter=ID eq '${resultData.d.results[1].SelectedQuickLinks.Id}'`,
            type: "GET",
            headers:{'Accept': 'application/json; odata=verbose;'},
            success: function(resultData) {
            if(resultData.d.results.length > 0){
            $(".m-b-routine").addClass("QLinktrue");
            }else{
            $(".m-b-routine").removeClass("QLinktrue");
            }
              let RawImageTxt = resultData.d.results[0].Image;
              let RawImageTxtHover = resultData.d.results[0].ImageHover;
              if(RawImageTxt != "" && RawImageTxtHover != ""){
                var ImgObj = JSON.parse(RawImageTxt);
                var ImgObjHover = JSON.parse(RawImageTxtHover);
                $("#result").append(`<li>`+
                    `<a href='${resultData.d.results[0].URL}' target=_blank class="clearfix">` +              
                            `<img src='${ImgObj.serverRelativeUrl}' class="quick-def" />`+
                            `<img src='${ImgObjHover.serverRelativeUrl}' class="quick-hov" />`+
                              `<p>${resultData.d.results[0].Title}</p>`+                  
                        `</a>`+
                    `</li>`);
              }        
            },
            error : function(jqXHR, textStatus, errorThrown) {
            }
            });
          }
          }, 700);  

          setTimeout(() => {
            
          
            if(i < 3)  {
            $.ajax({
              url: `${reactHandler.props.siteurl}/_api/web/lists/getbytitle('Quick Links')/items?$select=ID,Title,URL,Image,ImageHover&$filter=ID eq '${resultData.d.results[2].SelectedQuickLinks.Id}'`,
              type: "GET",
              headers:{'Accept': 'application/json; odata=verbose;'},
              success: function(resultData) {
              if(resultData.d.results.length > 0){
              $(".m-b-routine").addClass("QLinktrue");
              }else{
              $(".m-b-routine").removeClass("QLinktrue");
              }
                let RawImageTxt = resultData.d.results[0].Image;
                let RawImageTxtHover = resultData.d.results[0].ImageHover;
                if(RawImageTxt != "" && RawImageTxtHover != ""){
                  var ImgObj = JSON.parse(RawImageTxt);
                  var ImgObjHover = JSON.parse(RawImageTxtHover);
                  $("#result").append(`<li>`+
                      `<a href='${resultData.d.results[0].URL}' target=_blank class="clearfix">` +              
                              `<img src='${ImgObj.serverRelativeUrl}' class="quick-def" />`+
                              `<img src='${ImgObjHover.serverRelativeUrl}' class="quick-hov" />`+
                                `<p>${resultData.d.results[0].Title}</p>`+                  
                          `</a>`+
                      `</li>`);
                }        
              },
              error : function(jqXHR, textStatus, errorThrown) {
              }
              });
            }
            }, 900);  


            setTimeout(() => {
              if(i < 4)  {
            
              $.ajax({
                url: `${reactHandler.props.siteurl}/_api/web/lists/getbytitle('Quick Links')/items?$select=ID,Title,URL,Image,ImageHover&$filter=ID eq '${resultData.d.results[3].SelectedQuickLinks.Id}'`,
                type: "GET",
                headers:{'Accept': 'application/json; odata=verbose;'},
                success: function(resultData) {
                if(resultData.d.results.length > 0){
                $(".m-b-routine").addClass("QLinktrue");
                }else{
                $(".m-b-routine").removeClass("QLinktrue");
                }
                  let RawImageTxt = resultData.d.results[0].Image;
                  let RawImageTxtHover = resultData.d.results[0].ImageHover;
                  if(RawImageTxt != "" && RawImageTxtHover != ""){
                    var ImgObj = JSON.parse(RawImageTxt);
                    var ImgObjHover = JSON.parse(RawImageTxtHover);
                    $("#result").append(`<li>`+
                        `<a href='${resultData.d.results[0].URL}' target=_blank class="clearfix">` +              
                                `<img src='${ImgObj.serverRelativeUrl}' class="quick-def" />`+
                                `<img src='${ImgObjHover.serverRelativeUrl}' class="quick-hov" />`+
                                  `<p>${resultData.d.results[0].Title}</p>`+                  
                            `</a>`+
                        `</li>`);
                  }        
                },
                error : function(jqXHR, textStatus, errorThrown) {
                }
                });

              }
              }, 1100);  

              setTimeout(() => {
                if(i < 5)  {
              
                $.ajax({
                  url: `${reactHandler.props.siteurl}/_api/web/lists/getbytitle('Quick Links')/items?$select=ID,Title,URL,Image,ImageHover&$filter=ID eq '${resultData.d.results[4].SelectedQuickLinks.Id}'`,
                  type: "GET",
                  headers:{'Accept': 'application/json; odata=verbose;'},
                  success: function(resultData) {
                  if(resultData.d.results.length > 0){
                  $(".m-b-routine").addClass("QLinktrue");
                  }else{
                  $(".m-b-routine").removeClass("QLinktrue");
                  }
                    let RawImageTxt = resultData.d.results[0].Image;
                    let RawImageTxtHover = resultData.d.results[0].ImageHover;
                    if(RawImageTxt != "" && RawImageTxtHover != ""){
                      var ImgObj = JSON.parse(RawImageTxt);
                      var ImgObjHover = JSON.parse(RawImageTxtHover);
                      $("#result").append(`<li>`+
                          `<a href='${resultData.d.results[0].URL}' target=_blank class="clearfix">` +              
                                  `<img src='${ImgObj.serverRelativeUrl}' class="quick-def" />`+
                                  `<img src='${ImgObjHover.serverRelativeUrl}' class="quick-hov" />`+
                                    `<p>${resultData.d.results[0].Title}</p>`+                  
                              `</a>`+
                          `</li>`);
                    }        
                  },
                  error : function(jqXHR, textStatus, errorThrown) {
                  }
                  });
                }
                }, 1200);  */

      },
      error : function(jqXHR, textStatus, errorThrown) {
      }
      });
      
      }
  
      public getmyquicklinks(ID){
      $.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Quick Links')/items?$select=ID,Title,URL,Image,ImageHover&$filter=ID eq '${ID}'&$orderby=Order0 asc`,
      type: "GET",
      headers:{'Accept': 'application/json; odata=verbose;'},
      success: function(resultData) {
      if(resultData.d.results.length > 0){
      $(".m-b-routine").addClass("QLinktrue");
      }else{
      $(".m-b-routine").removeClass("QLinktrue");
      }
      for(var i =0; i< resultData.d.results.length; ){
        let RawImageTxt = resultData.d.results[i].Image;
        let RawImageTxtHover = resultData.d.results[i].ImageHover;
        if(RawImageTxt != "" && RawImageTxtHover != ""){
          var ImgObj = JSON.parse(RawImageTxt);
          var ImgObjHover = JSON.parse(RawImageTxtHover);
          $("#result").append(`<li>`+
              `<a href='${resultData.d.results[i].URL}' target=_blank class="clearfix">` +              
                      `<img src='${ImgObj.serverRelativeUrl}' class="quick-def" />`+
                      `<img src='${ImgObjHover.serverRelativeUrl}' class="quick-hov" />`+
                        `<p>${resultData.d.results[i].Title}</p>`+                  
                  `</a>`+
              `</li>`);
        }
        i++;
      }        
  
      },
      error : function(jqXHR, textStatus, errorThrown) {
      }
      });
      }
  public render(): React.ReactElement<IRemoMyPersonalQuickLinkProps> {
    var reactHandler = this;
    return (
      <div className={[styles.remoMyPersonalQuickLink,"m-b-20 if-no-qlinks"].join(' ')} style={{display:"none"}} id="m-b-20-PQlink">
        <div className="quicklinks-wrap personal-qlinks-wrap m-b-20">
        <div className="sec">
            <div className="heading clearfix">
              <div className="heading-left">
                Quick Links
              </div>
              <div className="heading-right">
                <a href={`${this.props.siteurl}/SitePages/Manage-Quick-Links.aspx?env=WebView`} data-interception="off"> Manage Quick Links</a>
              </div>
                
            </div>
            
            <div className="section-part clearfix">                
              <ul id="result">
                                                 
              </ul>
            </div>    
    </div> 
    </div>
      </div>
    );
  }
}
