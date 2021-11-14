
import * as React from 'react';
import styles from './RemoWeatherCurrency.module.scss';
import { IRemoWeatherCurrencyProps } from './IRemoWeatherCurrencyProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { HttpClient, HttpClientResponse } from '@microsoft/sp-http';
import { ISpfxWeatherState } from './ISpfxWeatherState';
const CORS_PROXY = "https://howling-crypt-47129.herokuapp.com/";
const host = 'api.frankfurter.app';
import * as moment from 'moment';
import * as $ from 'jquery';
import { Autocomplete } from '@material-ui/lab';
import TextField from '@material-ui/core/TextField';
import Select, { components } from 'react-select';


export interface IRemoWeatherCurrencyState{
  Temp:any;
  WeatherType:any;
  CurrencyValue:any;

    skyimage: string;
    location: string;
    weatherid: string;
    temperature: string;
    windspeed: string;
    humidity: string;
    From:string;
    To:string;
    CurrencyOptions:any[];

    selectedOption: any;
}

let AvailableCurrencies = [];

const Placeholder = props => {
  return <components.Placeholder {...props} />;
};
export default class RemoWeatherCurrency extends React.Component<IRemoWeatherCurrencyProps, IRemoWeatherCurrencyState,{}> {
  public constructor(props: IRemoWeatherCurrencyProps, state: IRemoWeatherCurrencyState){  
    super(props);
    this.state = { 
      Temp: "",
      WeatherType:"",

      CurrencyValue:"",
      skyimage: '', 
          location: '', 
          weatherid: '', 
          temperature: '', 
          windspeed: '', 
          humidity: '' ,
          From:"AED",
          To:"USD",
          CurrencyOptions:[],

          selectedOption: null,
     };     
  }

  public async componentDidMount() {
    this.GetWeatherReport();
    this.GetNextPrayer();
    this.GetCurrencyValue();
    this.GetCurrencySymbols();
  }

  private async getWeather() {
    const info = await this.props.context.httpClient.get('https://ipinfo.io/json');
    const locinfo = await info.json();
    var locString = locinfo.loc.split(',');
    var latitude = parseFloat(locString[0]);
    var longitude = parseFloat(locString[1]);
    const weather = await this.props.context.httpClient.get('https://cors.5apps.com/?uri=http://api.openweathermap.org/data/2.5/weather?q=Dubai&units=metric&APPID=c3e00c8860695fd6096fe32896042eda');
    const weatherinfo = await weather.json();
    var windSpeedkmh = Math.round(weatherinfo.wind.speed * 3.6);
    var Celsius = Math.round(weatherinfo.main.temp);
    var iconId = weatherinfo.weather[0].icon;
    var weatherURL = "http://openweathermap.org/img/w/" + iconId + ".png";
    this.setState({
      skyimage: weatherURL,
      location: locinfo.city + ', ' + locinfo.region + ', ' + locinfo.country,
      weatherid: weatherinfo.weather[0].description,
      temperature: Celsius.toString(),
      windspeed: windSpeedkmh + ' km/hr',
      humidity: weatherinfo.main.humidity
    });
  }

  public GetWeatherReport(){    
    fetch('https://api.weatherapi.com/v1/current.json?key=4745d1a343b849d58a7104337211904&q=Dubai&aqi=no')
    .then((response) => response.text())
    .then((responseData) => (responseData))
    .then((res) => {
      let WeatherDetails = JSON.parse(res);

      let WeatherImg = WeatherDetails.current.condition.icon;
      let Temperature = WeatherDetails.current.temp_c;
      let WeatherType = WeatherDetails.current.condition.text;
      this.setState({
        temperature: Temperature,
        WeatherType: WeatherType,
        skyimage: WeatherImg
      });
    }); 
  }

  public getDifferenceInhrsandmins(EndTime, StartTime) {
    let diff = moment(EndTime, 'HH:mm').diff(moment(StartTime, 'HH:mm'));
    let d = moment.duration(diff);
    let hours =  Math.floor(d.asHours());
    let minutes = moment.utc(diff).format("mm");
    let RemainingTime = hours+":"+minutes;
    return RemainingTime;
  }

