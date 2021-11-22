import http from "../http-common";
import authHeader from "./auth-header";

class categoryDataService {
  getAll() {
    return http.get("/category/");
  }

  get(id) {
    return http.get(`/category/${id}`);
  }

  create(data) {
    console.log(data);
    return http.post("/category/", data,{headers: authHeader() });
  }

  update(id, data) {
    console.log(`update triggred from react .....`)
    return http.put(`/category/${id}`, data);
  }

  delete(id) {
    return http.delete(`/category/${id}`);
  }

  deleteAll() {
    return http.delete(`/categorys`);
  }

  findByTitle(title) {
    return http.get(`/category?title=${title}`);
  }
}

export default new categoryDataService();