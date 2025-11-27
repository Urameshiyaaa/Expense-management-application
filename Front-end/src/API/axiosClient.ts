import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:4000/api', // backend cậu đang chạy
  headers: { 'Content-Type': 'application/json' },
});

export default axiosClient;
