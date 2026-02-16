import axios from 'axios';

export const api = axios.create({
    // Apuntamos al puerto 3000 y al prefijo /api que definiste en el backend
    baseURL: 'http://localhost:3000/api', 
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);