  public GetNextPrayer(){
    var reactHandler = this;
    var curDate = moment(new Date()).format("DD-MM-YYYY");
    var curDateTime = moment().format("DD-MM-YYYY HH:MM");
    var resultDt;
    fetch(`https://api.aladhan.com/v1/timingsByAddress/'${curDate}'?address=Dubai,UAE&method=8&tune=2,3,4,5,2,3,4,5,-3`)    
    .then((response) => response.text())
    .then((responseData) => (responseData))
    .then((res) => {
      let PrayerData = JSON.parse(res);
      let PrayerDetails = PrayerData.data.timings;
      let CurrentTime:any = moment(new Date()).format("HH:mm");
      
      setTimeout(function(){
        if (PrayerDetails["Fajr"] > CurrentTime) {
          let RemainingTime = reactHandler.getDifferenceInhrsandmins(PrayerDetails["Fajr"],CurrentTime);
          $("#prayer-time").append(PrayerDetails["Fajr"]);
          $("#prayer-type").html(`Fajr <span>in</span> ${RemainingTime} Hrs`);
        } else if (PrayerDetails["Sunrise"] > CurrentTime) {
          let RemainingTime = reactHandler.getDifferenceInhrsandmins(PrayerDetails["Sunrise"],CurrentTime);
            $("#prayer-time").append(PrayerDetails["Sunrise"]);
            $("#prayer-type").html(`Sunrise <span>in</span> ${RemainingTime} Hrs`);
        } else if (PrayerDetails["Dhuhr"] > CurrentTime) {
          let RemainingTime = reactHandler.getDifferenceInhrsandmins(PrayerDetails["Dhuhr"],CurrentTime);
            $("#prayer-time").append(PrayerDetails["Dhuhr"]);
            $("#prayer-type").html(`Dhuhr <span>in</span> ${RemainingTime} Hrs`);
        } else if (PrayerDetails["Asr"] > CurrentTime) {
            let RemainingTime = reactHandler.getDifferenceInhrsandmins(PrayerDetails["Asr"],CurrentTime);
            $("#prayer-time").append(PrayerDetails["Asr"]);
            $("#prayer-type").html(`Asr <span>in</span> ${RemainingTime} Hrs`);
        } else if (PrayerDetails["Maghrib"] > CurrentTime) {
          let RemainingTime = reactHandler.getDifferenceInhrsandmins(PrayerDetails["Maghrib"],CurrentTime);
            $("#prayer-time").append(PrayerDetails["Maghrib"]);
            $("#prayer-type").html(`Maghrib <span>in</span> ${RemainingTime} Hrs`);
        } else if (PrayerDetails["Isha"] > CurrentTime) {
          let RemainingTime = reactHandler.getDifferenceInhrsandmins(PrayerDetails["Isha"],CurrentTime);
            $("#prayer-time").append(PrayerDetails["Isha"]);          
            $("#prayer-type").html(`Isha <span>in</span> ${RemainingTime} Hrs`);
        }
      },1000);
    });
  }

  public GetCurrencyValue(){    
    fetch('https://api.exchangerate.host/convert?from=AED&to=USD&amount=1')    
    .then(resp => resp.json())
    .then((data) => {
      var num = parseFloat(data.result);
      var new_num = num.toFixed(2);
    this.setState({
      CurrencyValue: new_num
    });
  });
  }

  public GetCurrencySymbols(){
    var reactHandler = this;
    AvailableCurrencies = [];
    $.ajax({  
        url: `${this.props.siteurl}/_api/web/lists/getbytitle('CurrencyMasterList')/items?$top=300`,  
        type: "GET",  
        headers:{'Accept': 'application/json; odata=verbose;'},  
        success: function(resultData) {              
          reactHandler.setState({  
            CurrencyOptions:resultData.d.results   
          });  
          for(var i = 0; i < resultData.d.results.length; i++){
            AvailableCurrencies.push({ value: ''+resultData.d.results[i].Title+'', label: ''+resultData.d.results[i].Title+'' });
          }                          
        },  
        error : function(jqXHR, textStatus, errorThrown) {  
        }  
    });
  }

  handleChange = selectedOption => {
    this.setState({ selectedOption });
    var selval = selectedOption.value;
      fetch(`https://api.exchangerate.host/convert?from=AED&to=${selval}&amount=1`)
      .then(resp => resp.json())
      .then((data) => {
        var num = parseFloat(data.result);
        var new_num = num.toFixed(2);
        this.setState({
          CurrencyValue:new_num
        });
      });
  };

  public render(): React.ReactElement<IRemoWeatherCurrencyProps> {    
    const { selectedOption } = this.state;
    return (
      <div className={[styles.remoWeatherCurrency,"m-b-20"].join(' ')} id="m-b-20-weather">        
        <div className="climate-wrap m-b-20">
            <div className="sec climate-prayer-exchage m-b-20">
                <ul className="clearfix">
                    <li>
                        <h4> <img src={this.state.skyimage} alt="weathersky"/>  Dubai, UAE </h4>
                        <h2> {this.state.temperature}°C </h2>
                        <p> {this.state.WeatherType} </p>
                    </li>
                    <li>
                        <h4> <img src={`${this.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/c2.svg`} alt="img" />  Next Prayer </h4>
                        <h2 id="prayer-time">  </h2>
                        <p id="prayer-type">  </p>
                    </li>
                    <li className="stocksxchange">
                        <h4> <img src={`${this.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/c3.svg`} alt="img" />  1.00 AED </h4>
                        <p> Equals to  </p>
                        <h2> {this.state.CurrencyValue} </h2>
                        <span className="ddl-currency">
                        {/*<Autocomplete
                            id="combo-box-currency"
                            onChange={(event, value) => this.handle(value)}
                            options={this.state.CurrencyOptions}                  
                            getOptionLabel={(option) => option.Title}
                            renderInput={(params) => <TextField {...params} placeholder="USD"/>}
                          />   */}
                          <Select
                            id="combo-box-currency"
                            value={selectedOption}
                            onChange={this.handleChange}
                            options={AvailableCurrencies}
                            placeholder={'USD'}
                            styles={{
                              placeholder: base => ({
                                ...base,                                
                              }),
                            }}
                          />            
                        </span>
                    </li>
                </ul>
            </div>
        </div>
      </div>
    );
  }
}
