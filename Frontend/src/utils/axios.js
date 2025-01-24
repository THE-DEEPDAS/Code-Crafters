import axios from "axios";

const api = axios.create({
	baseURL: "http://localhost:3000/api", // Replace with your API URL
	headers: {
		"Content-Type": "application/json",
	},
});

// Add token to every request if it exists
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

export default api;
