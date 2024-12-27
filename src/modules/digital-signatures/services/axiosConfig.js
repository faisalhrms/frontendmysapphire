import axios from 'axios';
import store from '@redux/store.jsx';


const api = axios.create({
    baseURL: 'https://backend.srl.com.pk/api',
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


// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error;
        
        return Promise.reject(error);
    }
);

export default api;
