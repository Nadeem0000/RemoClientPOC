import * as React from 'react';
import styles from './RemoMyTeam.module.scss';
import { IRemoMyTeamProps } from './IRemoMyTeamProps';
import { escape } from '@microsoft/sp-lodash-subset';
//import Calendar from 'tui-calendar'; /* ES6 */
//import "tui-calendar/dist/tui-calendar.css";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as moment from 'moment';
import * as $ from 'jquery';
import { SPComponentLoader } from '@microsoft/sp-loader';
// Import react-circular-progressbar module and styles
import {
    CircularProgressbar,
    CircularProgressbarWithChildren,
    buildStyles
  } from "react-circular-progressbar";
  import "react-circular-progressbar/dist/styles.css";
  


export interface IRemoMyTeamState{
    Items:any[];
    Data:any[];
    TeamMembersData:any[];
    CurrentEmpCode:string;
    CurrentUserEmail:string;
    TopLevel:string;
    ChildLevel:string;
    CurrentlyExpandedID:string;
    IsAnyExpanded:boolean;
  }


  var Name = "";
  var uniqueEmpCode=[];
  var AllSubNodeEmpDetails=[];
  var CodeEmp=[];
export default class RemoMyTeam extends React.Component<IRemoMyTeamProps, IRemoMyTeamState,{}> {
    constructor(props: IRemoMyTeamProps, state: IRemoMyTeamState) {
        super(props);
        SPComponentLoader.loadScript("https://cdnjs.cloudflare.com/ajax/libs/easy-pie-chart/2.1.6/jquery.easypiechart.min.js");
        this.state = {
        Items: [],
        Data:[],
        TeamMembersData: [],
        CurrentEmpCode:"",
        CurrentUserEmail:"",
        TopLevel:"",
        ChildLevel:"",
        CurrentlyExpandedID:"",
        IsAnyExpanded:false,
        };
        }
    
        public componentDidMount(){
            $('#spCommandBar').attr('style', 'display: none !important');
            $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
            
            //Dynamic Height
            
            setTimeout(function(){
                let CalendarHeight = $('.spfxcalendar').height();
                $(".if-team-present").css("height",""+CalendarHeight+"");
                $(".if-sub-team-present").css("height",""+CalendarHeight+"");
                $(".if-no-team").css("height",""+CalendarHeight+"");
              },2500);
              setTimeout(function(){
                let CalendarHeight = $('.spfxcalendar').height();
                $(".if-team-present").css("height",""+CalendarHeight+"");
                $(".if-sub-team-present").css("height",""+CalendarHeight+"");
                $(".if-no-team").css("height",""+CalendarHeight+"");
              },5000);
              setTimeout(function(){
                let CalendarHeight = $('.spfxcalendar').height();
                $(".if-team-present").css("height",""+CalendarHeight+"");
                $(".if-sub-team-present").css("height",""+CalendarHeight+"");
                $(".if-no-team").css("height",""+CalendarHeight+"");
              },7000);


            var reactHandler = this;
            reactHandler.GetCurrentUserName();        
        }
    
        private GetCurrentUserName(){  
            //alert();
            $(".if-sub-team-present").hide();            
            $('.Team-Child-Div.open-employee').attr('style', 'display: none !important');
            var reacthandler = this;           
            $.ajax({  
              url: `${reacthandler.props.siteurl}/_api/SP.UserProfiles.PeopleManager/GetMyProperties`,  
              type: "GET",  
              headers:{'Accept': 'application/json; odata=verbose;'},  
              success: function(resultData) {                 
              var email = resultData.d.Email; 
              reacthandler.setState({CurrentUserEmail:email});
              reacthandler.GetMyTeamMembersLeaveBalance(email);                      
              },  
              error : function(jqXHR, textStatus, errorThrown) {  
              }  
            });
          }

          public GetMyTeamMembersLeaveBalance(emaill){            
              var email = "test@tmax.in";
            try{
                var reactHandler = this;
                let Emplpoyee_code = "";
                let Manager_code = "";
                $.ajax({  
                    url: `${this.props.siteurl}/_api/web/lists/getbytitle('OrgChart Master')/items?$select=Title,Name,Email,Designation,Manager_code&$filter=Email eq '${email}' and Employee_status eq 'Active'`,                        
                    type: "GET",  
                    headers:{'Accept': 'application/json; odata=verbose;'},  
                    success: function(resultData) {                         
                    if(resultData.d.results[0].Title != undefined && resultData.d.results[0].Title != null){
                        Emplpoyee_code = resultData.d.results[0].Title;
                        Manager_code = resultData.d.results[0].Manager_code;   
                        reactHandler.setState({CurrentEmpCode:Emplpoyee_code});          
                        reactHandler._getTeamDatas(Emplpoyee_code,Manager_code);  //Emplpoyee_code,Manager_code
                        $(".if-no-team").hide();
                        $(".if-team-present").show();                        
                    }  else{
                        Emplpoyee_code = "";
                        Manager_code = "";
                        $(".if-no-team").show();
                    }                          
                    },  
                    error : function(jqXHR, textStatus, errorThrown) { 
                        $(".if-no-team").show(); 
                    }  
                });
            }catch(err){               
                $(".if-no-team").show();
            }
          }
         
