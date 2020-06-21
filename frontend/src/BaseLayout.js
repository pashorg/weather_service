import  React from  'react';
import { Route, Redirect } from  'react-router-dom'
import store from './reducers';
import createReactClass from 'create-react-class';
import { connect } from 'react-redux';
import CityList  from  './CityList'
import City from './City'
import Login from './Login'
import WeatherService  from  './WeatherService';
import  './App.css';


const weatherService  =  new  WeatherService();


const  BaseLayout = createReactClass({

    componentDidMount: function() {
        weatherService.getLogin().then(function (result) {
            if (result.status === 401) {
                store.dispatch({
                    type: 'SET_AUTH',
                    auth: { checked:true, logged:false }
                });
            } else if (result.status === 200) {
                store.dispatch({
                    type: 'SET_AUTH',
                    auth: { checked:true, logged:true }
                });
            }
        });
    },

    render: function() {
        var redir;
        if (! this.props.auth ){
            return(<h1>Loading...</h1>);
        }

        if (! this.props.auth.checked ){
            return(<h1>Loading...</h1>);
        }

        if (! this.props.auth.logged ){
            redir = <Redirect to="/login" push />
        }

        return (
            <div className="container-fluid">
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <a className="navbar-brand"  href="/login">Login</a>
                    <a className="navbar-brand"  href="/">All Cities</a>
                </nav>
                <div className="content">
                    <div className="container">
                        <div className="row">
                            {redir}
                            <Route path="/" exact component={CityList}  />
                            <Route path="/city/:id" exact component={City}  />
                            <Route path="/login" exact component={Login}  />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

const mapStateToProps = function(store) {
    return {
        auth: store.authState.auth,
    };
}

export default connect(mapStateToProps)(BaseLayout);
