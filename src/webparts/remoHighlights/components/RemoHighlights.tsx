import * as React from 'react';
import styles from './RemoHighlights.module.scss';
import { IRemoHighlightsProps } from './IRemoHighlightsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as $ from 'jquery';
import * as moment from 'moment';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import Slider from "react-slick";
import { SPComponentLoader } from '@microsoft/sp-loader';
import ReactTooltip from "react-tooltip";


SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.css");
SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.css");

SPComponentLoader.loadScript("https://code.jquery.com/jquery-2.2.0.min.js");
SPComponentLoader.loadScript("https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js");
SPComponentLoader.loadScript("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js");

export interface IRemoHighlightsState{
  Items:any[];
  TodayEvents:any[];
  Anniversary:any[];
  UpcomingEvents:any[];

  FirstBdayDate:any;
  FirstAnivDate:any;
  LastBdayDate:any;
  LastAnivDate:any;

  TotalHighlights:number;
}

export default class RemoHighlights extends React.Component<IRemoHighlightsProps, IRemoHighlightsState,{}> {
  constructor(props: IRemoHighlightsProps, state: IRemoHighlightsState) {    
    super(props); 
    this.state = {    
      Items: [] ,
      TodayEvents:[],
      Anniversary:[],
      UpcomingEvents:[],  
      FirstBdayDate:"",
      FirstAnivDate:"",
      LastBdayDate:"",
      LastAnivDate:"",
      TotalHighlights:0
    };         
  }

  public componentDidMount(){      
    this._get_emp_spotlightdata(); 
    this._get_upcoming_spotlightdata();    
  }   

  public _get_emp_spotlightdata(){
    var reactHandler = this;
    var tdaydate = moment().format('MM/DD');   
    var tdaydateAniv = moment().format('MM/DD');     
    var filterString = `Expires ge '${tdaydate}'`;
    $.ajax({  
        url: `${this.props.siteurl}/_api/web/lists/getbytitle('Highlights')/items?$select=Title,DOJ,DOB,Picture,Designation,Name&$top=1000
        &$orderby=DOB asc&$filter=IsActive eq 1 and substringof('${tdaydateAniv}',DOJ) or substringof('${tdaydate}',DOB)`,  
        type: "GET",  
        headers:{'Accept': 'application/json; odata=verbose;'},  
        success: function(resultData) {            
            if(resultData.d.results.length != 0){
                $("#today-bday").show();
                reactHandler.setState({  
                    TodayEvents:resultData.d.results,
                    TotalHighlights: resultData.d.results.length
                }); 

            }else{
                $("#today-bday").hide();
                $("#upcoming-bday").show();
            }                         
        },  
        error : function(jqXHR, textStatus, errorThrown) {  
        }  
    });
  }

