import http from "../http-common";
import authHeader from "./auth-header";

class expenseDataService {
  getAll() {
    return http.get("/expense/");
  }

  
  create(data) {

    return http.post("/expense/",data,{headers: authHeader() });
  }

}

export default new expenseDataService();