import React from  'react';
import createReactClass from 'create-react-class';
import { connect } from 'react-redux';
import store from './reducers';
import HoursGraph from './HoursCityGraph'
import HistoryGraph from './HistoryCityGraph'
import WeatherService  from  './WeatherService';

const weatherService  =  new  WeatherService();


const City = createReactClass({

    addZero: function(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    },

    unixTimeToUTC: function(unixTime) {
        var date = new Date(unixTime * 1000);
        var dateStr = date.getUTCFullYear() + '-' + (date.getUTCMonth() + 1) + '-' + date.getUTCDate();
        var timeStr = this.addZero(date.getUTCHours()) + ":" + this.addZero(date.getUTCMinutes());
        var dateTime = 'UTC ' + dateStr + ' ' + timeStr;
        return dateTime;
    },

    sortByKey: function (array, key) {
        return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    },

    componentDidMount: function() {
        var self = this;
        const { match: { params } } =  this.props;
        weatherService.getCity(params.id).then(function (result) {
            store.dispatch({
                type: 'GET_CITY',
                city: result.data
            });

            weatherService.getWeather( result.data.latitude, result.data.longitude ).then(function (weatherResult) {
                store.dispatch({
                    type: 'GET_WEATHER',
                    weatherCommon: weatherResult,
                    weatherCurrent: weatherResult.current,
                    weatherHourly: weatherResult.hourly
                });
            });

            weatherService.getCityHistoryN( 100, result.data.latitude, result.data.longitude ).then(function (weatherHistoryResult) {
                let data = [];
                weatherHistoryResult.data.forEach(element => {
                    let elem_object = JSON.parse(element.result.replace(/\'/g, '"'));
                    data.push(elem_object.current);
                });
                
                store.dispatch({
                    type: 'SET_HISTORY',
                    weatherHistory: self.sortByKey(data, 'dt'),
                });
            });
        });
    },
    
    render: function() {
        if (! this.props.weatherHourly || !this.props.weatherHistory){
            return(<h1>Loading...</h1>);
        }
        return (
        <div className="City--Single col-sm-12 col-12">
            <h1>{this.props.city.country} - {this.props.city.name}</h1>
            <h4>{this.props.city.latitude}; {this.props.city.longitude}</h4>
            <h4>Current Weather</h4>
            <table>
            <tbody>
                <tr>
                    <td>
                        Current Time
                    </td>
                    <td>
                        { this.unixTimeToUTC( this.props.weatherCurrent.dt ) }
                    </td>
                </tr>
                <tr>
                    <td >
                        Sunrise
                    </td>
                    <td >
                        { this.unixTimeToUTC( this.props.weatherCurrent.sunrise ) }
                    </td>
                </tr>
                <tr>
                    <td >
                            Sunset
                    </td>
                    <td >
                        { this.unixTimeToUTC( this.props.weatherCurrent.sunset ) }
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
                <h5>Data from openweathermap for the last 24 hours</h5>
                <HoursGraph />
            </div>
            <div id="HistoryGraph">
                <h5>Data from history - last 100</h5>
                <HistoryGraph />
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
        weatherHistory: store.weatherState.weatherHistory
    };
}

export default connect(mapStateToProps)(City);
