import React, { Component } from  'react';
import HoursGraph from './HoursCityGraph'

import WeatherService  from  './WeatherService';

const weatherService  =  new  WeatherService();



class City extends Component {

    constructor(props) {
        super(props);
        this.state  = {
            city: {},
            weather_common: {},
            weather_current: {},
            time_stamp: '',
        };
    }

    unixTimeToLocal(unixTime) {
        var date = new Date(unixTime);
        var dateStr = date.getUTCFullYear() + '-' + (date.getUTCMonth() + 1) + '-' + date.getUTCDate();
        var timeStr = date.getUTCHours() + ":" + date.getUTCMinutes() + ":" + date.getUTCSeconds();
        var dateTime = dateStr + ' ' + timeStr + ' UTC';
        return dateTime;
    }

    componentDidMount() {
        var self = this;
        const { match: { params } } =  this.props;
        weatherService.getCity(params.id).then(function (result) {
            console.log(result);
            self.setState({ city: result.data});

            weatherService.getWeather( result.data.latitude, result.data.longitude ).then(function (weather_result) {
                console.log( weather_result );
                self.setState({ 
                    weather_common: weather_result,
                    weather_current: weather_result.current
                })
            });
        });
    }
    
    render() {
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
                                { this.unixTimeToLocal( this.state.weather_current.dt * 1000 ) }
                            </td>
                        </tr>
                        <tr>
                            <td >
                                Sunrise
                            </td>
                            <td >
                                { this.unixTimeToLocal( this.state.weather_current.sunrise * 1000 ) }
                            </td>
                        </tr>
                        <tr>
                            <td >
                                 Sunset
                            </td>
                            <td >
                                { this.unixTimeToLocal( this.state.weather_current.sunset * 1000 ) }
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
                    <HoursGraph />
                </div>
            </div>
        </div>
        );
    }
}
export default City;
