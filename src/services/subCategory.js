import http from "../http-common";
import authHeader from "./auth-header";

class subCategoryDataService {
  getAll() {
    return http.get("/subCategory/");
  }

  get(id) {
    return http.get(`/subCategory/${id}`);
  }

  create(data) {
    console.log(data);
    return http.post("/subCategory/", data,{headers: authHeader() });
  }

  update(id, data) {
    console.log(`update triggred from react .....`)
    return http.put(`/subCategory/${id}`, data);
  }

  delete(id) {
    return http.delete(`/subCategory/${id}`);
  }

  deleteAll() {
    return http.delete(`/subCategories`);
  }

  findByTitle(title) {
    return http.get(`/subCategory?title=${title}`);
  }
}

export default new subCategoryDataService();