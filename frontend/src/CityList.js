import React from  'react';
import createReactClass from 'create-react-class';
import { connect } from 'react-redux';
import store from './reducers';
import WeatherService  from  './WeatherService';


const weatherService  =  new  WeatherService();

const CityList = createReactClass({
    componentDidMount: function() {
        weatherService.getCities().then(result => {
            console.log(result);
            store.dispatch({
                type: 'GET_CITY_LIST',
                cities: result.data
            });
        });
    },
    
    render: function() {
        return (
        <div className="Cities--list col-sm-12">
            <table className="table">
                <thead key="thead">
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Lat</th>
                    <th>Lon</th>
                    <th>Country</th>
                    <th />
                </tr>
                </thead>
                <tbody>
                    {console.log(this.props.cities)}
                    {this.props.cities.map( c  =>
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

});

const mapStateToProps = function(store) {
    return {
        cities: store.cityState.cities
    };
}

export default connect(mapStateToProps)(CityList);
