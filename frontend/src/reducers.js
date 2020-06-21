import { createStore, combineReducers } from 'redux';

const initialCityState = {
    cities: [],
    city: []
} 

const initialChartState = {
    data: [],
    left : 'dataMin',
    right : 'dataMax',
    refAreaLeft : '',
    refAreaRight : '',
    top : 'dataMax+1',
    bottom : 'dataMin-1',
    top2 : 'dataMax+1',
    bottom2: 'dataMin-1',
    animation : true
}

const authReducer = function(state = { checked:false, logged:false }, action) {
    switch(action.type) {
        case 'SET_AUTH':
            return Object.assign({}, state, { auth: action.auth } );
        default:
            //do nothing
    }
    return state;
}

const cityReducer = function(state = initialCityState, action) {
    switch(action.type) {
        case 'GET_CITY':
            return Object.assign({}, state, { city: action.city });
        case 'GET_CITY_LIST':
            return Object.assign({}, state, { cities: action.cities.slice(0, 100) });
        default:
            //do nothing
    }
    return state;
}

const weatherReducer = function(state = {}, action) {
    switch(action.type) {
        case 'GET_WEATHER':
            return Object.assign({}, state, 
                { 
                    weatherCommon: action.weatherCommon,
                    weatherCurrent: action.weatherCurrent,
                    weatherHourly: action.weatherHourly 
                }
            );
        default:
            //do nothing
    }
    return state;
}

const chartReducer = function(state = initialChartState, action) {
    switch(action.type) {
        case 'SET_CHART':
            return Object.assign({}, state, 
                { 
                    data: action.data,
                    left : action.left,
                    right : action.right,
                    refAreaLeft : action.refAreaLeft,
                    refAreaRight : action.refAreaRight,
                    top : action.top,
                    bottom : action.bottom,
                    top2 : action.top2,
                    bottom2: action.bottom2,
                    animation : action.true
                }
            );
        case 'SET_CHART_DATA':
            return Object.assign({}, state, 
                { 
                    data: action.data,
                }
            );
        case 'SET_CHART_REFS':
            return Object.assign({}, state, 
                { 
                    refAreaLeft: action.refAreaLeft,
                    refAreaRight: action.refAreaRight,
                }
            );
        case 'SET_CHART_REF_LEFT':
            return Object.assign({}, state, 
                { 
                    refAreaLeft: action.refAreaLeft,
                }
            );
        case 'SET_CHART_REF_RIGHT':
            return Object.assign({}, state, 
                { 
                    refAreaRight: action.refAreaRight,
                }
            );
        default:
            //do nothing
    }
    return state;
}

const credReducer = function(state = { username:'', password:'', submitted:false, loggedIn:false }, action) {
    switch(action.type) {
        case 'SET_USERNAME':
            return Object.assign({}, state, 
                { 
                    username: action.username,
                } 
            );
        case 'SET_PASSWORD':
            return Object.assign({}, state, 
                { 
                    password: action.password,
                } 
            );
        case 'SET_SUBMITTED':
            return Object.assign({}, state, 
                { 
                    submitted: action.submitted
                } 
            );
        case 'SET_LOGGED':
            return Object.assign({}, state, 
                { 
                    loggedIn: action.loggedIn
                } 
            );
        default:
            //do nothing
    }
    return state;
}

const reducers = combineReducers({
    cityState: cityReducer,
    weatherState: weatherReducer,
    chartState: chartReducer,
    authState: authReducer,
    credState: credReducer
});

const store = createStore(reducers);

export default store;