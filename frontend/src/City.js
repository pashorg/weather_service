import React, { Component } from  'react';

import WeatherService  from  './WeatherService';

const weatherService  =  new  WeatherService();


class City extends Component {

    constructor(props) {
        super(props);
        this.state  = {
            city: {},
	    weather: {},
        };
    }

    componentDidMount() {
        var self = this;
        const { match: { params } } =  this.props;
        weatherService.getCity(params.id).then(function (result) {
            console.log(result);
            self.setState({ city: result.data});

            weatherService.getWeather( result.data.latitude, result.data.longitude ).then(function (weather_result) {
                self.setState({ 
//                        weather: {
//                                ...weather_result,
//                                current: {
//                                   ...weather_result.current
//                                }
//                        }
                        weather: JSON.parse(JSON.stringify(weather_result))                      
                })
            });

        });
    }
    
    render() {
        console.log(this.state.weather);
        return (
        <div className="City--Single">
            <div className="row">
	        <div className="col-sm-12">
                    <h1>{this.state.city.country} - {this.state.city.name}</h1>
                    <h2>Current Weather</h2>
                    <table>
                    <tbody>
                        <tr>
                            <td className="col-sm-6">
                                Time
                            </td>
                            <td className="col-sm-6">
                                {this.state.weather.current.dt}
                            </td>
                        </tr>
                    </tbody>
		    </table>
                </div>
            </div>
        </div>
        );
    }

}
export default City;
