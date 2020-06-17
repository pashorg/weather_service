import { createStore, combineReducers } from 'redux';


const initialCityState = {
    cities: [],
    city: [],
    chart: {
        data: [],
        left : 'dataMin',
        right : 'dataMax',
        refAreaLeft : '',
        refAreaRight : '',
        top : 'dataMax+1',
        bottom : 'dataMin-1',
        top2 : 'dataMax+20',
        bottom2 : 'dataMin-20',
        animation : true
    }
} 

const cityReducer = function(state = initialCityState, action) {
    switch(action.type) {
        case 'SET_CHART':
            return Object.assign({}, state, { chart: action.chart });
        case 'GET_CITY':
            return Object.assign({}, state, { city: action.city });
        case 'GET_CITY_LIST':
            return Object.assign({}, state, { cities: action.cities.slice(0, 100) });
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
    }
    return state;
}

const reducers = combineReducers({
    cityState: cityReducer,
    weatherState: weatherReducer
});

const store = createStore(reducers);

export default store;