import http from "../http-common";
import authHeader from "./auth-header";

class inventoryDataService {

  //////////////////////
  ///PURCHASE INVOICE///
  //////////////////////

  createPurchase(data) {
    // console.log(data);
    return http.post("/purchase/" ,data,{headers: authHeader() });
  }

  getAllPurchase() {
    return http.get("/purchase/");
  }

  getPurchaseAP() {
    return http.get(`/purchaseAP/`);
  }

  getAllPurchaseByDate(sDate,eDate) {
    console.log(`dates are ${sDate} ${eDate}`)
    return http.get(`/purchaseByDate/${sDate}/${eDate}`);
  }


  getAllPurchaseByCustId(id) {
    return http.get(`/purchaseByCustId/${id}`);
  }

  
  //Update Purchase Invoice with the value which is passed in as an object
  updatePurchase(id, data) {
    // console.log(`update triggred from react .....`)
     return http.put(`/updatePurchase/${id}`, data);
   }



  /////////////////////////
  //PurchaseInvoiceDetail//
  ////////////////////////

  getAllPurchaseDetail() {
    return http.get("/purchaseDetail/");
  }

  getAllPurchaseDetailByInvoice(id) {
    return http.get(`/purchaseDetailById/${id}`);
  }

  createPurchaseDetail(data) {
    // console.log(data);
    return http.post("/purchaseDetail/",data,{headers: authHeader() });
  }

  ///////////////////////////////////////////
  //////Purchase Invoice Payment/////////////
  //////////////////////////////////////////

  createPurchaseInvPay(data) {
    return http.post("/createPurchaseInvPay/", data);
  }

  getPurchaseInvPay(id) {
    return http.get(`/purchaseInvPay/${id}`);
  }




  //////////////////////
  ////SALE INVOICE/////
  //////////////////////

  getAllSale() {
    return http.get("/sale/");
  }

  getSale(id) {
    return http.get(`/sale/${id}`);
  }

  getSaleAR() {
    return http.get(`/saleAR/`);
  }

  getSaleRecalculate(id) {
    return http.put(`/getSaleRecalculate/${id}`);
  }

  getAllSaleByDate(sDate,eDate,customerId) {
   // console.log(`dates are ${sDate} ${eDate}`)
    return http.get(`/saleByDate/${sDate}/${eDate}/${customerId}`);
  }

  getAllSaleByCustId(id) {
    return http.get(`/saleByCustId/${id}`);
  }

  createSale(data) {
    // console.log(data);
    return http.post("/sale/",data,{headers: authHeader() });
  }

  deleteSale(id) {
    return http.delete(`/sale/${id}`);
  }

  //Update sale Returned, Invoce value, Outstanding ,Total Item
  updateSaleRIvOTi(id, data) {
    //console.log(`update triggred from react .....`)
    return http.put(`/updateSaleRIvOTi/${id}`, data);
  }

  //Update Sale Invoice with the value which is passed in as an object
  updateSale(id, data) {
   // console.log(`update triggred from react .....`)
    return http.put(`/updateSale/${id}`, data);
  }



  /////////////////////////
  //SaleInvoiceDetail//
  ////////////////////////

  getAllSaleDetail() {
    return http.get("/saleDetail/");
  }

  getAllSaleDetailByInvoice(id) {
    return http.get(`/saleDetailById/${id}`);
  }

  createSaleDetail(data) {
    // console.log(data);
    return http.post("/saleDetail/",data,{headers: authHeader() });
  }

  deleteSaleInvoiceBySaleId(id) {
    return http.delete(`/SaleDetailBySaleId/${id}`);
  }


  updateSaleDetailQ(id, data) {
    //console.log(`update triggred from react .....`)
    return http.put(`/UpdateSaleDetailQ/${id}`, data);
  }

  updateSaleDetail(id, data) {
    //console.log(`update triggred from react .....`)
    return http.put(`/UpdateSaleDetail/${id}`, data);
  }



  ///////////////////////////////////////////
  //////Sale Invoice Payment////////////////
  //////////////////////////////////////////

  createSaleInvPay(data) {
    //console.log(`Sale Return data =${data}`);
    return http.post("/createSaleInvPay/", data);
  }

  getSalInvPay(id) {
    return http.get(`/saleInvPay/${id}`);
  }



  /////////////////////////
  //////SaleReturn////////
  ////////////////////////

  createSaleReturn(data) {
    //console.log(`Sale Return data =${data}`);
    return http.post("/saleReturn/",data,{headers: authHeader() });
  }

  /////////////////////////
  /////Others/////////////
  ////////////////////////

  //////Get balance sheet data
  getBalanceSheetByDate(sDate,eDate) {
   // console.log(`dates are ${sDate} ${eDate}`)
    return http.get(`/BalanceSheetByDate/${sDate}/${eDate}`);
  }

  



}

export default new inventoryDataService();