import http from "../http-common";
import authHeader from "./auth-header";

class cartDataService {
 
  getCartDetailByCust(id) {
    return http.get(`/cartDetailByCust/${id}`); 
  }

  updateCartDetail(id, data) {
    return http.put(`/cartDetail/${id}`, data);
  }

  createCartDetail(data) {
    console.log(authHeader());
     return http.post("/cartDetail/",data,{headers: authHeader() });
   }

  create(data) {
   console.log(authHeader());
    return http.post("/cart/",data,{headers: authHeader() });
  }

 
}

export default new cartDataService();