import { create } from "apisauce";

const apiClient = create({
  baseURL: "https://svadbeni-cvet-notifikator.onrender.com/api",
  //baseURL: "http://192.168.100.6:9000/api",
});

export default apiClient;
