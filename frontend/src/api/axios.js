import axios from "axios";

const api = axios.create({
  baseURL:
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://interview-ai-ixwy.onrender.com",
  withCredentials: true,
});

export default api;
