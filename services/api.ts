import axios from "axios";

export const api = axios.create({
  baseURL: "https://my-json-server.typicode.com/augustocesarfmo/crud-rest-web",
  timeout: 1000,
});
