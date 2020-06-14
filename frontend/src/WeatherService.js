import axios from 'axios';
const API_URL = 'http://192.168.88.242:8000';

export default class WeatherService{

    constructor(){}

    getCities() {
        const url = `${API_URL}/api/city/`;
        return axios.get(url).then(response => response.data);
    }
    getCity(pk) {
        const url = `${API_URL}/api/city/${pk}/`;
        return axios.get(url).then(response => response.data);
    }
    getHistory() {
        const url = `${API_URL}/api/history/`;
        return axios.get(url).then(response => response.data);
    }
    getHistoryN(n) {
        const url = `${API_URL}/api/history/${n}/`;
        return axios.get(url).then(response => response.data);
    }
    getWeather(lat, lon){
        const url = `${API_URL}/api/weather/${lat}/${lon}/`;
        return axios.get(url).then(response => response.data);
    }

}
