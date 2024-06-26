import http from "../http-common";
import authHeader from "./auth-header";

class itemDataService {
  //Get all inventory mismatch
  getAllInventoryMismatch() {
    return http.get("/inventoryMismatch/",{headers: authHeader() });
  }



//Get all the items from the DB
  getAll() {
    return http.get("/item/",{headers: authHeader() });
  }

  get(id) {
    return http.get(`/item/${id}`,{headers: authHeader() });
  }

  getItemByCat(id) {
    return http.get(`/itemByCat/${id}`);
  }

  getItemPurchaseHistory(id) {
    return http.get(`/itemPurchaseHistory/${id}`);
  }

  getItemSaleHistory(id) {
    return http.get(`/itemSaleHistory/${id}`);
  }

  getItemReturnHistory(id){
    return http.get(`/itemReturnHistory/${id}`);
  }

  getItemlimitReport(){
    return http.get(`/itemLimitReport/`);
  }

  getItemTrend(sDate,eDate) {
    return http.get(`/itemTrend/${sDate}/${eDate}`);
  }

  
  getSalePurchaseDateWise(sDate,eDate) {
    // console.log(`dates are ${sDate} ${eDate}`)
     return http.get(`/itemSalePurchaseDateWise/${sDate}/${eDate}`);
   }

  create(data) {
    //console.log(data);
    return http.post("/item/", data,{headers: authHeader() });
  }

  update(id, data) {
    console.log(`update triggred from react .....`)
    return http.put(`/item/${id}`,data);
  }

  updateStockValue(id,data){
   // console.log(`update Stock triggred from react .....`)
    return http.put(`/itemUpdateStockValue/${id}`, data);
  }

  

  findByTitle(title) {
    return http.get(`/item?title=${title}`);
  }
}

export default new itemDataService();