import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

API.interceptors.request.use((config) => {
  let token = localStorage.getItem("token");

  // handle token saved as JSON object
  try {
    const parsed = JSON.parse(token);
    token = parsed.token;
  } catch (e) {
    // token is already plain string
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;