import http from "../http-common";
import authHeader from "./auth-header";

class brandDataService {
  getAll() {
    return http.get("/brand/",{headers: authHeader()});
  }

  get(id) {
    return http.get(`/brand/${id}`);
  }

  create(data) {
   console.log(authHeader());
    return http.post("/brand/",data,{headers: authHeader()});
  }

  update(id, data) {
    console.log(`update triggred from react .....`)
    return http.put(`/brand/${id}`, data);
  }

  delete(id) {
    return http.delete(`/brand/${id}`);
  }

  deleteAll() {
    return http.delete(`/brands`);
  }

  findByTitle(title) {
    return http.get(`/brand?title=${title}`);
  }
}

export default new brandDataService();