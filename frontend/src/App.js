import  React from  'react';
import { BrowserRouter } from  'react-router-dom'
import { Provider } from 'react-redux';
import store from './reducers';
import createReactClass from 'create-react-class';
import BaseLayout from './BaseLayout'
import  './App.css';


const  App = createReactClass({
    render: function() {
        return (
            <Provider store={store}>
                <BrowserRouter>
                    <BaseLayout />
                </BrowserRouter>
            </Provider>
        );
    }
});

export default App;
