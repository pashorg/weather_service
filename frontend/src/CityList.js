import React, { Component } from  'react';

import WeatherService  from  './WeatherService';

const weatherService  =  new  WeatherService();


class  CityList  extends  Component {

    constructor(props) {
        super(props);
        this.state  = {
            cities: []
        };
    }

    componentDidMount() {
        var  self  =  this;
        weatherService.getCities().then(function (result) {
            console.log(result);
            self.setState({ cities:  result.data})
        });
    }
    
    render() {
        return (
        <div  className="Cities--list">
            <table  className="table">
                <thead  key="thead">
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Lat</th>
                    <th>Lon</th>
                    <th>Country</th>
                </tr>
                </thead>
                <tbody>
                    {this.state.cities.map( c  =>
                    <tr key={c.id}>
                        <td>{c.id}  </td>
                        <td>{c.name}</td>
                        <td>{c.latitude}</td>
                        <td>{c.longitude}</td>
                        <td>{c.country}</td>
                        <td>
                            <a href={c.id}>Show weather</a>
                        </td>
                    </tr>)}
                </tbody>
            </table>
        </div>
        );
    }

}
export default CityList;
