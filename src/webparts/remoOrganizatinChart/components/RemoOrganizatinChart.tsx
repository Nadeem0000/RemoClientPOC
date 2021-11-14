import * as React from 'react';
import styles from './RemoOrganizatinChart.module.scss';
import { IRemoOrganizatinChartProps } from './IRemoOrganizatinChartProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as $ from 'jquery';
import { SPComponentLoader } from '@microsoft/sp-loader';
declare var OrgChart:any;
var chart:any;
var Nodevals;
export interface IRemoOrganizatinChartState{  
    template:string;
}
export default class RemoOrganizatinChart extends React.Component<IRemoOrganizatinChartProps, IRemoOrganizatinChartState, {}> {
  public constructor(props: IRemoOrganizatinChartProps, state: IRemoOrganizatinChartState){  
    super(props); 
    SPComponentLoader.loadCss(`${this.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/css/OrgChartStyle.css`);
    this.state = {               
        template: "ula"          
    };         
  }
  public componentDidMount () {
    $('#spCommandBar').attr('style', 'display: none !important');
    $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
    this.GetGraphDatafromList();
    this.savedata();      
  }

  public GetGraphDatafromList(){
    
    var reactHandler = this;
    var manager:any;
    var managername:any;
    var Manager_name;
    var jsonObj = [];
    $.ajax({        
        url: `${reactHandler.props.siteurl}/_api/web/lists/getbytitle('OrgChart Master')/items?$top=1000&$select=ID,Title,Name,Email,Designation,Manager_code,Manager_name,Employee_status,UserProfileUrl&$filter=Employee_status eq 'Active'`,
        type: "GET",
        headers: {
            "Accept": "application/json;odata=verbose",
        },
        success: function (data) {
            if(data.d.results.length>0){
                $.each(data.d.results,function(i,employee){
                    
                var Name = employee.Name;                    
                var Employee_code = employee.Title;
                var Employee_Name = Name;
                var Employee_Desgination =employee.Designation;
                var ProfilePicture = employee.UserProfileUrl.Url;                

                if(employee.Manager_code!= 'undefined' && employee.Manager_code!= null){
                   var  Manager_code = employee.Manager_code;
                   Manager_name = employee.Manager_name;
                }
                else{
                    manager = "0";
                    Manager_name = "None";
                }          
               
                var item = {};
                    item ["id"] = Employee_code;
                    item ["pid"] = Manager_code;
                    item ["Name"] = Employee_Name;
                    item ["Designation"] = Employee_Desgination;
                    item ["Manager Name"] = Manager_name;
                    item[ "Picture"] = ProfilePicture ;
                        jsonObj.push(item);
                });                     
                var jsonString = JSON.stringify(jsonObj);                    
                Nodevals = JSON.parse(jsonString);
                
                reactHandler.GenerateChart(Nodevals);
            }
        },
        error: function (data) {

        }
    });
}


public GenerateChart(Nodevals){ 
    var reacthandler = this;
    var my_script = this.new_script(`${this.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/External/MasterOrganizationChart.js`);                 
    my_script.then(()=> {
        chart = new OrgChart(document.getElementById("OrgChart"), {
            template: `${this.state.template}`,
            showXScroll: OrgChart.scroll.visible,
            layout: OrgChart.mixed,
            mouseScrool: OrgChart.action.none,   
            //scaleInitial: OrgChart.match.width,                  
            scaleInitial: 0.8,
        zoom: {
            speed: 30,
            smooth: 10
        },
        toolbar: {
            zoom: true,
            fullScreen: true                
        },
        collapse: {
            level: 2,
            allChildren: true
        },

            nodeBinding: {
                field_0: "Name",
                field_1: "Designation",
                img_0: "Picture",
            },
            nodes: Nodevals                
            });

            

  chart.on('expcollclick', function (sender, isCollpasing, id, ids) {
    

    if (!isCollpasing){
  var collapseIds = [];
  var clickedNode = chart.getNode(id);	

  var ln = clickedNode.leftNeighbor;
  while(ln){
    for (var i = 0; i < ln.childrenIds.length; i++){
      collapseIds.push(ln.childrenIds[i]);
    }
    ln = ln.leftNeighbor;
  }

  var rn = clickedNode.rightNeighbor;
  while(rn){
    for (var i = 0; i < rn.childrenIds.length; i++){
      collapseIds.push(rn.childrenIds[i]);
    }
    rn = rn.rightNeighbor;
  }
  chart.collapse(id, collapseIds);

  chart.collapse(id, collapseIds, function(){
      chart.expand(id, clickedNode .childrenIds);
  });
  return false;
}
});

            chart.editUI.on('field', function(sender, args){
                if (args.type == 'edit' && args.name == 'Manager'){
                    var txt = args.field.querySelector('input');
                    var txtVal = txt.value;

                    if (txt){
                        txt.style.color = "red";                              
                        var select = document.createElement('select');
                        select.className = 'dynamicManagersDDL';
                        
                        var manager:any;
                        var managername:any;
                        $.ajax({
                            url: `https://taqeef.sharepoint.com/sites/intranet/_api/web/lists/getbytitle('OrgChart Master')/items?$select=ID,Title,Manager/Id,Manager/Title,Designation,Attachments,AttachmentFiles&$expand=Manager/Id,AttachmentFiles`,
                            type: "GET",
                            headers: {
                                "Accept": "application/json;odata=verbose",
                            },
                            success: function (data) {
                                if(data.d.results.length>0){
                                    $.each(data.d.results,function(i,employee){
                                        if(employee.Manager.Id!= 'undefined' && employee.Manager.Id!= null){
                                            manager = employee.Manager.Id;
                                            managername = employee.Manager.Title;
                                        }
                                        else{
                                            manager = "0";
                                            managername = " ";
                                        }              

                                        //Bind DDL for Edit Form
                                        if(employee.Manager.Title != undefined){
                                            $(".dynamicManagersDDL").append(`<option value=${manager} title=${managername}>${managername}</option>`);                                                                                          
                                        }
                                        if(employee.Manager.Title == undefined){
                                            $(".dynamicManagersDDL").append(`<option value="" title="">--Select--</option>`);                                            
                                        }
                                    });                     
                                }
                            },
                            error: function (data) {

                            }
                        });
                        
                        select.style.width = '100%';                    
                        select.setAttribute('val', '');
                        select.style.fontSize = '16px';
                        select.style.color = 'rgb(122, 122, 122)';
                        select.style.paddingTop = '7px';
                        select.style.paddingBottom = '7px';
                        //select.value = txtVal;
                        
                        txt.parentNode.appendChild(select);
                        txt.parentNode.removeChild(txt);
                    }
                }
            });


    }).catch(()=> {});  
    
    

}

public savedata(){
    $(document).on('click','.btnSavetoList',function(){
        alert();
    });
}

private new_script(src:any) {
    return new Promise((resolve, reject)=>{
        var script = document.createElement('script');
        script.src = src;
        script.addEventListener('load', ()=> {
            resolve();
        });
        script.addEventListener('error', (e)=> {
            reject(e);
        });
        document.body.appendChild(script);
    });
}
ChangeOrgChartTemplate=(SelectedVal)=>{
    this.setState({
        template:""+SelectedVal+""
    });
    this.GenerateChart(Nodevals);
}
  public render(): React.ReactElement<IRemoOrganizatinChartProps> {
    return (
      <>
        <section>
          <div className="container relative">    
            <div className="section-rigth">
              <div className="inner-banner-header relative m-b-20">
                <div className="inner-banner-overlay"></div>
                <div className="inner-banner-contents">
                  <h1>Organization Chart </h1>
                  <ul className="breadcums">
                    <li>  <a href={`${this.props.siteurl}/SitePages/Home.aspx?env=WebView`} data-interception="off"> Home </a> </li>
                    <li>  <a href="#" style={{pointerEvents:"none"}}> Org.Chart </a> </li>
                  </ul>
                </div>
              </div>
              <div className="inner-page-contents ">
                <div className="sec">
                  <div id='OrgChart' style={{'width':'100%'}}>
                  
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
  );
}
}
const preview = () => {
  return OrgChart.pdfPrevUI.show(chart, {
      format: 'A4'
  });
};