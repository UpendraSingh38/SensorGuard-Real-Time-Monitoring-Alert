import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000"
});

export const getSensors = () => API.get("/sensors");
export const getAlerts = () => API.get("/alerts");
export const getStats = () => API.get("/stats");