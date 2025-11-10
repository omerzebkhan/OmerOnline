import http from "../http-common";
import authHeader from "./auth-header";

class cashFlow {
 
  create(data) {

    return http.post("/createCashFlow/",data,{headers: authHeader() });
  }

  getCashFlow(mode) {
    return http.get(`/cashFlow/${mode}`);
  }

  createCashFlowPay(data) {
    //console.log(`Sale Return data =${data}`);
    return http.post("/createCashFlowPay/", data);
  }

   //Update Cash Flow with the value which is passed in as an object
   updateCashFlow(id, data) {
    // console.log(`update triggred from react .....`)
     return http.put(`/updateCashFlow/${id}`, data);
   }

   //get payment details of the Cash Flow
   getCashFlowPay(id) {
    return http.get(`/cashFlowPay/${id}`);
  }


}

export default new cashFlow();