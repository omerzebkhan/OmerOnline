import http from "../http-common";
import authHeader from "./auth-header";

class itemDataService {
  getAll() {
    return http.get("/item/");
  }

  get(id) {
    return http.get(`/item/${id}`);
  }

  getItemByCat(id) {
    return http.get(`/itemByCat/${id}`);
  }


  create(data) {
    console.log(data);
    return http.post("/item/", data,{headers: authHeader() });
  }

  update(id, data) {
    console.log(`update triggred from react .....`)
    return http.put(`/item/${id}`, data);
  }

  
 

 

  updateStockValue(id,data){
   // console.log(`update Stock triggred from react .....`)
    return http.put(`/itemUpdateStockValue/${id}`, data);
  }

  



  delete(id) {
    return http.delete(`/item/${id}`);
  }

  deleteAll() {
    return http.delete(`/items`);
  }

  findByTitle(title) {
    return http.get(`/item?title=${title}`);
  }
}

export default new itemDataService();