        private _getTeamDatas(Emplpoyee_code,Manager_code) {//Emplpoyee_code,Manager_code          
            //let Emplpoyee_code = '001';
        CodeEmp = [];
        var reactHandler = this;
        $.ajax({
        url: `${this.props.siteurl}/_api/web/lists/getbytitle('OrgChart Master')/items?$select=Title,Name,Manager_code,Email,UserProfileUrl,Annual_Leave_Balance&$top=5000&$filter=Manager_code eq '${Emplpoyee_code}' and Employee_status eq 'Active'&$orderby=Title asc`,  
          //url: `${this.props.siteurl}/_api/web/lists/getbytitle('EmployeeDetailsRamcoFinal')/items?$select=Legal_name,Communication_Email,UserProfileUrl,Annual_Leave_Balance&$top=1000`,  
        type: "GET",
        async:false,
        headers:{'Accept': 'application/json; odata=verbose;'},
        success: function(resultData) {
        reactHandler.setState({
        Items: resultData.d.results
        });
        if(resultData.d.results.length != 0){
            $(".if-no-team").hide();
            $(".if-team-present").show();
        }
        else{
            $(".if-no-team").show();
        }
        for(var i = 0; i<resultData.d.results.length; i++){
            CodeEmp.push({"EmpCode":""+resultData.d.results[i].Title+""});
            reactHandler.CheckTeamAvailability(resultData.d.results[i].Title);
        }
        
        },
        error : function(jqXHR, textStatus, errorThrown) {
        }
        });
        }

        public CheckTeamAvailability(EmpCode){                    
            $.ajax({  
                url: `${this.props.siteurl}/_api/web/lists/getbytitle('OrgChart Master')/items?$select=Title,Name,Manager_code,Email,UserProfileUrl,Annual_Leave_Balance&$filter=Manager_code eq '${EmpCode}' and Employee_status eq 'Active'&$orderby=Title asc`,  
              type: "GET",
              async:false,  
              headers:{'Accept': 'application/json; odata=verbose;'},  
              success: function(resultData) {                                  
                   if(resultData.d.results.length != 0){
                    $("#"+EmpCode+"Item").show();
                   } else{
                    $("#"+EmpCode+"Item").hide();                       
                   }               
              },  
              error : function(jqXHR, textStatus, errorThrown) {  
              }  
            });
        }

         

