import { create } from "apisauce";

const apiClient = create({
  //baseURL: "https://svadbeni-cvet-notifikator.onrender.com/api",
  baseURL: "http://192.168.100.30:9000/api",
  timeout: 60000,
});

export default apiClient;
