import React, { Component } from  'react';
import HoursGraph from './HoursCityGraph'

import WeatherService  from  './WeatherService';

const weatherService  =  new  WeatherService();



class City extends Component {

    constructor(props) {
        super(props);
        this.state  = {
            city: {},
//            weather_common: {},
//            weather_current: {},
//            weather_hourly: [],
            time_stamp: '',
        };
    }

    unixTimeToUTC(unixTime) {
        var date = new Date(unixTime);
        var dateStr = date.getUTCFullYear() + '-' + (date.getUTCMonth() + 1) + '-' + date.getUTCDate();
        var timeStr = date.getUTCHours() + ":" + date.getUTCMinutes() + ":" + date.getUTCSeconds();
        var dateTime = dateStr + ' ' + timeStr + ' UTC';
        return dateTime;
    }
    
    arrayTimeToUTC(dataArray, ref, ref_new){
        var self = this;
        dataArray.forEach( function(hour, i, arr) {
            hour[ref_new] = self.unixTimeToUTC(hour[ref]);
        });
        return dataArray;
    }

    componentDidMount() {
        var self = this;
        const { match: { params } } =  this.props;
        weatherService.getCity(params.id).then(function (result) {
            console.log(result);
            self.setState({ city: result.data});

            weatherService.getWeather( result.data.latitude, result.data.longitude ).then(function (weather_result) {
                let weather_hourly_tmp = self.arrayTimeToUTC(weather_result.hourly, 'dt', 'timeStr');
                self.setState({ 
                    weather_common: weather_result,
                    weather_current: weather_result.current,
                    weather_hourly: weather_hourly_tmp,
                })
            });
        });
    }
    
    render() {
        if (! this.state.weather_hourly){
            return(<h1>Loading...</h1>);
        }
        return (
        <div className="City--Single">
            <div className="row">
	            <div className="col-sm-12">
                    <h1>{this.state.city.country} - {this.state.city.name}</h1>
                    <h2>Current Weather</h2>
                    <table>
                    <tbody>
                        <tr>
                            <td>
                                Current Time
                            </td>
                            <td>
                                { this.unixTimeToUTC( this.state.weather_current.dt * 1000 ) }
                            </td>
                        </tr>
                        <tr>
                            <td >
                                Sunrise
                            </td>
                            <td >
                                { this.unixTimeToUTC( this.state.weather_current.sunrise * 1000 ) }
                            </td>
                        </tr>
                        <tr>
                            <td >
                                 Sunset
                            </td>
                            <td >
                                { this.unixTimeToUTC( this.state.weather_current.sunset * 1000 ) }
                            </td>
                        </tr>
                        <tr>
                            <td >
                                Temperature
                            </td>
                            <td >
                                { (this.state.weather_current.temp - 273).toFixed(2) + ' C' }
                            </td>
                        </tr>
                        <tr>
                            <td >
                                Feels like
                            </td>
                            <td >
                                { (this.state.weather_current.feels_like - 273).toFixed(2) + ' C' }
                            </td>
                        </tr>
                    </tbody>
                    </table>
                </div>
                <div id="HoursGraph" className="col-sm-12">
                    <HoursGraph hoursData={ this.state.weather_hourly.reverse() } />
                </div>
            </div>
        </div>
        );
    }
}
export default City;