          private ExpandTeamMember(Emp_Code,Emp_Display_Name){

              $(document).find('.open-employee').removeClass("open-employee");
              $("#"+Emp_Code+"").show();
              $("#"+Emp_Code+"").addClass("open-employee");
            var BreadCrumArr:any[];
            uniqueEmpCode=[];
            AllSubNodeEmpDetails=[];
            let CalendarHeight = $('.spfxcalendar').height();
            $(".if-sub-team-present").css("height",""+CalendarHeight+"");
            $(".if-no-team").css("height",""+CalendarHeight+"");            
            var reacthandler = this;           
            $.ajax({  
                url: `${this.props.siteurl}/_api/web/lists/getbytitle('OrgChart Master')/items?$select=Title,Name,Manager_code,Email,UserProfileUrl,Annual_Leave_Balance&$filter=Manager_code eq '${Emp_Code}' and Employee_status eq 'Active'&$orderby=Title asc`,
              type: "GET",  
              async: false,
              headers:{'Accept': 'application/json; odata=verbose;'},  
              success: function(resultData) { 
                  if(resultData.d.results.length != 0){                                 
                    reacthandler.setState({TopLevel:resultData.d.results.length});
                  }
                $.each(resultData.d.results, function(key, value) {  
                    var EmpCode = value.Title;
                    if($.inArray(EmpCode, uniqueEmpCode) === -1){
                        uniqueEmpCode.push({"EmpCode": EmpCode});
                        AllSubNodeEmpDetails.push({"EmpCode": EmpCode, "Name":value.Name, "LeaveBalance":value.Annual_Leave_Balance, "UserPicture":value.UserProfileUrl.Url, "LegalName":value.Name, "ManagerCode":value.Manager_code, "Email": value.Email});
                    }                    
                });
 
                $.each(uniqueEmpCode, function(k, Item) {
                    var EmpCode = Item.EmpCode;
                    $.ajax({  
                        url: `${reacthandler.props.siteurl}/_api/web/lists/getbytitle('OrgChart Master')/items?$select=Title,Name,Manager_code,Email,UserProfileUrl,Annual_Leave_Balance&$filter=Manager_code eq '${EmpCode}' and Employee_status eq 'Active'&$orderby=Title asc`,
                      type: "GET",
                      async: false,  
                      headers:{'Accept': 'application/json; odata=verbose;'},  
                      success: function(resultData) {
                        if(resultData.d.results.length != 0){                                 
                            reacthandler.setState({ChildLevel:resultData.d.results.length});
                          }                                                                                             
                        $.each(resultData.d.results, function(key, value) {  
                            var EmpCode = value.Title;
                            if($.inArray(EmpCode, uniqueEmpCode) === -1){
                                uniqueEmpCode.push({"EmpCode": EmpCode});
                                AllSubNodeEmpDetails.push({"EmpCode": EmpCode, "Name":value.Name, "LeaveBalance":value.Annual_Leave_Balance, "UserPicture":value.UserProfileUrl.Url, "LegalName":value.Name, "ManagerCode":value.Manager_code, "Email": value.Email});
                            }                    
                        }); 
                      },  
                      error : function(jqXHR, textStatus, errorThrown) {  
                      }  
                    });  
                });                      
              },  
              error : function(jqXHR, textStatus, errorThrown) {  
              }  
            });
          }

          

