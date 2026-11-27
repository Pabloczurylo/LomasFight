import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

/** Borra la sesión guardada y manda al login. */
export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    if (window.location.pathname !== '/login') {
        window.location.assign('/login');
    }
}

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Si el backend rechaza la sesión (token vencido, usuario dado de baja), volver al login.
// El login en sí devuelve 401 con credenciales incorrectas: eso lo maneja la pantalla de login.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        const url: string = error?.config?.url || '';
        if (status === 401 && !url.includes('/usuarios/login') && localStorage.getItem('token')) {
            logout();
        }
        return Promise.reject(error);
    }
);

/** Mensaje de error del backend ({ error: '...' }) o un texto por defecto. */
export function mensajeError(err: unknown, porDefecto: string): string {
    const data = (err as { response?: { data?: { error?: unknown } } })?.response?.data;
    return typeof data?.error === 'string' ? data.error : porDefecto;
}
