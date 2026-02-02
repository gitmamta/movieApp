// import axios from "axios";

// const api = axios.create({
//   baseURL: "https://your-backend.onrender.com/"
// });

// export default api;

import axios from "axios";

const api = axios.create({
  baseURL: "https://your-backend.onrender.com/",
});

// Attach token before every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // or sessionStorage

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
