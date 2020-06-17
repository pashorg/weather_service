import  React, { Component } from  'react';
import { BrowserRouter } from  'react-router-dom'
import { Route } from  'react-router-dom'
import { Provider } from 'react-redux';
import store from './reducers';
import CityList  from  './CityList'
import City from './City'
import  './App.css';

const BaseLayout = () => (
<div className="container-fluid">
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand"  href="/">All Cities</a>
    </nav>
    <div className="content">
        <div className="container">
            <div className="row">
                <Route path="/" exact component={CityList}  />
                <Route path="/:id" exact component={City}  />
            </div>
        </div>
    </div>
</div>
)

class  App  extends  Component {

    render() {
        return (
        <Provider store={store}>
            <BrowserRouter>
                <BaseLayout/>
            </BrowserRouter>
        </Provider>
        );
    }

}
export  default  App;
