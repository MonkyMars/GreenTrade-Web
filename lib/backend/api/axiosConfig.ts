import axios from 'axios';

export const BASE_URL =
	process.env.NODE_ENV === 'production'
		? 'https://greenvue.up.railway.app'
		: 'http://192.168.178.10:8080';

const api = axios.create({
	baseURL: BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	timeout: 10000,
});

// Add a request interceptor that properly handles async/await
api.interceptors.request.use(
	async (config) => {
		const token = localStorage.getItem('accessToken');
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
