import * as React from 'react';
import { escape } from '@microsoft/sp-lodash-subset';
import { HttpClient, HttpClientResponse } from '@microsoft/sp-http';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { ISpfxWeatherProps } from './ISpfxWeatherProps';
import * as $ from 'jquery';
import { ServiceProvider } from '../globalCustomFeatures/services/ServiceProvider';
import { Web } from "@pnp/sp/webs";
import { sp } from "@pnp/sp";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import ReactTooltip from "react-tooltip";

setTimeout(function(){
  $('html').css("visibility","visible");
  $('html').addClass('loading-in-progress');
},1200);

export interface ISideNavProps {
  siteurl: string;
  context: any;
  currentWebUrl: string;
  CurrentPageserverRequestPath:string;
}
export interface ISideNavState {
  myMailDatas:any[];
  myMeetingsDatas:any[];
  EmailCount:any;
  MeetingsCount:any;
  CurrentPageUrl:any;
  IsAdminForContentEditor:boolean;

  MainNavItems:any[];
  DeptandQuickLinksItems:any[];
  QuickLinkItems:any[];
  SelectedNav:any[];
  showdata:any[];
  showdataLevelTwo:any[];
  showdataqlink:any[];

  showdataResponsive:any[];
  showdataLevelTwoResponsive:any[];
  showdataqlinkResponsive:any[];

