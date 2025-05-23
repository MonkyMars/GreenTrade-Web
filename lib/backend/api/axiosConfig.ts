import axios from 'axios';
import camelcaseKeys from 'camelcase-keys';

export const BASE_URL =
	process.env.NODE_ENV === 'production'
		? 'https://greenvue-api-production.up.railway.app'
		: 'http://localhost:8080';

const api = axios.create({
	baseURL: BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	timeout: 10000,
	withCredentials: true,
});

axios.interceptors.response.use((response) => {
  response.data = camelcaseKeys(response.data.data, { deep: true });
  return response;
});


export default api;
