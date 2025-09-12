import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:5000",
    // baseURL: "https://server-mu-ochre-55.vercel.app",
    timeout: 50000,
});

api.interceptors.request.use(
  async (config) => {
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

export default api;