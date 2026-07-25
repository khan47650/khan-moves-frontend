import axios from "axios";

const api = axios.create({
    // baseURL: "https://khan-moves-backend.vercel.app/api",
    baseURL: "http://localhost:5000/api",
});

const TOKEN_KEY = "khanmoves_token";

api.interceptors.request.use(
    config => {
        const token =
            localStorage.getItem(
                TOKEN_KEY
            );

        if (token) {
            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },
    error => Promise.reject(error)
);

export default api;