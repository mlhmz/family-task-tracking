import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8081', // ToDo: get this from an env var
  timeout: 3000,
});

export default axiosInstance;
