import  React, { Component } from  'react';
import { BrowserRouter } from  'react-router-dom'
import { Route } from  'react-router-dom'
import CityList  from  './CityList'
import City from './City'
import  './App.css';

const BaseLayout = () => (
<div className="container-fluid">
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand"  href="/">All Cities</a>
	<p>Weather Service</p>
    </nav>
    <div className="content">
        <Route path="/"  exact  component={CityList}  />
        <Route path="/:id"  exact  component={City}  />
    </div>
</div>
)

class  App  extends  Component {

    render() {
        return (
        <BrowserRouter>
            <BaseLayout/>
        </BrowserRouter>
        );
    }

}
export  default  App;