  CurrentUserName:string;
  CurrentUserDesignation:string;
  CurrentUserProfilePic:string;
  SiteLogo:string;
  }

  let BreadCrumb=[];
  const NewWeb = Web("https://remodigital.sharepoint.com/sites/ClientPOC/");
  export default class GlobalSideNav extends React.Component<ISideNavProps, ISideNavState, {}>
    {
    private serviceProvider;
    private displayData;
    private displayDataLevel2;
    private displayDataQlink;


    private displayDataResponsive;
    private displayDataLevel2Responsive;
    private displayDataQlinkResponsive;
    public constructor(props: ISideNavProps, state: {}){
      super(props);
      this.serviceProvider = new ServiceProvider(this.props.context);

      this.displayData = [];
      this.displayDataLevel2 = [];
      this.displayDataQlink = [];

      this.displayDataResponsive = [];
      this.displayDataLevel2Responsive = [];
      this.displayDataQlinkResponsive = [];
      this.appendData = this.appendData.bind(this);
      this.appendDataLevelTwo = this.appendDataLevelTwo.bind(this);
      this.appendDataQLink = this.appendDataQLink.bind(this);

      /*External Files*/
      //SPComponentLoader.loadCss(`https://fonts.googleapis.com/css?family=Roboto:300,400,500,700`);
      SPComponentLoader.loadCss(`https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css`);
      SPComponentLoader.loadCss(`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css`);
       
      //SPComponentLoader.loadCss(`https://remodigital.sharepoint.com/sites/ClientPOC/SiteAssets/Remo%20Portal%20Assets/External/PagingStyle.css`);
      SPComponentLoader.loadCss(`https://remodigital.sharepoint.com/sites/ClientPOC/SiteAssets/Remo%20Portal%20Assets/css/SP-NativeStyle-Overriding.css?v=1.4`);
      SPComponentLoader.loadCss(`https://remodigital.sharepoint.com/sites/ClientPOC/SiteAssets/Remo%20Portal%20Assets/css/style.css?v=1.4`);
      SPComponentLoader.loadCss(`https://remodigital.sharepoint.com/sites/ClientPOC/SiteAssets/Remo%20Portal%20Assets/css/Responsive.css?v=1.4`);

      SPComponentLoader.loadScript('https://code.jquery.com/jquery-3.6.0.min.js', {
      globalExportsName: 'jQuery'
      }).then(() => {
      SPComponentLoader.loadScript('https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js', {
      globalExportsName: 'jQuery'
      }).then(($: any) => {
      SPComponentLoader.loadScript('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js', {
      globalExportsName: 'jQuery'
      });   
      });
      });
      

      this.state = {
      myMailDatas:[],
      myMeetingsDatas:[],
      EmailCount:"",
      MeetingsCount:"",
      CurrentPageUrl:"",
      IsAdminForContentEditor:false,

      MainNavItems:[],
      DeptandQuickLinksItems:[],
      QuickLinkItems:[],
      SelectedNav:[],
      showdata:[],
      showdataLevelTwo:[],
      showdataqlink:[],

      showdataResponsive:[],
      showdataLevelTwoResponsive:[],
      showdataqlinkResponsive:[],

      CurrentUserName:"",
      CurrentUserDesignation:"",
      CurrentUserProfilePic:"",
      SiteLogo:""
      };
    }


    public componentDidMount(){
      const ActivePageUrl = (window.location.href.split('?') ? window.location.href.split('?')[0] : window.location.href).toLowerCase();      
      
      this.getUnreadmailCount();
      this.getmymeetings();
      this.GetMainNavItems();
      this.BindPlaceholderLogo();
      this.GetCurrentUserDetails();
      this.setState({
      CurrentPageUrl:ActivePageUrl
      });

      $('.globalleftmenu-fixed-area ul li').on('click', function(){
      $(this).siblings().removeClass('active');
      $(this).siblings().removeClass('open');
      $(this).addClass('active');
      $(this).toggleClass('open');
      });

      $(".reponsive-quick-wrap .main-menu ul li.submenu a img").on("click",function(){
        //$(this).toggleClass('active');
        var self = $(this).parent();
        self.toggleClass("active");
      });
      

      if(ActivePageUrl=="https://remodigital.sharepoint.com/sites/clientpoc/sitepages/home.aspx" || ActivePageUrl=="https://remodigital.sharepoint.com/sites/clientpoc/sitepages/home.aspx#" ||
        ActivePageUrl=="https://remodigital.sharepoint.com/sites/clientpoc" || ActivePageUrl=="https://remodigital.sharepoint.com/sites/clientpoc#" || ActivePageUrl=="https://remodigital.sharepoint.com/sites/clientpoc/" ||
        ActivePageUrl=="https://remodigital.sharepoint.com/sites/clientpoc/#"){
        setTimeout(function(){
          $('div[data-automation-id="CanvasControl"]').attr('style', 'padding: 0px !important; margin: 0px !important');
        },500);
        $(".inner-pages-nav").hide();
      }

      setTimeout(function(){
      $('html').css("visibility","visible");
      $('html').removeClass('loading-in-progress');
      },1800);

      setTimeout(function(){
      $('html').css("visibility","visible");
      $('html').removeClass('loading-in-progress');
      },2500);

      setTimeout(function(){
      $('html').css("visibility","visible");
      $('html').removeClass('loading-in-progress');
      },3000);
      setTimeout(function(){
      $('html').css("visibility","visible");
      $('html').removeClass('loading-in-progress');
      },5000);

      var style = document.createElement('style');
      style.innerHTML =
      '#sp-appBar {' +
      'display: none !important;' +
      '}';
      var ref = document.querySelector('script');
      ref.parentNode.insertBefore(style, ref);

      //Click Outside to remove mobile view left menu
      document.addEventListener("mousedown", (event) => {
        const target = event.target as Element;
        var container = $(".reponsive-quick-wrap");
        if (!container.is(target) && container.has(target).length === 0) 
        {
            $(".responsive-menu-wrap ").removeClass("open");
        }
      });

      //Click Outside to remove mobile view search
      document.addEventListener("mousedown", (event) => {
        const target = event.target as Element;
        var container = $(".search");        
        if (!container.is(target) && container.has(target).length === 0) 
        {
            $(".responsive-background").removeClass("open");
            $(".search").removeClass("open");
        }
      });  
    }

    public GetCurrentUserDetails(){
      var reacthandler = this;           
      $.ajax({  
        url: `${reacthandler.props.siteurl}/_api/SP.UserProfiles.PeopleManager/GetMyProperties`,  
        type: "GET",  
        headers:{'Accept': 'application/json; odata=verbose;'},  
        success: function(resultData) {                
          var email = resultData.d.Email;                               
          var Name = resultData.d.DisplayName;
          var Designation = resultData.d.Title;            
          reacthandler.setState({
            CurrentUserName: Name,
            CurrentUserDesignation: Designation,
            CurrentUserProfilePic: `${reacthandler.props.siteurl}/_layouts/15/userphoto.aspx?size=l&username=${email}`
          });
        },  
        error : function(jqXHR, textStatus, errorThrown) {  
        }  
      });
    }


    public BindPlaceholderLogo(){
     
      var reacthandler = this;
      $.ajax({  
        url: `https://remodigital.sharepoint.com/sites/ClientPOC/_api/web/lists/getbytitle('Logo Master')/items?$select=Title,Logo&$filter=IsActive eq 1&$orderby=Created desc&$top=1`,  
        type: "GET",  
        headers:{'Accept': 'application/json; odata=verbose;'},  
        success: function(resultData) { 
          let RawImageTxt = resultData.d.results[0].Logo;
          if(RawImageTxt != ""){
            var ImgObj = JSON.parse(RawImageTxt);      
            reacthandler.setState({
              SiteLogo: `${ImgObj.serverRelativeUrl}`
            });                               
          }             
        },  
        error : function(jqXHR, textStatus, errorThrown) {  
        }  
    });
    }

    public getUnreadmailCount(){
      this.serviceProvider.
      getmymailcount()
      .then(
        (result: any[]): void => {
          this.setState({myMailDatas: result});
          var mailcount = this.state.myMailDatas.length;
          if(this.state.myMailDatas.length > 0){
            this.setState({EmailCount: mailcount});        
            if(this.state.myMailDatas.length > 999){
              $(".count-email").addClass("more");
            }
          }else{
            this.setState({EmailCount: "0"});
            $("#Emails_count").hide();
          }
        }
      )
    }

    public getmymeetings(){
      this.serviceProvider.
      getmymeetingscount()
        .then(
        (result: any[]): void => {
          this.setState({myMeetingsDatas: result});
          var myMeetingscount = this.state.myMeetingsDatas.length;
            if(this.state.myMeetingsDatas.length > 0){
              this.setState({MeetingsCount: myMeetingscount});  
              if(this.state.myMeetingsDatas.length > 999){
                $(".meet-count").addClass("more");
              }
            }else{
              this.setState({MeetingsCount: "0"});
              $("#Meetings_count").hide();
            }
          }
        )
    }

    public async EnableContentEditorForSuperAdmins(){
      let groups = await NewWeb.currentUser.groups();
      for(var i=0; i<groups.length;i++){ 
        if(groups[i].Title =="ContentPageEditors"){
          this.setState({IsAdminForContentEditor:true}); //To Show Content Editor on Center Nav to Specific Group Users alone
          
        }
      }
    }

    public async GetMainNavItems(){
    var reactHandler = this;
    try{
      $.ajax({  
          url: `https://remodigital.sharepoint.com/sites/ClientPOC/_api/web/lists/getbytitle('Navigations')/items?$select=Title,URL,OpenInNewTab,LinkMasterID/Title,LinkMasterID/Id,URL,HoverOnIcon,HoverOffIcon&$filter=IsActive eq 1&$orderby=Order0 asc&$top=10&$expand=LinkMasterID`,  
          type: "GET",  
          headers:{'Accept': 'application/json; odata=verbose;'},  
          success: function(resultData) {              
            reactHandler.setState({  
              MainNavItems: resultData.d.results                                    
            });   
            reactHandler.EnableContentEditorForSuperAdmins();
            $('#root-nav-links ul li').on('click', function(){
              $(this).siblings().removeClass('active');      
              $(this).addClass('active');       
            });                 
          },  
          error : function(jqXHR, textStatus, errorThrown) {  
          }  
      });
    }catch(err){
      console.log("Navigation Main Nav : " + err);
    }
  }

  public GetDepartments(){   
    //$(".global-qlink-main").hide();
    //$(".global-dept-main").show();
    $(".resp-dept-submenu-mob").toggleClass("active");
    $(".resp-qlink-submenu").removeClass("active");
    $(".global-qlink-main").removeClass("open");
    $(".global-dept-main").toggleClass("open");
    var reactHandler = this;
    reactHandler.displayData=[];
    reactHandler.displayDataResponsive=[];
    try{
      $.ajax({         
          url: `https://remodigital.sharepoint.com/sites/ClientPOC/_api/web/lists/getbytitle('DepartmentsMaster')/items?$select=Title,ID,URL,HasSubDept,OpenInNewTab,PlaceUnder/Title,PlaceUnder/Id&$filter=IsActive eq 1&$orderby=Order0 asc&$expand=PlaceUnder/Id,PlaceUnder`,
          type: "GET", 
          async: false, 
          headers:{'Accept': 'application/json; odata=verbose;'},  
          success: function(resultData) {              
            reactHandler.setState({  
              DeptandQuickLinksItems: resultData.d.results                                    
            });    
            for(var i =0; i< resultData.d.results.length; i++){        
              if(resultData.d.results[i].PlaceUnder.Title == undefined){   
              let ID = resultData.d.results[i].Id;
              var Title = resultData.d.results[i].Title;
              var Url = resultData.d.results[i].URL.Url;
              let OpenInNewTab = resultData.d.results[i].OpenInNewTab;
              let HasSubDept = resultData.d.results[i].HasSubDept;
              reactHandler.appendData(ID,Title,OpenInNewTab,HasSubDept,Url);  
              }              
            }  
            $(".submenu-wrap-lists ul li").on("click",function(){
              $(this).siblings().removeClass('active');      
              $(this).addClass('active'); 
            });           
          },  
          error : function(jqXHR, textStatus, errorThrown) {  
          }  
      });
    }catch(err){
      console.log("Navigation Department Link : " + err);
    }
  }

  public GetQuickLinks(){
    //$(".global-dept-main").hide();
    //$(".global-qlink-main").show();
    $(".resp-qlink-submenu").toggleClass("active");
    $(".resp-dept-submenu-mob").removeClass("active");
    $(".third-level-submenu").removeClass("open");
    $(".global-dept-main").removeClass("open");
    $(".global-qlink-main").toggleClass("open");
    var reactHandler = this;
    reactHandler.displayDataQlink=[];
    reactHandler.displayDataQlinkResponsive=[];
    try{
      $.ajax({  
          url: `https://remodigital.sharepoint.com/sites/ClientPOC/_api/web/lists/getbytitle('Quick Links')/items?$select=Title,OpenInNewPage,URL&$filter=IsActive eq 1&$orderby=Order0 asc`,  
          type: "GET",  
          headers:{'Accept': 'application/json; odata=verbose;'},  
          success: function(resultData) {              
            reactHandler.setState({  
              QuickLinkItems: resultData.d.results                                    
            }); 
            for(var i =0; i< resultData.d.results.length; i++){           
              var Title = resultData.d.results[i].Title;
              var Url = resultData.d.results[i].URL.Url;
              let OpenInNewTab = resultData.d.results[i].OpenInNewPage;              
              reactHandler.appendDataQLink(Title,OpenInNewTab,Url);                
            }                                 
          },  
          error : function(jqXHR, textStatus, errorThrown) {  
          }  
      });
    }catch(err){
      console.log("Navigation Quick Link : " + err);
    }
  }

  public GetSubNodes(ID,Title,ClickFrom,key){  
    $("#"+ID+"-Dept-Child").empty();
    //$("#"+ID+"-Dept-Child").show();
    $("#"+ID+"-Dept-Child-parent").toggleClass("open");
    //$("#"+ID+"-Dept-Child").css("display" , "block !important");
    var reactHandler = this;     
    this.displayDataLevel2=[];
    this.displayDataLevel2Responsive=[];
    $.ajax({  
        url: `https://remodigital.sharepoint.com/sites/ClientPOC/_api/web/lists/getbytitle('DepartmentsMaster')/items?$select=Title,ID,URL,HasSubDept,OpenInNewTab,PlaceUnder/Title,PlaceUnder/Id&$filter=IsActive eq 1 and PlaceUnder/Id eq '${ID}'&$orderby=Order0 asc&$expand=PlaceUnder`,  
        type: "GET",  
        async:false,
        headers:{'Accept': 'application/json; odata=verbose;'},  
        success: function(resultData) {  
          reactHandler.setState({  
            DeptandQuickLinksItems: resultData.d.results                                    
          });                     
          for(var i =0; i< resultData.d.results.length; i++){           
            let ItemID = resultData.d.results[i].Id;
            var Title = resultData.d.results[i].Title;            
            var Url = resultData.d.results[i].URL.Url;                      
            let OpenInNewTab = resultData.d.results[i].OpenInNewTab;
            let HasSubDept = resultData.d.results[i].HasSubDept;
            reactHandler.appendDataLevelTwo(ID,Title,OpenInNewTab,HasSubDept,Url);                              
          }                      
        },  
        error : function(jqXHR, textStatus, errorThrown) {  
        }  
    });
  }

  public GetSubNodesLevelTwo(ID,Title,ClickFrom,key){
    var reactHandler = this;
    //reactHandler.displayData=[];
    $.ajax({  
        url: `https://remodigital.sharepoint.com/sites/ClientPOC/_api/web/lists/getbytitle('DepartmentsMaster')/items?$select=Title,ID,URL,HasSubDept,OpenInNewTab,PlaceUnder/Title,PlaceUnder/Id&$filter=IsActive eq 1 and PlaceUnder/Id eq '${ID}'&$orderby=Order0 asc&$expand=PlaceUnder`,  
        type: "GET",  
        async:false,
        headers:{'Accept': 'application/json; odata=verbose;'},  
        success: function(resultData) {                                
          for(var i =0; i< resultData.d.results.length; i++){           
            let ItemID = resultData.d.results[i].Id;
            var Title = resultData.d.results[i].Title;
            var Url = resultData.d.results[i].URL.Url;
            let OpenInNewTab = resultData.d.results[i].OpenInNewTab;
            let HasSubDept = resultData.d.results[i].HasSubDept;
            reactHandler.appendDataLevelTwo(ID,Title,OpenInNewTab,HasSubDept,Url);                  
          }                      
        },  
        error : function(jqXHR, textStatus, errorThrown) {  
        }  
    });
  }

  public appendData(ID,Title,OpenInNewTab,HasSubDept,Url) {               
    var reactHandler = this;          
    if(OpenInNewTab == true){
      if(HasSubDept == true){
        reactHandler.displayData.push(<li className="GetSubNodes"> 
        <a href={Url} target="_blank" data-interception="off" role="button">{Title}  </a>  
        <a href="#" onClick={() => reactHandler.GetSubNodes(ID,Title,"NavMain"," ")}><i className="fa fa-caret-down" aria-hidden="true" ></i></a>
            <div className="third-level-submenu relative" id={`${ID}-Dept-Child-parent`}>
              <ul id={`${ID}-Dept-Child`}>                                                            
                {reactHandler.state.showdataLevelTwo}
              </ul>   
            </div>           
        </li>);

        //For Responsive
        reactHandler.displayDataResponsive.push(<li className="GetSubNodes"> 
        <a href={Url} target="_blank" data-interception="off" role="button"><span>{Title}</span>  </a>  
        <a href="#" onClick={() => reactHandler.GetSubNodes(ID,Title,"NavMain"," ")}><i className="fa fa-caret-down" aria-hidden="true" ></i></a>
            <div className="third-level-submenu relative" id={`${ID}-Dept-Child-parent`}>
              <ul id={`${ID}-Dept-Child`}>                                                            
                {reactHandler.state.showdataLevelTwoResponsive}
              </ul>   
            </div>           
        </li>);


        reactHandler.setState({
          showdata : this.displayData,
          showdataResponsive : this.displayDataResponsive
        });
      }else{
        reactHandler.displayData.push(<li> 
        <a href={Url} target="_blank" data-interception="off" role="button" >{Title}</a>
        </li>);

        //For Responsive
        reactHandler.displayDataResponsive.push(<li> 
          <a href={Url} target="_blank" data-interception="off" role="button" ><span>{Title}</span></a>
          </li>);

        reactHandler.setState({
          showdata : this.displayData,
          showdataResponsive : this.displayDataResponsive
        });
      }      
      
    }else{
      if(HasSubDept == true){
        reactHandler.displayData.push(<li className="GetSubNodes"> 
        <a href={Url} data-interception="off" role="button">{Title} </a>                 
        <a href="#" onClick={() => reactHandler.GetSubNodes(ID,Title,"NavMain"," ")}><i className="fa fa-caret-down" aria-hidden="true" ></i></a>
            <div className="third-level-submenu relative" id={`${ID}-Dept-Child-parent`}>
              <ul id={`${ID}-Dept-Child`}>                                                            
                {reactHandler.state.showdataLevelTwo}
              </ul>   
            </div>           
        </li>);

        //For Responsive
        reactHandler.displayDataResponsive.push(<li className="GetSubNodes"> 
          <a href={Url} data-interception="off" role="button">{Title} </a>                 
          <a href="#" onClick={() => reactHandler.GetSubNodes(ID,Title,"NavMain"," ")}><i className="fa fa-caret-down" aria-hidden="true" ></i></a>
            <div className="third-level-submenu relative" id={`${ID}-Dept-Child-parent`}>
              <ul id={`${ID}-Dept-Child`}>                                                            
                {reactHandler.state.showdataLevelTwoResponsive}
              </ul>   
            </div>           
        </li>);

        reactHandler.setState({
          showdata : this.displayData,
          showdataResponsive : this.displayDataResponsive
        });
      }else{
        reactHandler.displayData.push(<li> 
        <a href={Url} data-interception="off" role="button"> {Title}</a>
        </li>);

        //For Responsive
        reactHandler.displayDataResponsive.push(<li> 
          <a href={Url} data-interception="off" role="button"><span> {Title}</span></a>
        </li>);

        reactHandler.setState({
          showdata : this.displayData,
          showdataResponsive : this.displayDataResponsive
        });
      }
      
    }              
 }
 
public appendDataLevelTwo(ID,Title,OpenInNewTab,HasSubDept,Url){   
  var reactHandler = this;          
  if(OpenInNewTab == true){
    if(HasSubDept == true){
      
      $("#"+ID+"-Dept-Child").append(`<li class="GetSubNodesLevelTwo"> 
      <a href=${Url} target="_blank" data-interception="off" role="button">${Title}</a> <i class="fa fa-caret-down" aria-hidden="true""></i>        
        <div class="third-level-submenu relative">
          <ul class="clearfix" id="${ID}-Dept-Child">                                                            
            
          </ul>    
        </div>
      </li>`);
    }else{
      
      $("#"+ID+"-Dept-Child").append(`<li> 
      <a href=${Url} target="_blank" data-interception="off" role="button" >${Title}</a>
      </li>`);
    }
    reactHandler.setState({
      showdataLevelTwo : this.displayDataLevel2,
      showdataLevelTwoResponsive : this.displayDataLevel2Responsive
   });  
  }else{
    if(HasSubDept == true){
      
      $("#"+ID+"-Dept-Child").append(`<li class="GetSubNodesLevelTwo"> 
      <a href=${Url} target="_blank" data-interception="off" role="button">${Title}</a> <i class="fa fa-caret-down" aria-hidden="true""></i>        
        <div class="third-level-submenu relative">
          <ul class="clearfix" id="${ID}-Dept-Child">                                                            
            
          </ul>    
        </div>
      </li>`);
    }else{
      
      $("#"+ID+"-Dept-Child").append(`<li> 
      <a href=${Url} data-interception="off" role="button"> ${Title}</a>
      </li>`);
    }
    reactHandler.setState({
      showdataLevelTwo : this.displayDataLevel2,
      showdataLevelTwoResponsive : this.displayDataLevel2Responsive
   });  
  }  
  
}
 

 public appendDataQLink(Title,OpenInNewTab,Url) {             
  var reactHandler = this;      
  if(OpenInNewTab == true){    
    reactHandler.displayDataQlink.push(<li> 
      <a href={`${Url}`} target="_blank" data-interception="off" role="button">{Title}</a>
    </li>);

    //For Responsive
    reactHandler.displayDataQlinkResponsive.push(<li> 
      <a href={`${Url}`} target="_blank" data-interception="off" role="button"><span>{Title}</span></a>
    </li>);
  }else{
    reactHandler.displayDataQlink.push(<li> 
      <a href={`${Url}`} data-interception="off" role="button">{Title}</a>
    </li>);

    //For Responsive
    reactHandler.displayDataQlinkResponsive.push(<li> 
      <a href={`${Url}`} data-interception="off" role="button"><span>{Title}</span></a>
    </li>);
  }    
  reactHandler.setState({
    showdataqlink : reactHandler.displayDataQlink,
    showdataqlinkResponsive : reactHandler.displayDataQlinkResponsive
 });      
}
  
  /*public appendData(ID,Title,OpenInNewTab,HasSubDept,Url) {               
    var reactHandler = this;          
    if(OpenInNewTab == true){
      if(HasSubDept == true){
        reactHandler.displayData.push(<li className="GetSubNodes"> 
        <a href={Url} target="_blank" data-interception="off" role="button">{Title}  </a>  
        <a href="#" onClick={() => reactHandler.GetSubNodes(ID,Title,"NavMain"," ")}><i className="fa fa-caret-down" aria-hidden="true" ></i></a>
            <div className="third-level-submenu relative" id={`${ID}-Dept-Child-parent`}>
              <ul id={`${ID}-Dept-Child`}>                                                            
                {reactHandler.state.showdataLevelTwo}
              </ul>   
            </div>           
        </li>);
        reactHandler.setState({
          showdata : this.displayData
        });
      }else{
        reactHandler.displayData.push(<li> 
        <a href={Url} target="_blank" data-interception="off" role="button" >{Title}</a>
        </li>);
        reactHandler.setState({
          showdata : this.displayData
        });
      }      
      
    }else{
      if(HasSubDept == true){
        reactHandler.displayData.push(<li className="GetSubNodes"> 
        <a href={Url} data-interception="off" role="button">{Title} </a>                 
        <a href="#" onClick={() => reactHandler.GetSubNodes(ID,Title,"NavMain"," ")}><i className="fa fa-caret-down" aria-hidden="true" ></i></a>
            <div className="third-level-submenu relative" id={`${ID}-Dept-Child-parent`}>
              <ul id={`${ID}-Dept-Child`}>                                                            
                {reactHandler.state.showdataLevelTwo}
              </ul>   
            </div>           
        </li>);
        reactHandler.setState({
          showdata : this.displayData
        });
      }else{
        reactHandler.displayData.push(<li> 
        <a href={Url} data-interception="off" role="button"> {Title}</a>
        </li>);
        reactHandler.setState({
          showdata : this.displayData
        });
      }
      
    }              
 }
 
public appendDataLevelTwo(ID,Title,OpenInNewTab,HasSubDept,Url){   
  var reactHandler = this;          
  if(OpenInNewTab == true){
    if(HasSubDept == true){
      
      $("#"+ID+"-Dept-Child").append(`<li class="GetSubNodesLevelTwo"> 
      <a href=${Url} target="_blank" data-interception="off" role="button">${Title}</a> <i class="fa fa-caret-down" aria-hidden="true""></i>        
        <div class="third-level-submenu relative">
          <ul class="clearfix" id="${ID}-Dept-Child">                                                            
            
          </ul>    
        </div>
      </li>`);
    }else{
      
      $("#"+ID+"-Dept-Child").append(`<li> 
      <a href=${Url} target="_blank" data-interception="off" role="button" >${Title}</a>
      </li>`);
    }
    reactHandler.setState({
      showdataLevelTwo : this.displayDataLevel2
   });  
  }else{
    if(HasSubDept == true){
      
      $("#"+ID+"-Dept-Child").append(`<li class="GetSubNodesLevelTwo"> 
      <a href=${Url} target="_blank" data-interception="off" role="button">${Title}</a> <i class="fa fa-caret-down" aria-hidden="true""></i>        
        <div class="third-level-submenu relative">
          <ul class="clearfix" id="${ID}-Dept-Child">                                                            
            
          </ul>    
        </div>
      </li>`);
    }else{
      
      $("#"+ID+"-Dept-Child").append(`<li> 
      <a href=${Url} data-interception="off" role="button"> ${Title}</a>
      </li>`);
    }
    reactHandler.setState({
      showdataLevelTwo : this.displayDataLevel2
   });  
  }  
  
}
 

 public appendDataQLink(Title,OpenInNewTab,Url) {             
  var reactHandler = this;      
  if(OpenInNewTab == true){    
    reactHandler.displayDataQlink.push(<li> 
      <a href={`${Url}`} target="_blank" data-interception="off" role="button">{Title}</a>
    </li>);
  }else{
    reactHandler.displayDataQlink.push(<li> 
      <a href={`${Url}`} data-interception="off" role="button">{Title}</a>
    </li>);
  }    
  reactHandler.setState({
    showdataqlink : reactHandler.displayDataQlink
 });      
}*/

OpenSearchPage(e){  
  if(e.keyCode == 13){   
    window.open(
      `https://remodigital.sharepoint.com/sites/ClientPOC/_layouts/15/search.aspx/?q=${e.target.value}&env=WebView`,
      "_self"      
    );
  }
}

public OpenBurggerMenu(){
  $(".responsive-menu-wrap").addClass("open");
}
public CloseBurggerMenu(){
  $(".responsive-menu-wrap").removeClass("open");
}
public OpenSearch(){
  $(".responsive-background").addClass("open");
  $(".search").addClass("open");
}

public ShowUserDetailBlock(){
  $(".user-profile-details").toggleClass("open");
}

public CloseUserDetailsBlock(){
  $(".user-profile-details").removeClass("open");
}

    public render(): React.ReactElement<ISideNavProps> {
      $('.globalleftmenu-fixed-area ul li').on('click', function(){
        $(this).siblings().removeClass('active');
        $(this).siblings().removeClass('open');
        $(this).addClass('active');
        $(this).toggleClass('open');
      });

      var handler = this;
      
    
    const MainNavigations: JSX.Element[] = handler.state.MainNavItems.map(function(item,key){

        if(item.OpenInNewTab == true){          
          if(item.LinkMasterID.Title == "DEPT_00001"){
            return(
              <li className="submenu relative "> <a href="#" onClick={()=>handler.GetDepartments()}>{item.Title}<i className="fa fa-caret-down" aria-hidden="true"></i></a>
                  <ul className="main-submenu global-dept-main">                                                            
                    {handler.state.showdata}
                  </ul>                                                   
              </li>
            );
          }
          if(item.LinkMasterID.Title == "QLINK_00002"){
            return(                            
              <li className="submenu "> <a href="#" onClick={()=>handler.GetQuickLinks()}>{item.Title}<i className="fa fa-caret-down" aria-hidden="true"></i></a>                 
                  <ul className="main-submenu global-qlink-main">                                                            
                    {handler.state.showdataqlink}
                  </ul>                                               
              </li>
            );
          }
          if(item.LinkMasterID.Title == undefined){
            var str = item.Title;            
            var DomID = str.replace(/[_\W]+/g, "_");
            if(item.Title == "Home"){
              return(
                <li className=" " id={DomID}> <a href={`${item.URL}`} target="_blank" data-interception="off"> {item.Title}</a> </li>
              );
            }else if(item.Title == "Content Editor"){                
                if(handler.state.IsAdminForContentEditor == true){
                  return(                
                    <li id={DomID}> <a href={`${item.URL}`} target="_blank" data-interception="off"> {item.Title}</a> </li>
                  );
                }
              }else{
                return(
                  <li id={DomID}> <a href={`${item.URL}`} target="_blank" data-interception="off"> {item.Title}</a> </li>
                );
              }
                                 
          }                                   
        }else{
          if(item.LinkMasterID.Title == "DEPT_00001"){
            return(
              <li className="submenu relative"> <a href="#" onClick={()=>handler.GetDepartments()}>{item.Title}<i className="fa fa-caret-down" aria-hidden="true"></i> </a>                 
                  <ul className="main-submenu global-dept-main">                                                            
                    {handler.state.showdata}
                  </ul>                                                    
              </li>
            );
          }
          if(item.LinkMasterID.Title == "QLINK_00002"){
            return(
              <li className="submenu relative"> <a href="#" onClick={()=>handler.GetQuickLinks()}>{item.Title}<i className="fa fa-caret-down" aria-hidden="true"></i></a>                
                  <ul className="main-submenu global-qlink-main">                                                            
                    {handler.state.showdataqlink}
                  </ul>                                                 
              </li>
            );
          }
          if(item.LinkMasterID.Title == undefined){
            var str2 = item.Title;            
            var DomID2 = str2.replace(/[_\W]+/g, "_");
            if(item.Title == "Home"){              
              return(
                <li className=" " id={DomID2}> <a href={`${item.URL}`} data-interception="off"> {item.Title}</a> </li>
              );
            }else if(item.Title == "Content Editor"){               
                if(handler.state.IsAdminForContentEditor == true){
                  return(                
                    <li id={DomID}> <a href={`${item.URL}`} data-interception="off"> {item.Title}</a> </li>
                  );
                }
              }else{
                return(
                  <li id={DomID}> <a href={`${item.URL}`} data-interception="off"> {item.Title}</a> </li>
                );
              }
            }            
                    
        }      
    });

    const ResponsiveMainNavigations: JSX.Element[] = handler.state.MainNavItems.map(function(item,key){

      if(item.OpenInNewTab == true){          
        if(item.LinkMasterID.Title == "DEPT_00001"){
          return(
            <li className="submenu resp-dept-submenu-mob"> <a href="#" onClick={()=>handler.GetDepartments()}><span>{item.Title}</span><img src="https://remodigital.sharepoint.com/sites/ClientPOC/SiteAssets/Remo%20Portal%20Assets/img/next.svg" alt="image" /></a>
                <div className="responsi-inner-submenu">
                  <ul>                                                            
                    {handler.state.showdataResponsive}
                  </ul>      
                </div>                                             
            </li>
          );
        }
        if(item.LinkMasterID.Title == "QLINK_00002"){
          return(                            
            <li className="submenu resp-qlink-submenu"> <a href="#" onClick={()=>handler.GetQuickLinks()}><span>{item.Title}</span><img src="https://remodigital.sharepoint.com/sites/ClientPOC/SiteAssets/Remo%20Portal%20Assets/img/next.svg" alt="image" /></a>                 
                <div className="responsi-inner-submenu">
                  <ul>                                                            
                    {handler.state.showdataqlinkResponsive}
                  </ul>   
                </div>                                            
            </li>
          );
        }
        if(item.LinkMasterID.Title == undefined){
          var str = item.Title;            
          var DomID = str.replace(/[_\W]+/g, "_");
          if(item.Title == "Home"){
            return(
              <li className=" " id={DomID}> <a href={`${item.URL}`} target="_blank" data-interception="off"><span> {item.Title}</span></a> </li>
            );
          }else if(item.Title == "Content Editor"){                
              if(handler.state.IsAdminForContentEditor == true){
                return(                
                  <li id={DomID}> <a href={`${item.URL}`} target="_blank" data-interception="off"> <span>{item.Title}</span></a> </li>
                );
              }
            }else{
              return(
                <li id={DomID}> <a href={`${item.URL}`} target="_blank" data-interception="off"><span> {item.Title}</span></a> </li>
              );
            }
                               
        }                                   
      }else{
        if(item.LinkMasterID.Title == "DEPT_00001"){
          return(
            <li className="submenu resp-dept-submenu-mob"> <a href="#" onClick={()=>handler.GetDepartments()}><span>{item.Title}</span><img src="https://remodigital.sharepoint.com/sites/ClientPOC/SiteAssets/Remo%20Portal%20Assets/img/next.svg" alt="image" /></a>
                <div className="responsi-inner-submenu">
                  <ul>                                                            
                    {handler.state.showdataResponsive}
                  </ul>      
                </div>                                             
            </li>
          );
        }
        if(item.LinkMasterID.Title == "QLINK_00002"){
          return(
            <li className="submenu resp-qlink-submenu"> <a href="#" onClick={()=>handler.GetQuickLinks()}><span>{item.Title}</span><img src="https://remodigital.sharepoint.com/sites/ClientPOC/SiteAssets/Remo%20Portal%20Assets/img/next.svg" alt="image" /></a>                 
                <div className="responsi-inner-submenu">
                  <ul>                                                            
                    {handler.state.showdataqlinkResponsive}
                  </ul>   
                </div>                                            
            </li>
          );
        }
        if(item.LinkMasterID.Title == undefined){
          var str2 = item.Title;            
          var DomID2 = str2.replace(/[_\W]+/g, "_");
          if(item.Title == "Home"){              
            return(
              <li className=" " id={DomID2}> <a href={`${item.URL}`} data-interception="off"><span> {item.Title}</span></a> </li>
            );
          }else if(item.Title == "Content Editor"){               
              if(handler.state.IsAdminForContentEditor == true){
                return(                
                  <li id={DomID}> <a href={`${item.URL}`} data-interception="off"><span> {item.Title}</span></a> </li>
                );
              }
            }else{
              return(
                <li id={DomID}> <a href={`${item.URL}`} data-interception="off"><span> {item.Title}</span></a> </li>
              );
            }
          }            
                  
      }      
  });

    return (
      <div className="visiblei ms-slideRightIn40 GlobalLeftNavigation">
        <header>
          <div className="container ">
            <div className="header-left">
              <div className="logo">
                <a className="logo-anchor" href="https://remodigital.sharepoint.com/sites/ClientPOC/SitePages/Home.aspx?env=WebView" data-interception="off">  <img src={this.state.SiteLogo} alt="image" /> </a>
              </div>
              <div className="search relative">
                    <img src="https://remodigital.sharepoint.com/sites/ClientPOC/SiteAssets/Remo%20Portal%20Assets/img/search.png" alt="image"/>
                    <input type="text" className="form-control insearch" placeholder="Search Here" onKeyDown={this.OpenSearchPage}/>
                </div>
            </div>
            <div className="header-right">
              <div className="header-right-lists">
                <ul>
                  <li className="meet-count" data-tip data-for={"React-tooltip-calendar"} data-custom-class="tooltip-custom"> 
                    <a href="https://outlook.office365.com/calendar/view/month" target="_blank" data-interception="off" className="notification relative" >
                      <img src={`https://remodigital.sharepoint.com/sites/ClientPOC/SiteAssets/Remo%20Portal%20Assets/img/tq1.svg`} alt="images"/>
                      <span id="Meetings_count"> {this.state.MeetingsCount} </span>
                    </a>
                    <ReactTooltip id={"React-tooltip-calendar"} place="bottom" type="dark" effect="solid">
                      <span>Calendar</span>
                    </ReactTooltip>
                  </li>
                  <li data-tip data-for={"React-tooltip-my-team"} data-custom-class="tooltip-custom"> 
                    <a href={`https://remodigital.sharepoint.com/sites/ClientPOC/SitePages/My-Team.aspx?env=WebView`} data-interception="off" className="notification relative">
                      <img src={`https://remodigital.sharepoint.com/sites/ClientPOC/SiteAssets/Remo%20Portal%20Assets/img/tq2.svg`} alt="images"/>
                    </a>
                    <ReactTooltip id={"React-tooltip-my-team"} place="bottom" type="dark" effect="solid">
                      <span>My Team</span>
                    </ReactTooltip>
                  </li>
                  <li className="count-email" data-tip data-for={"React-tooltip-Email"} data-custom-class="tooltip-custom"> 
                    <a href="https://outlook.office365.com/mail/inbox" target="_blank" data-interception="off" className="notification relative">
                      <img src={`https://remodigital.sharepoint.com/sites/ClientPOC/SiteAssets/Remo%20Portal%20Assets/img/tq3.svg`} alt="images"/>
                      <span id="Emails_count"> {this.state.EmailCount} </span>
                    </a>
                    <ReactTooltip id={"React-tooltip-Email"} place="bottom" type="dark" effect="solid">
                      <span>EMail</span>
                    </ReactTooltip>
                  </li>
                  <li data-tip data-for={"React-tooltip-Task"} data-custom-class="tooltip-custom"> 
                    <a href="#" className="notification relative">
                      <img src={`https://remodigital.sharepoint.com/sites/ClientPOC/SiteAssets/Remo%20Portal%20Assets/img/tq4.svg`} alt="images"/>
                    </a>
                    <ReactTooltip id={"React-tooltip-Task"} place="bottom" type="dark" effect="solid">
                      <span>Task</span>
                    </ReactTooltip>
                  </li>

                  <li className="user-images"> <a href="#" className="notification relative" onClick={()=>this.ShowUserDetailBlock()} onMouseLeave={()=>this.CloseUserDetailsBlock()}> 
                    <img src={`${this.state.CurrentUserProfilePic}`} alt="images"/>
                      <div className="user-profile-details">
                        <h3>  {this.state.CurrentUserName} </h3>  
                        <p> {this.state.CurrentUserDesignation} </p>
                        <div className="logou-bck">
                          <a href="https://login.microsoftonline.com/common/oauth2/logout"><i className="fa fa-sign-out" aria-hidden="true"></i> Logout</a>
                        </div>
                      </div>
                    </a> 
                  </li>
                </ul>
              </div>
              <div className="responsive-inner-classes">
                <ul>
                  <li> <a href="#" onClick={()=>this.OpenSearch()}><img src="https://remodigital.sharepoint.com/sites/ClientPOC/SiteAssets/Remo%20Portal%20Assets/img/res_searc.svg" alt="image"/> </a></li>
                  <li> <a href="#" onClick={()=>this.OpenBurggerMenu()}><img src="https://remodigital.sharepoint.com/sites/ClientPOC/SiteAssets/Remo%20Portal%20Assets/img/burger_menu.svg" alt="image"/> </a></li>
                </ul>
              </div>
            </div>
          </div>
        </header>
        <div className="inner-pages-nav">
          <div className="container">
            <nav>
              <ul>
                {MainNavigations}
              </ul>
            </nav>
          </div>
        </div>

        {/*reponaive contents  menu */}

        <div className="responsive-menu-wrap"> 
          <div className="reponsive-quick-wrap">
            <div className="main-menu">
              <ul>
                {ResponsiveMainNavigations}
                
              </ul>
            </div>
          </div>
          <div className="responsive-qiuck-close">
              <a href="#" onClick={()=>this.CloseBurggerMenu()}><i className="fa fa-close"></i></a>
          </div>
          <div className="responsive-background">
                  
          </div>
        </div>

        <div className="responsive-notifications">
          <ul>
            <li className="meet-count" data-tip data-for={"React-tooltip-calendar-resp"} data-custom-class="tooltip-custom"> 
              <a href="https://outlook.office365.com/calendar/view/month" target="_blank" data-interception="off" className="notification relative" >
                <img src={`https://remodigital.sharepoint.com/sites/ClientPOC/SiteAssets/Remo%20Portal%20Assets/img/rn4.svg`} alt="images"/>
                <span id="Meetings_count"> {this.state.MeetingsCount} </span>
              </a>
              <ReactTooltip id={"React-tooltip-calendar-resp"} place="top" type="dark" effect="solid">
                <span>Calendar</span>
              </ReactTooltip>
            </li>
            <li data-tip data-for={"React-tooltip-my-team-resp"} data-custom-class="tooltip-custom"> 
              <a href={`https://remodigital.sharepoint.com/sites/ClientPOC/SitePages/My-Team.aspx?env=WebView`} data-interception="off" className="notification relative">
                <img src={`https://remodigital.sharepoint.com/sites/ClientPOC/SiteAssets/Remo%20Portal%20Assets/img/rn1.svg`} alt="images"/>
              </a>
              <ReactTooltip id={"React-tooltip-my-team-resp"} place="top" type="dark" effect="solid">
                <span>My Team</span>
              </ReactTooltip>
            </li>
            <li className="count-email" data-tip data-for={"React-tooltip-Email-resp"} data-custom-class="tooltip-custom"> 
              <a href="https://outlook.office365.com/mail/inbox" target="_blank" data-interception="off" className="notification relative">
                <img src={`https://remodigital.sharepoint.com/sites/ClientPOC/SiteAssets/Remo%20Portal%20Assets/img/rn2.svg`} alt="images"/>
                <span id="Emails_count"> {this.state.EmailCount} </span>
              </a>
              <ReactTooltip id={"React-tooltip-Email-resp"} place="top" type="dark" effect="solid">
                <span>EMail</span>
              </ReactTooltip>
            </li>
            <li data-tip data-for={"React-tooltip-Task-resp"} data-custom-class="tooltip-custom"> 
              <a href="#" className="notification relative">
                <img src={`https://remodigital.sharepoint.com/sites/ClientPOC/SiteAssets/Remo%20Portal%20Assets/img/rn3.svg`} alt="images"/>
              </a>
              <ReactTooltip id={"React-tooltip-Task-resp"} place="top" type="dark" effect="solid">
                <span>Task</span>
              </ReactTooltip>
            </li>
          </ul>
        </div>

      </div>
    );
  }
}
