import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:3000/api', // Explicitly hardcoded to avoid :1 suffix from env vars
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('Token enviado en la petición: ', token ? 'SÍ' : 'NO');
        console.log('URL de la petición:', config.url);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);