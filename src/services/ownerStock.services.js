import http from "../http-common";
import authHeader from "./auth-header";

class ownerStockService {


    create(data) {
        //console.log(data);
        return http.post("/ownerStock/", data);
      }
    
    getOwnerStockByOwnerAndItem(ownerId,itemId) {
        //console.log(`dates are ${sDate} ${eDate}`)
        return http.get(`/OSByOwnerAndDate/${ownerId}/${itemId}`);
      }

      update(id, data) {
        console.log(`calling ownerStock update  .....`)
        return http.put(`/ownerStock/${id}`,data);
      }

    
}

export default new ownerStockService();
