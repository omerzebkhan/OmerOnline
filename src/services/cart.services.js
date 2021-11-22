import http from "../http-common";
import authHeader from "./auth-header";

class cartDataService {
  getAll() {
    return http.get("/brand/");
  }

  getCartDetailByCust(id) {
    return http.get(`/cartDetailByCust/${id}`); 
  }

  updateCartDetail(id, data) {
    return http.put(`/cartDetail/${id}`, data);
  }

  create(data) {
   console.log(authHeader());
    return http.post("/cart/",data,{headers: authHeader() });
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

export default new cartDataService();