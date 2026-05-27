import axios from 'axios'

const request = axios.create({
    baseURL:'http://127.0.0.1:4523/m1/8273217-8035745-7755695',
    timeout:5000
})

request.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
)

request.interceptors.response.use(
    response => {
        return response.data;
    },
    error => {
        return Promise.reject(error);
    }
)

export default request;