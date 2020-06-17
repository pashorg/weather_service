import React, { Component } from  'react';
import createReactClass from 'create-react-class';
import { connect } from 'react-redux';
import store from './reducers';

import HoursGraph from './HoursCityGraph'
import WeatherService  from  './WeatherService';

const weatherService  =  new  WeatherService();


const City = createReactClass({

    unixTimeToUTC: function(unixTime) {
        var date = new Date(unixTime);
        var dateStr = date.getUTCFullYear() + '-' + (date.getUTCMonth() + 1) + '-' + date.getUTCDate();
        var timeStr = date.getUTCHours() + ":" + date.getUTCMinutes() + ":" + date.getUTCSeconds();
        var dateTime = 'UTC ' + dateStr + ' ' + timeStr;
        return dateTime;
    },
    
    arrayTimeToUTC: function(dataArray, ref, ref_new) {
        var self = this;
        dataArray.forEach( function(hour, i, arr) {
            hour[ref_new] = self.unixTimeToUTC(hour[ref]);
        });
        return dataArray;
    },

    componentDidMount: function() {
        var self = this;
        const { match: { params } } =  this.props;
        weatherService.getCity(params.id).then(function (result) {
            console.log(result);
            store.dispatch({
                type: 'GET_CITY',
                city: result.data
            });

            weatherService.getWeather( result.data.latitude, result.data.longitude ).then(function (weatherResult) {
                let weatherHourlyTmp = self.arrayTimeToUTC(weatherResult.hourly, 'dt', 'timeStr');
                store.dispatch({
                    type: 'GET_WEATHER',
                    weatherCommon: weatherResult,
                    weatherCurrent: weatherResult.current,
                    weatherHourly: weatherHourlyTmp
                });
            });
        });
    },
    
    render: function() {
        if (! this.props.weatherHourly){
            return(<h1>Loading...</h1>);
        }
        return (
        <div className="City--Single col-sm-12">
            <h1>{this.props.city.country} - {this.props.city.name}</h1>
            <h2>Current Weather</h2>
            <table className="col-sm-6">
            <tbody>
                <tr>
                    <td>
                        Current Time
                    </td>
                    <td>
                        { this.unixTimeToUTC( this.props.weatherCurrent.dt * 1000 ) }
                    </td>
                </tr>
                <tr>
                    <td >
                        Sunrise
                    </td>
                    <td >
                        { this.unixTimeToUTC( this.props.weatherCurrent.sunrise * 1000 ) }
                    </td>
                </tr>
                <tr>
                    <td >
                            Sunset
                    </td>
                    <td >
                        { this.unixTimeToUTC( this.props.weatherCurrent.sunset * 1000 ) }
                    </td>
                </tr>
                <tr>
                    <td >
                        Temperature
                    </td>
                    <td >
                        { (this.props.weatherCurrent.temp - 273).toFixed(2) + ' C' }
                    </td>
                </tr>
                <tr>
                    <td >
                        Feels like
                    </td>
                    <td >
                        { (this.props.weatherCurrent.feels_like - 273).toFixed(2) + ' C' }
                    </td>
                </tr>
            </tbody>
            </table>
            <div id="HoursGraph">
                <HoursGraph hoursData={ this.props.weatherHourly.reverse() } />
            </div>
        </div>
        );
    }
});

const mapStateToProps = function(store) {
    return {
        city: store.cityState.city,
        weatherCommon: store.weatherState.weatherCommon,
        weatherCurrent: store.weatherState.weatherCurrent,
        weatherHourly: store.weatherState.weatherHourly,
    };
}

export default connect(mapStateToProps)(City);
