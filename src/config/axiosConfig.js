import axios from 'axios';
import store from '@redux/store.jsx';
import {logout} from "@modules/auth/redux/authSlice.js";

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
          error.code = error.code || "ERR_NETWORK"
          error._userMessage = "Unable to reach backend server. Check network/VPN and try again."
          return Promise.reject(error)
        }

        const code = response.status;

        if (code === 401) {
            store.dispatch(logout());
            window.location.href = '/';
            return Promise.reject(new Error('Unauthorized. Redirecting to login.'));
        }

        if (code === 403) {
            window.location.href = '/error/403';
            return Promise.reject(new Error('Permission Denied.'));
        }
        if (code === 419) {
            window.location.href = `${import.meta.env.BASE_URL}change-password`;
            return Promise.reject(new Error('Password Expired.'));
        }

        console.error(`Error ${code}:`, response.data);
        return Promise.reject(error);
    }
);


export default api;
