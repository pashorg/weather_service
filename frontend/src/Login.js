import React from  'react';
import createReactClass from 'create-react-class';
import { connect } from 'react-redux';
import { Redirect } from  'react-router-dom'
import store from './reducers';
import WeatherService  from  './WeatherService';

const weatherService  =  new  WeatherService();


const Login = createReactClass({
    handleChange: function(e) {
        const { name, value } = e.target;
        store.dispatch({
            type: 'SET_' + name.toUpperCase(),
            [name]: value
        });
    },

    handleSubmit: function(e) {
        e.preventDefault();

        store.dispatch({
            type: 'SET_SUBMITTED',
            submitted: true
        });
        const { username, password } = this.props;
        if (username && password) {
            weatherService.Login(username, password).then(function (result) {
                console.log(result);
                if (result.status === 200){
                    console.log(result);
                    store.dispatch({
                        type: 'SET_LOGGED',
                        loggedIn: true
                    });
                }
            });
        }
    },
    
    render: function() {
        const { username, password, submitted, loggedIn } = this.props;
        if (loggedIn){
            return <Redirect to="/" push />;
        }
        console.log({ username, password, submitted, loggedIn })
        return (
            <div className="col-12 col-md-4 offset-md-4">
                <h2>Login</h2>
                <form name="form" onSubmit={this.handleSubmit}>
                    <div className={'form-group' + (submitted && !username ? ' has-error' : '')}>
                        <label htmlFor="username">Username</label>
                        <input type="text" className="form-control" name="username" value={username} onChange={this.handleChange} />
                        {submitted && !username &&
                            <div className="help-block">Username is required</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" name="password" value={password} onChange={this.handleChange} />
                        {submitted && !password &&
                            <div className="help-block">Password is required</div>
                        }
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary">Login</button>
                    </div>
                </form>
                { submitted && username && password && !loggedIn && <h4>Username or password mismatch!</h4> }
            </div>
        );
    }
});

const mapStateToProps = function(store) {
    return {
        username: store.credState.username,
        password: store.credState.password,
        submitted: store.credState.submitted,
        loggedIn: store.credState.loggedIn,
    };
}

export default connect(mapStateToProps)(Login);
