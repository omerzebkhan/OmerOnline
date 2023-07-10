import http from "../http-common";
import authHeader from "./auth-header";

class cartDataService {
 
  //CART DETAILS
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


  //CART 
  create(data) {
   console.log(authHeader());
    return http.post("/cart/",data,{headers: authHeader() });
  }

  updateCart(id, data) {
    return http.put(`/cart/${id}`, data);
  }

  getCartByDate(sDate,eDate) {
    // console.log(`dates are ${sDate} ${eDate}`)
     return http.get(`/cartByDate/${sDate}/${eDate}`);
   }
  

 
}

export default new cartDataService();