import axios from "axios";

const instance = axios.create({
  baseURL: "https://mern-blog-api-49y4.onrender.com/api",
});

// Auto attach token
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