  public render(): React.ReactElement<IRemoMyTeamProps> {      
        var reactHandler = this;
        
        const MyTeams: JSX.Element[] = reactHandler.state.Items.map(function(item,key) {   
            
            Name = item.Name;
            
            if(item.Annual_Leave_Balance < 20 || item.Annual_Leave_Balance == 0){     
            return (
                <li className="clearfix relative pareb">
                    <div className="team-meb-list-img">
                        <img src={item.UserProfileUrl.Url}/>
                    </div>
                    <div className="team-meb-list-desc">
                        <h3> {Name} </h3>
                        <p> {item.Email} </p>
                    </div>
                    <div className="teams-med-graph box">
                        <CircularProgressbar
                            value={item.Annual_Leave_Balance}
                            text={item.Annual_Leave_Balance}
                            maxValue={60}                          
                            styles={buildStyles({                                                        
                                rotation: 0,
                                strokeLinecap: 'butt',
                                textSize: '22px',                            
                                pathTransitionDuration: 0.5,
                                pathColor: `#f46d65`, //Red
                                textColor: '#333333',
                                trailColor: '#d6d6d6',
                                backgroundColor: '#3e98c7',
                            })}
                        />                                      
                    </div>

                    <a href="#" onClick={()=> reactHandler.ExpandTeamMember(item.Title,Name)} className="expand-myteam-leave">
                        <span className="services-right-arrow" id={item.Title+"Item"}>                        
                            <img src="https://remodigital.sharepoint.com/sites/ClientPOC/SiteAssets/Remo%20Portal%20Assets/img/arrow_down.svg" className="transition" alt="image"></img>                        
                        </span>
                    </a>

                   {/* <span className="services-right-arrow" id={item.Title+"Item"} onClick={()=> reactHandler.ExpandTeamMember(item.Title,Name)}>
                        <a href="#">
                            <img src="https://remodigital.sharepoint.com/sites/ClientPOC/SiteAssets/Remo%20Portal%20Assets/img/arrow_down.svg" className="transition" alt="image"></img>
                        </a>
                    </span> */}
                    <div className="Team-Child-Div" id={item.Title} style={{display:"none"}}>
                        <ul>
                            {AllSubNodeEmpDetails.map((item) => (                                                            
                                <li className="clearfix relative">
                                    <div className="team-meb-list-img">
                                        <img src={item.UserPicture}/>
                                    </div>
                                    <div className="team-meb-list-desc">
                                        <h3> {item.Name} </h3>
                                        <p> {item.Email} </p>
                                    </div>
                                    <div className="teams-med-graph box">
                                        <CircularProgressbar
                                            value={item.LeaveBalance}
                                            text={item.LeaveBalance}
                                            maxValue={60}                          
                                            styles={buildStyles({                                                        
                                                rotation: 0,
                                                strokeLinecap: 'butt',
                                                textSize: '22px',                            
                                                pathTransitionDuration: 0.5,
                                                pathColor: `${item.LeaveBalance < 20 ? '#f46d65':"#f9ae65"}`, //Red #f46d65 {reactHandler.state.IsAdminForContentEditor == true ? "remo-class active show-content-editor" : "remo-class active"}
                                                textColor: '#333333',
                                                trailColor: '#d6d6d6',
                                                backgroundColor: '#3e98c7',
                                            })}
                                        />                                      
                                    </div>                                                                                                   
                                </li>                                  
                            ))}
                        </ul>
                    </div>              
            </li>
        );   
        }  
        if(item.Annual_Leave_Balance >= 20 && item.Annual_Leave_Balance < 40){     
            return (
                <li className="clearfix relative pareb">
                    <div className="team-meb-list-img">
                        <img src={item.UserProfileUrl.Url}/>
                    </div>
                    <div className="team-meb-list-desc">
                        <h3> {Name} </h3>
                        <p> {item.Email} </p>
                    </div>
                    <div className="teams-med-graph box">
                        <CircularProgressbar
                            value={item.Annual_Leave_Balance}
                            text={item.Annual_Leave_Balance}
                            maxValue={60}                          
                            styles={buildStyles({                            
                                rotation: 0,
                                strokeLinecap: 'butt',
                                textSize: '22px',                            
                                pathTransitionDuration: 0.5,
                                pathColor: `#f9ae65`, //Yellow
                                textColor: '#333333',
                                trailColor: '#d6d6d6',
                                backgroundColor: '#3e98c7',
                            })}
                        />                          
                    </div>
                    <a href="#" onClick={()=> reactHandler.ExpandTeamMember(item.Title,Name)} className="expand-myteam-leave">
                        <span className="services-right-arrow" id={item.Title+"Item"}>                        
                            <img src="https://remodigital.sharepoint.com/sites/ClientPOC/SiteAssets/Remo%20Portal%20Assets/img/arrow_down.svg" className="transition" alt="image"></img>                        
                        </span>
                    </a>
                    {/*<span className="services-right-arrow"  id={item.Title+"Item"}> 
                        <a href="#" onClick={()=> reactHandler.ExpandTeamMember(item.Title,Name)}>
                            <img src="https://remodigital.sharepoint.com/sites/ClientPOC/SiteAssets/Remo%20Portal%20Assets/img/arrow_down.svg" className="transition" alt="image"></img>
                        </a>
                    </span>*/}
                    <div className="Team-Child-Div" id={item.Title} style={{display:"none"}}>
                        <ul>
                            {AllSubNodeEmpDetails.map((item) => (                            
                                <li className="clearfix relative">
                                    <div className="team-meb-list-img">
                                        <img src={item.UserPicture}/>
                                    </div>
                                    <div className="team-meb-list-desc">
                                        <h3> {item.Name} </h3>
                                        <p> {item.Email} </p>
                                    </div>
                                    <div className="teams-med-graph box">
                                        <CircularProgressbar
                                            value={item.LeaveBalance}
                                            text={item.LeaveBalance}
                                            maxValue={60}                          
                                            styles={buildStyles({                                                        
                                                rotation: 0,
                                                strokeLinecap: 'butt',
                                                textSize: '22px',                            
                                                pathTransitionDuration: 0.5,
                                                pathColor: `${item.LeaveBalance < 20 ? '#f46d65':"#f9ae65"}`,//`#f46d65`, //Red
                                                textColor: '#333333',
                                                trailColor: '#d6d6d6',
                                                backgroundColor: '#3e98c7',
                                            })}
                                        />                                      
                                    </div>                                                                                                   
                                </li>                                  
                            ))}
                        </ul>
                    </div>
                </li>
            );   
            }
            if(item.Annual_Leave_Balance >= 40){     
                return (
                    <li className="clearfix relative pareb">
                        <div className="team-meb-list-img">
                            <img src={item.UserProfileUrl.Url}/>
                        </div>
                        <div className="team-meb-list-desc">
                            <h3> {Name} </h3>
                            <p> {item.Email} </p>
                        </div>
                        <div className="teams-med-graph box">
                            <CircularProgressbar
                                value={item.Annual_Leave_Balance}
                                text={item.Annual_Leave_Balance}
                                maxValue={60}                          
                                styles={buildStyles({                            
                                    rotation: 0,
                                    strokeLinecap: 'butt',
                                    textSize: '22px',                            
                                    pathTransitionDuration: 0.5,
                                    pathColor: `#64c2a6`, //Green
                                    textColor: '#333333',
                                    trailColor: '#d6d6d6',
                                    backgroundColor: '#3e98c7',
                                })}
                            />                             
                        </div>

                        <a href="#" onClick={()=> reactHandler.ExpandTeamMember(item.Title,Name)} className="expand-myteam-leave">
                        <span className="services-right-arrow" id={item.Title+"Item"}>                        
                            <img src="https://remodigital.sharepoint.com/sites/ClientPOC/SiteAssets/Remo%20Portal%20Assets/img/arrow_down.svg" className="transition" alt="image"></img>                        
                        </span>
                    </a>
                    
                        {/*<span className="services-right-arrow team-mem-stle" id={item.Title+"Item"}> 
                            <a href="#" onClick={()=> reactHandler.ExpandTeamMember(item.Title,Name)}>
                                <img src="https://remodigital.sharepoint.com/sites/ClientPOC/SiteAssets/Remo%20Portal%20Assets/img/arrow_down.svg" className="transition" alt="image"></img>
                            </a>
                        </span>*/}
                        <div className="Team-Child-Div" id={item.Title} style={{display:"none"}}>
                            <ul>
                                {AllSubNodeEmpDetails.map((item) => (                            
                                    <li className="clearfix relative">
                                        <div className="team-meb-list-img">
                                            <img src={item.UserPicture}/>
                                        </div>
                                        <div className="team-meb-list-desc">
                                            <h3> {item.Name} </h3>
                                            <p> {item.Email} </p>
                                        </div>
                                        <div className="teams-med-graph box">
                                            <CircularProgressbar
                                                value={item.LeaveBalance}
                                                text={item.LeaveBalance}
                                                maxValue={60}                          
                                                styles={buildStyles({                                                        
                                                    rotation: 0,
                                                    strokeLinecap: 'butt',
                                                    textSize: '22px',                            
                                                    pathTransitionDuration: 0.5,
                                                    pathColor: `${item.LeaveBalance < 20 ? '#f46d65':"#f9ae65"}`,//`#f46d65`, //Red
                                                    textColor: '#333333',
                                                    trailColor: '#d6d6d6',
                                                    backgroundColor: '#3e98c7',
                                                })}
                                            />                                      
                                        </div>                                                                                                   
                                    </li>                                  
                                ))}
                            </ul>
                        </div>
                    </li>
                );   
                }   
        });

    return (
      <div className={ [styles.remoMyTeam , "m-b-20 my-team-wrap"].join(' ')}>   
        <section>
          <div className="relative">
              <div className="inner-page-contents">
                <div className="taqeef-doc-details ">                                     
                  <div className="team-member-leave-wrap-right">
                    <div className="sec if-team-present" style={{display:"none"}}>
                      <div className = "refresh-wrap clearfix">
                        <div className="heading" style={{float:"left"}}>
                          Team Members leave balance
                        </div>
                        <div className="refresh-people" style={{float:"right"}}>
                          <a href="#" title="Refresh"><i className="fa fa-refresh" aria-hidden="true" onClick={()=>reactHandler.GetCurrentUserName()}></i></a>
                        </div>
                      </div>                            
                      <div className="section-part">
                        <ul>
                          {MyTeams}
                        </ul>
                      </div>
                    </div>
                    <div className="sec if-sub-team-present" style={{display:"none"}}>
                      <div className = "refresh-wrap clearfix">
                        <div className="heading" style={{float:"left"}}>
                          Team Members leave balance
                        </div>
                        <div className="refresh-people" style={{float:"right"}}>
                          <a href="#" title="Refresh"><i className="fa fa-refresh" aria-hidden="true" onClick={()=>reactHandler.GetCurrentUserName()}></i></a>
                        </div>
                      </div>                           
                      <div className="section-part">
                        <ul id="if-team-available">
                                    
                        </ul>
                        <ul id="if-team-not-available" style={{display:"none"}}>
                          <li>
                            <p>You don't have team !</p>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="sec if-no-team">
                      <div className = "refresh-wrap clearfix">
                        <div className="heading" style={{float:"left"}}>
                          Team Members leave balance
                        </div>
                        <div className="refresh-people" style={{float:"right"}}>
                          <a href="#" title="Refresh"><i className="fa fa-refresh" aria-hidden="true" onClick={()=>reactHandler.GetCurrentUserName()}></i></a>
                        </div>
                      </div>
                      <div className="section-part">
                        <ul>
                          <li>
                            <p>You don't have team !</p>
                          </li>
                        </ul>
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

