import axios from 'axios';

// Configurer l'instance Axios globale
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

// Intercepteur pour ajouter automatiquement le token de sécurité (Sanctum) à chaque requête
api.interceptors.request.use(config => {
    const token = localStorage.getItem('api_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Intercepteur pour gérer les erreurs de connexion expirée (401)
api.interceptors.response.use(response => response, error => {
    if (error.response && error.response.status === 401) {
        localStorage.removeItem('api_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_name');
        window.location.href = '/login';
    }
    return Promise.reject(error);
});

export default api;
