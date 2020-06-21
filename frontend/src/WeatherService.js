import axios from 'axios';
axios.defaults.withCredentials = true;
const ip = window.location.hostname;
const API_URL = `http://${ip}:8000`;


export default class WeatherService{
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
    getLogin(){
        const url = `${API_URL}/api/login/`;
        return axios.get(url).then(response => response.data);
    }
    Login(username, password){
        const url = `${API_URL}/api/login/`;
        return axios.post(url, { username: username, password:password } ).then(response => response.data);
    }

}
