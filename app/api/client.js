import { create } from "apisauce";

const apiClient = create({
  baseURL: "https://svadbeni-cvet-notifikator.onrender.com/api",
  //baseURL: "http://192.168.0.109:9000/api",
  timeout: 60000,
});

export default apiClient;
