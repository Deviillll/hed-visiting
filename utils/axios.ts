// lib/axios.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api",         // or your full backend URL if using a separate server
  withCredentials: true,   // always send cookies
});

export default axiosInstance;
