import axios from "axios";

const api = axios.create({
  baseURL: "https://your-backend.onrender.com/"
});

export default api;
