import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API || "http://localhost:5000/api/v1",
  withCredentials: true,
});

export default apiClient;
