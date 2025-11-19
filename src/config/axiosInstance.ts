import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token && config.headers) {
      try {
        const decoded: { exp: number } = jwtDecode(token);
        const currentTime = Date.now() / 1000; // in seconds

        if (decoded.exp < currentTime) {
          // Token expired
          console.warn("Token expired. Please log in again.");
          localStorage.removeItem("token");
            localStorage.removeItem("token");
            window.location.href = "/employee/login"; // force redirect
        } else {
          // Token valid
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("token");
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
