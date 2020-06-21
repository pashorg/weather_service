import React from  'react';
import createReactClass from 'create-react-class';
import { connect } from 'react-redux';
import store from './reducers';
import WeatherService  from  './WeatherService';


const weatherService  =  new  WeatherService();

const CityList = createReactClass({
    componentDidMount: function() {
        weatherService.getCities().then(result => {
            store.dispatch({
                type: 'GET_CITY_LIST',
                cities: result.data
            });
        });
    },
    
    render: function() {
        return (
        <div className="Cities--list col-12">
            <div className="row">
                <div className="col-1 col-md-1">#</div>
                <div className="col-5 col-md-3">Country</div>
                <div className="col-5 col-md-8">City</div>
            </div>
            {this.props.cities.map( c  =>
            <div className="row" key={c.id}>
                <div className="col-1 col-md-1">{c.id}</div>
                <div className="col-5 col-md-3">{c.country}</div>
                <div className="col-5 col-md-8">
                    <a href={"/city/" + c.id}>{c.name}</a>
                </div>
            </div>
            )}
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
