import axios from 'axios';

const API_URL = '/api';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Request interceptor for API calls
axiosInstance.interceptors.request.use(
    async (config) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        if (userInfo.token) {
            config.headers.Authorization = `Bearer ${userInfo.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for API calls
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            console.error('🔓 401 Unauthorized detected. Clearing session...');
            localStorage.removeItem('userInfo');
            // Force redirect to login if not already there
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login?message=session_expired';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