  public _get_upcoming_spotlightdata(){
    var reactHandler = this;
    var tdaydate = moment().format('MM/DD');   
    var tdaydateAniv = moment().format('MM/DD');

    var FutureDate1 = moment().add(1, "days").format('MM/DD'); 
    var FutureDate2 = moment().add(2, "days").format('MM/DD');
    var FutureDate3 = moment().add(3, "days").format('MM/DD');    

    var FutureDateAnniv1 = moment().add(1, "days").format('MM/DD'); 
    var FutureDateAnniv2 = moment().add(2, "days").format('MM/DD');
    var FutureDateAnniv3 = moment().add(3, "days").format('MM/DD');
   
    reactHandler.setState({
        FirstBdayDate:moment(FutureDate1, 'MM/DD'),
        FirstAnivDate:moment(FutureDateAnniv1, 'MM/DD'),
        LastBdayDate:moment(FutureDate3, 'MM/DD'),
        LastAnivDate:moment(FutureDateAnniv3, 'MM/DD')
    });
    
    $.ajax({  
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Highlights')/items?$select=Title,DOJ,DOB,Picture,Designation,Name&$top=1000
      &$orderby=DOB asc&$filter=IsActive eq 1 and substringof('${FutureDateAnniv1}',DOJ) or substringof('${FutureDateAnniv2}',DOJ) or substringof('${FutureDateAnniv3}',DOJ) or substringof('${FutureDate1}',DOB) or substringof('${FutureDate2}',DOB) or substringof('${FutureDate3}',DOB)`,
        
        type: "GET",  
        headers:{'Accept': 'application/json; odata=verbose;'},  
        success: function(resultData) { 
            reactHandler.setState({  
                UpcomingEvents:resultData.d.results,
                TotalHighlights: reactHandler.state.TotalHighlights+resultData.d.results.length
            });  
            reactHandler.checkHighlightsAvailability();                      
        },  
        error : function(jqXHR, textStatus, errorThrown) {  
        }  
    });
  }

  public checkHighlightsAvailability(){
    if(this.state.TotalHighlights == 0){
      $("#if-highlights-present").hide();
      $("#if-no-highlights-present").show();
    }else{
      $("#if-highlights-present").show();
      $("#if-no-highlights-present").hide();
    }
  }

  public render(): React.ReactElement<IRemoHighlightsProps> {
    var reactHandler = this;
    const settings = {
      dots: false,
      arrows: false,
      infinite: true,
      speed: 1500,
      autoplaySpeed: 3000,
      autoplay: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      fade:true
    };
    const TodayBirthday: JSX.Element[] = this.state.TodayEvents.map(function(item,key) {        
        var Name ="";
        let Tday1Bday = moment().format("MM/DD");
        let Tday2Anniv = moment().format("MM/DD");
        let RawImageTxt = item.Picture;
        let Bdaydate = moment(item.DOB,"MM-DD-YYYY").format("MM/DD");   
        let AnivDate = moment(item.DOJ,"MM-DD-YYYY").format("MM/DD");
        if(item.Name != ""){ 
            
            if(Tday1Bday == Bdaydate) {    
              Name = item.Name    
              if(RawImageTxt != "" && RawImageTxt != null){
                var ImgObj = JSON.parse(RawImageTxt);        
                return (          
                    <div className="sec">
                        <div className="heading" id="spotlight-title" title="Birthday">
                            <a href="#" style={{cursor:"default"}}>
                               <span id="highlights-type"> Birthday</span>
                            </a>
                        </div>
                        <div className="section-part clearfix">
                            <div className="birthday-image relative">
                                <img src={`${ImgObj.serverRelativeUrl}`} alt="image"/>
                                <div className="birday-icons">
                                <img src={`${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/birthday.svg`} alt="image"/>
                                </div>
                            </div>
                            <div className="birthday-details">
                                <h4 data-tip data-for={"React-tooltip-title-today-"+key+""} data-custom-class="tooltip-custom"> {Name} </h4>
                                {/*<ReactTooltip id={"React-tooltip-title-today-"+key+""} place="top" type="dark" effect="solid">
                                  <span>{Name}</span>
                                </ReactTooltip>*/}
                                <p data-tip data-for={"React-tooltip-Desig-today-"+key+""} data-custom-class="tooltip-custom"> {item.Designation}  </p> 
                                {/*<ReactTooltip id={"React-tooltip-Desig-today-"+key+""} place="top" type="dark" effect="solid">
                                  <span>{item.Designation}</span>
                                </ReactTooltip>*/}
                            </div>
                        </div>    
                    </div>                    
                );
              }
            }
            else if(Tday2Anniv == AnivDate){
                let TotalYr = moment().diff(`${item.DOJ}`, 'years'); 
                Name = item.Name;  
                if(TotalYr == 1){ 
                  if(RawImageTxt != "" && RawImageTxt != null){
                    var ImgObj = JSON.parse(RawImageTxt);
                return (          
                    <div className="sec">
                        <div className="heading" id="spotlight-title" title={TotalYr+"st Anniversary"}>
                            <a href="#" style={{cursor:"default"}}>
                              <span id="highlights-type"> {TotalYr}st Anniversary </span>
                            </a>
                        </div>
                        <div className="section-part clearfix">
                            <div className="birthday-image relative">
                                <img src={`${ImgObj.serverRelativeUrl}`} alt="image"/>
                                <div className="birday-icons">
                                <img src={`${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/birthday.svg`} alt="image"/>
                                </div>
                            </div>
                            <div className="birthday-details">
                            <h4 data-tip data-for={"React-tooltip-title-today-"+key+""} data-custom-class="tooltip-custom"> {Name} </h4>
                                {/*<ReactTooltip id={"React-tooltip-title-today-"+key+""} place="top" type="dark" effect="solid">
                                  <span>{Name}</span>
                                </ReactTooltip>*/}
                                <p data-tip data-for={"React-tooltip-Desig-today-"+key+""} data-custom-class="tooltip-custom"> {item.Designation}  </p> 
                                {/*<ReactTooltip id={"React-tooltip-Desig-today-"+key+""} place="top" type="dark" effect="solid">
                                  <span>{item.Designation}</span>
                              </ReactTooltip> */}
                            </div>
                        </div>    
                    </div>
                );
                  }
                }
                else if(TotalYr == 2){ 
                  if(RawImageTxt != "" && RawImageTxt != null){
                    var ImgObj = JSON.parse(RawImageTxt);
                    return (          
                        <div className="sec">
                            <div className="heading" id="spotlight-title" title={TotalYr+"nd Anniversary"}>
                                <a href="#" style={{cursor:"default"}}>
                                  <span id="highlights-type"> {TotalYr}nd Anniversary </span>
                                </a>
                            </div>
                            <div className="section-part clearfix">
                                <div className="birthday-image relative">
                                    <img src={`${ImgObj.serverRelativeUrl}`} alt="image"/>
                                    <div className="birday-icons">
                                    <img src={`${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/birthday.svg`} alt="image"/>
                                    </div>
                                </div>
                                <div className="birthday-details">
                            <h4 data-tip data-for={"React-tooltip-title-today-"+key+""} data-custom-class="tooltip-custom"> {Name} </h4>
                                {/*<ReactTooltip id={"React-tooltip-title-today-"+key+""} place="top" type="dark" effect="solid">
                                  <span>{Name}</span>
                                </ReactTooltip>*/}
                                <p data-tip data-for={"React-tooltip-Desig-today-"+key+""} data-custom-class="tooltip-custom"> {item.Designation}  </p> 
                                {/*<ReactTooltip id={"React-tooltip-Desig-today-"+key+""} place="top" type="dark" effect="solid">
                                  <span>{item.Designation}</span>
                              </ReactTooltip> */}
                            </div>
                            </div>    
                        </div>
                    );
                  }
                    }
                    else if(TotalYr == 3){ 
                      if(RawImageTxt != "" && RawImageTxt != null){
                        var ImgObj = JSON.parse(RawImageTxt);
                        return (          
                            <div className="sec">
                                <div className="heading" id="spotlight-title" title={TotalYr+"rd Anniversary"}>
                                    <a href="#" style={{cursor:"default"}}>
                                     <span id="highlights-type"> {TotalYr}rd Anniversary </span>
                                    </a>
                                </div>
                                <div className="section-part clearfix">
                                    <div className="birthday-image relative">
                                        <img src={`${ImgObj.serverRelativeUrl}`} alt="image"/>
                                        <div className="birday-icons">
                                        <img src={`${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/birthday.svg`} alt="image"/>
                                        </div>
                                    </div>
                                    <div className="birthday-details">
                            <h4 data-tip data-for={"React-tooltip-title-today-"+key+""} data-custom-class="tooltip-custom"> {Name} </h4>
                                {/*<ReactTooltip id={"React-tooltip-title-today-"+key+""} place="top" type="dark" effect="solid">
                                  <span>{Name}</span>
                                </ReactTooltip>*/}
                                <p data-tip data-for={"React-tooltip-Desig-today-"+key+""} data-custom-class="tooltip-custom"> {item.Designation}  </p> 
                                {/*<ReactTooltip id={"React-tooltip-Desig-today-"+key+""} place="top" type="dark" effect="solid">
                                  <span>{item.Designation}</span>
                              </ReactTooltip> */}
                            </div>
                                </div>    
                            </div>
                        );
                      }
                        }
                        else if(TotalYr > 3){ 
                          if(RawImageTxt != "" && RawImageTxt != null){
                            var ImgObj = JSON.parse(RawImageTxt);
                            return (          
                                <div className="sec">
                                    <div className="heading" id="spotlight-title" title={TotalYr+"th Anniversary"}>
                                        <a href="#" style={{cursor:"default"}}>
                                          <span id="highlights-type"> {TotalYr}th Anniversary </span>
                                        </a>
                                    </div>
                                    <div className="section-part clearfix">
                                        <div className="birthday-image relative">
                                            <img src={`${ImgObj.serverRelativeUrl}`} alt="image"/>
                                            <div className="birday-icons">
                                            <img src={`${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/birthday.svg`} alt="image"/>
                                            </div>
                                        </div>
                                        <div className="birthday-details">
                            <h4 data-tip data-for={"React-tooltip-title-today-"+key+""} data-custom-class="tooltip-custom"> {Name} </h4>
                                {/*<ReactTooltip id={"React-tooltip-title-today-"+key+""} place="top" type="dark" effect="solid">
                                  <span>{Name}</span>
                                </ReactTooltip>*/}
                                <p data-tip data-for={"React-tooltip-Desig-today-"+key+""} data-custom-class="tooltip-custom"> {item.Designation}  </p> 
                                {/*<ReactTooltip id={"React-tooltip-Desig-today-"+key+""} place="top" type="dark" effect="solid">
                                  <span>{item.Designation}</span>
                              </ReactTooltip> */}
                            </div>
                                    </div>    
                                </div>
                            );
                          }
                            }
            }
        }else{
            
        }
    });

    const UpcomingBirthday: JSX.Element[] = this.state.UpcomingEvents.map(function(item,key) { 
        var Name ="";
        var BdayDt = moment(item.DOB,"MM-DD-YYYY").format("DD MMM");
        var AnvDt = moment(item.DOJ,"MM-DD-YYYY").format("DD MMM");
        
        let Tday1Bday = moment().format("MM/DD");
        let Tday2Anniv = moment().format("MM/DD");
        let RawImageTxt = item.Picture;
        let Bdaydate = moment(item.DOB,"MM-DD-YYYY").format("MM/DD");   
        let AnivDate = moment(item.DOJ,"MM-DD-YYYY").format("MM/DD");
        if(item.Name != ""){      
            
            if(Bdaydate > Tday1Bday && moment(Bdaydate,'MM/DD')<= moment(reactHandler.state.LastBdayDate,'MM/DD') && moment(Bdaydate,'MM/DD') >= moment(reactHandler.state.FirstBdayDate,'MM/DD')){           //&& Bdaydate <= moment(reactHandler.state.LastBdayDate,"MM/DD").format("MM/DD")     
              Name = item.Name;
              if(RawImageTxt != "" && RawImageTxt != null){
                var ImgObj = JSON.parse(RawImageTxt);
                return (          
                    <div className="sec">
                        <div className="heading" id="spotlight-title">
                            <a href="#" style={{cursor:"default"}}>
                              <span id="highlights-type" className="clearfix"> Upcoming Birthday </span>
                               <span className="bday-date-cls" title={BdayDt}>{BdayDt}</span>
                            </a>
                        </div>
                        <div className="section-part clearfix">
                            <div className="birthday-image relative">
                                <img src={`${ImgObj.serverRelativeUrl}`} alt="image"/>
                                <div className="birday-icons">
                                <img src={`${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/birthday.svg`} alt="image"/>
                                </div>
                            </div>
                            <div className="birthday-details">
                            <h4 data-tip data-for={"React-tooltip-title-today-"+key+""} data-custom-class="tooltip-custom"> {Name} </h4>
                                {/*<ReactTooltip id={"React-tooltip-title-today-"+key+""} place="top" type="dark" effect="solid">
                                  <span>{Name}</span>
                                </ReactTooltip>*/}
                                <p data-tip data-for={"React-tooltip-Desig-today-"+key+""} data-custom-class="tooltip-custom"> {item.Designation}  </p> 
                                {/*<ReactTooltip id={"React-tooltip-Desig-today-"+key+""} place="top" type="dark" effect="solid">
                                  <span>{item.Designation}</span>
                              </ReactTooltip> */}
                            </div>
                        </div>    
                    </div>
                );
              }
            }
            else if(AnivDate > Tday2Anniv && moment(AnivDate,'MM/DD')<= moment(reactHandler.state.LastAnivDate,'MM/DD') && moment(AnivDate,'MM/DD') >= moment(reactHandler.state.FirstAnivDate,'MM/DD')){// && AnivDate <= moment(reactHandler.state.LastAnivDate, "MM/DD").format("MM/DD")
                let TotalYr = moment().diff(`${item.DOJ}`, 'years');  
                Name = item.Name;
                if(TotalYr == 1){  
                  if(RawImageTxt != "" && RawImageTxt != null){
                    var ImgObj = JSON.parse(RawImageTxt);            
                    return (          
                        <div className="sec">
                            <div className="heading" id="spotlight-title" title={"Upcoming "+TotalYr+"st Anniversary"}>
                                <a href="#" style={{cursor:"default"}}>
                                     <span id="highlights-type" className="clearfix"> Upcoming {TotalYr}st Anniversary  </span>
                                    <span className="bday-date-cls">{AnvDt}</span>
                                </a>
                            </div>
                            <div className="section-part clearfix">
                                <div className="birthday-image relative">
                                    <img src={`${ImgObj.serverRelativeUrl}`} alt="image"/>
                                    <div className="birday-icons">
                                    <img src={`${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/birthday.svg`} alt="image"/>
                                    </div>
                                </div>
                                <div className="birthday-details">
                            <h4 data-tip data-for={"React-tooltip-title-today-"+key+""} data-custom-class="tooltip-custom"> {Name} </h4>
                                {/*<ReactTooltip id={"React-tooltip-title-today-"+key+""} place="top" type="dark" effect="solid">
                                  <span>{Name}</span>
                                </ReactTooltip>*/}
                                <p data-tip data-for={"React-tooltip-Desig-today-"+key+""} data-custom-class="tooltip-custom"> {item.Designation}  </p> 
                                {/*<ReactTooltip id={"React-tooltip-Desig-today-"+key+""} place="top" type="dark" effect="solid">
                                  <span>{item.Designation}</span>
                              </ReactTooltip> */}
                            </div>
                            </div>    
                        </div>
                    );
                  }
                }
                else if(TotalYr == 2){  
                  if(RawImageTxt != "" && RawImageTxt != null){
                    var ImgObj = JSON.parse(RawImageTxt);            
                    return (          
                        <div className="sec">
                            <div className="heading" id="spotlight-title" title={"Upcoming "+TotalYr+"nd Anniversary"}>
                                <a href="#" style={{cursor:"default"}}>
                                     <span id="highlights-type" className="clearfix"> Upcoming {TotalYr}nd Anniversary  </span>
                                    <span className="bday-date-cls">{AnvDt}</span>
                                </a>
                            </div>
                            <div className="section-part clearfix">
                                <div className="birthday-image relative">
                                    <img src={`${ImgObj.serverRelativeUrl}`} alt="image"/>
                                    <div className="birday-icons">
                                    <img src={`${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/birthday.svg`} alt="image"/>
                                    </div>
                                </div>
                                <div className="birthday-details">
                            <h4 data-tip data-for={"React-tooltip-title-today-"+key+""} data-custom-class="tooltip-custom"> {Name} </h4>
                                {/*<ReactTooltip id={"React-tooltip-title-today-"+key+""} place="top" type="dark" effect="solid">
                                  <span>{Name}</span>
                                </ReactTooltip>*/}
                                <p data-tip data-for={"React-tooltip-Desig-today-"+key+""} data-custom-class="tooltip-custom"> {item.Designation}  </p> 
                                {/*<ReactTooltip id={"React-tooltip-Desig-today-"+key+""} place="top" type="dark" effect="solid">
                                  <span>{item.Designation}</span>
                              </ReactTooltip> */}
                            </div>
                            </div>    
                        </div>
                    );
                  }
                }
                else if(TotalYr == 3){     
                  if(RawImageTxt != "" && RawImageTxt != null){
                    var ImgObj = JSON.parse(RawImageTxt);         
                    return (          
                        <div className="sec">
                            <div className="heading" id="spotlight-title" title={"Upcoming "+TotalYr+"rd Anniversary"}>
                                <a href="#" style={{cursor:"default"}}>
                                     <span id="highlights-type" className="clearfix"> Upcoming {TotalYr}rd Anniversary  </span>
                                    <span className="bday-date-cls">{AnvDt}</span>
                                </a>
                            </div>
                            <div className="section-part clearfix">
                                <div className="birthday-image relative">
                                    <img src={`${ImgObj.serverRelativeUrl}`} alt="image"/>
                                    <div className="birday-icons">
                                    <img src={`${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/birthday.svg`} alt="image"/>
                                    </div>
                                </div>
                                <div className="birthday-details">
                            <h4 data-tip data-for={"React-tooltip-title-today-"+key+""} data-custom-class="tooltip-custom"> {Name} </h4>
                                {/*<ReactTooltip id={"React-tooltip-title-today-"+key+""} place="top" type="dark" effect="solid">
                                  <span>{Name}</span>
                                </ReactTooltip>*/}
                                <p data-tip data-for={"React-tooltip-Desig-today-"+key+""} data-custom-class="tooltip-custom"> {item.Designation}  </p> 
                                {/*<ReactTooltip id={"React-tooltip-Desig-today-"+key+""} place="top" type="dark" effect="solid">
                                  <span>{item.Designation}</span>
                              </ReactTooltip> */}
                            </div>
                            </div>    
                        </div>
                    );
                  }
                }
                else if(TotalYr > 3){  
                  if(RawImageTxt != "" && RawImageTxt != null){
                    var ImgObj = JSON.parse(RawImageTxt);            
                    return (          
                        <div className="sec">
                            <div className="heading" id="spotlight-title" title={"Upcoming "+TotalYr+"th Anniversary"}>
                                <a href="#" style={{cursor:"default"}}>
                                     <span id="highlights-type" className="clearfix"> Upcoming {TotalYr}th Anniversary </span>
                                    <span className="bday-date-cls">{AnvDt}</span>
                                </a>
                            </div>
                            <div className="section-part clearfix">
                                <div className="birthday-image relative">
                                    <img src={`${ImgObj.serverRelativeUrl}`} alt="image"/>
                                    <div className="birday-icons">
                                    <img src={`${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/birthday.svg`} alt="image"/>
                                    </div>
                                </div>
                                <div className="birthday-details">
                            <h4 data-tip data-for={"React-tooltip-title-today-"+key+""} data-custom-class="tooltip-custom"> {Name} </h4>
                                {/*<ReactTooltip id={"React-tooltip-title-today-"+key+""} place="top" type="dark" effect="solid">
                                  <span>{Name}</span>
                                </ReactTooltip>*/}
                                <p data-tip data-for={"React-tooltip-Desig-today-"+key+""} data-custom-class="tooltip-custom"> {item.Designation}  </p> 
                                {/*<ReactTooltip id={"React-tooltip-Desig-today-"+key+""} place="top" type="dark" effect="solid">
                                  <span>{item.Designation}</span>
                              </ReactTooltip> */}
                            </div>
                            </div>    
                        </div>
                    );
                  }
                }
            }  
        }else{
            
        }      
      });
    return (
      <div className={ styles.remoHighlights } id="bday-highlights">
        <div className="birthday-wrap m-b-20" id="if-highlights-present">
          <div id="today-bday" style={{display:"none"}}>
            <Slider {...settings} id="SliderItemsBday">
              {TodayBirthday}
              {UpcomingBirthday}
            </Slider>
          </div>   
          <div id="upcoming-bday" style={{display:"none"}}>
              <Slider {...settings} id="SliderItemsBday">
                {UpcomingBirthday}
              </Slider>
          </div>
        </div>

        <div className="birthday-wrap m-b-20" id="if-no-highlights-present" style={{display:"none"}}>
        <div className="sec" style={{height:"142px"}}>
                            <div className="heading" id="spotlight-title">
                                <a href="#" style={{cursor:"default"}}>
                                     <span id="highlights-type" className="clearfix"> Highlights  </span>                                    
                                </a>
                            </div>
                            <div className="section-part clearfix">
                                <div className="birthday-image relative">
                                    
                                </div>
                                <div className="birthday-details">  
                                    <h4></h4>                                  
                                    <p className="text-center"> No Highlights at this moment.  </p> 
                                </div>
                            </div>    
                        </div>
        </div>
      </div>
    );
  }
}
