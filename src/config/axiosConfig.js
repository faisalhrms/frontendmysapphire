import axios from 'axios';
import store from '@redux/store.jsx';


const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true
});


api.interceptors.request.use((config) => {
    const state = store.getState();
    const token = state.auth.tokens.access_token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }else{
        window.location.href = '/';
    }
    return config;
},
    (error) => Promise.reject(error)
);


api.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error;

        if (!response) {
            return Promise.reject(new Error('Network error. Please try again later.'));
        }

        const code = response.status;

        if (code === 401) {
            window.location.href = '/';
            return Promise.reject(new Error('Unauthorized. Redirecting to login.'));
        }

        if (code === 403) {
            window.location.href = '/error/403';
            return Promise.reject(new Error('Permission Denied.'));
        }

        console.error(`Error ${code}:`, response.data);
        return Promise.reject(error);
    }
);


export default api;
