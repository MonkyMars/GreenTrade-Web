import axios from 'axios';

export const BASE_URL =
	process.env.NODE_ENV === 'production'
		? 'https://api.greenvue.eu'
		: 'http://localhost:8080';

const api = axios.create({
	baseURL: BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	timeout: 10000,
	withCredentials: true,
});

export default api;
