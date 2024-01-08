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
    return http.get("/purchase/",{headers: authHeader() });
  }

  getPurchaseRecalculate(id) {
    return http.put(`/getPurchaseRecalculate/${id}`);
  }

  getPurchaseAP() {
    return http.get(`/purchaseAP/`);
  }

  deletePurchase(id) {
    return http.delete(`/purchase/${id}`);
  }

  getAllPurchaseByDate(sDate,eDate,customerId) {
    //console.log(`dates are ${sDate} ${eDate}`)
    return http.get(`/purchaseByDate/${sDate}/${eDate}/${customerId}`);
  }

  getAllPurchaseByDateSummary(sDate,eDate) {
    // console.log(`dates are ${sDate} ${eDate}`)
     return http.get(`/purchaseByDateSummary/${sDate}/${eDate}`);
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

  getPurcahseByLatestDate(itemId) {
    // console.log(`dates are ${sDate} ${eDate}`)
     return http.get(`/purchaseByLatestDate/${itemId}`);
   }

  createPurchaseDetail(data) {
    // console.log(data);
    return http.post("/purchaseDetail/",data,{headers: authHeader() });
  }

  updatePurchaseDetail(id, data) {
    //console.log(`update triggred from react .....`)
    return http.put(`/UpdatePurchaseDetail/${id}`, data,{headers: authHeader() });
  }

  deletePurchaseDetail(id) {
    return http.delete(`/purchaseDetail/${id}`);
  }

  deletePurchaseInvoiceByPurchaseId(id) {
    return http.delete(`/PurchaseDetailByPurchaseId/${id}`);
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

   ////////////////////////
  ////Edit Purchase Record////
  ///////////////////////
  createEditPurchase(data) {
    // console.log(data);
    return http.post("/editPurchase/",data,{headers: authHeader() });
  }

  getAllEditPurchase(sDate,eDate,itemId,invoiceId) {
    // console.log(`dates are ${sDate} ${eDate}`)
     return http.get(`/editPurchase/${sDate}/${eDate}/${itemId}/${invoiceId}`);
   }

  ////////////////////////
  ////Edit Sale Record////
  ///////////////////////
  createEditSale(data) {
    // console.log(data);
    return http.post("/editSale/",data,{headers: authHeader() });
  }

  getAllEditSale(sDate,eDate,itemId,invoiceId) {
    // console.log(`dates are ${sDate} ${eDate}`)
     return http.get(`/editSale/${sDate}/${eDate}/${itemId}/${invoiceId}`);
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
    return http.get(`/saleAR/`,{headers: authHeader()});
  }

  getSaleARByInvoiceId(id) {
    return http.get(`/saleARByInvoiceId/${id}`);
  }


  getSaleRecalculate(id) {
    return http.put(`/getSaleRecalculate/${id}`);
  }

  getAllSaleByDate(sDate,eDate,customerId,agentId,itemId,invoiceId) {
   // console.log(`dates are ${sDate} ${eDate}`)
    return http.get(`/saleByDate/${sDate}/${eDate}/${customerId}/${agentId}/${itemId}/${invoiceId}`);
  }

  getAllSaleByDateSummary(sDate,eDate) {
    // console.log(`dates are ${sDate} ${eDate}`)
     return http.get(`/saleByDateSummary/${sDate}/${eDate}`);
   }


   getMonthlySale(sDate,eDate) {
    // console.log(`dates are ${sDate} ${eDate}`)
     return http.get(`/saleMonthly/${sDate}/${eDate}`);
   }

   getSaleAgentTrend(sDate,eDate) {
    // console.log(`dates are ${sDate} ${eDate}`)
     return http.get(`/saleAgentTrend/${sDate}/${eDate}`);
   }

   getSaleAgentClosedInvoices(sDate,eDate) {
    // console.log(`dates are ${sDate} ${eDate}`)
     return http.get(`/saleAgentClosedInvoices/${sDate}/${eDate}`);
   }

   getSaleByLatestDate(itemId,customerId) {
    // console.log(`dates are ${sDate} ${eDate}`)
     return http.get(`/saleByLatestDate/${itemId}/${customerId}`);
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

  getAllSaleSaleDetailMismatch() {
    return http.get("/saleSaleDetailMismatch/");
  }

  getAllSaleDetailByInvoice(id) {
    return http.get(`/saleDetailById/${id}`);
  }

 
  // createSale(data) {
  //   // console.log(data);
  //   return http.post("/sale/",data,{headers: authHeader() });
  // }

  createSaleDetail(data) {
    console.log(data);
    return http.post("/saleDetail/",data,{headers: authHeader() });
    //return http.post('/saleDetail/',data);
  }

  deleteSaleDetail(id) {
    return http.delete(`/saleDetail/${id}`);
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

  getSalePayHist(id){
    return http.get(`/salePayHist/${id}`);
  }



  /////////////////////////
  //////SaleReturn////////
  ////////////////////////

  createSaleReturn(data) {
    //console.log(`Sale Return data =${data}`);
    return http.post("/saleReturn/",data,{headers: authHeader() });
  }

  getAllSaleReturnByDate(custName,sDate,eDate) {
     return http.get(`/saleReturnByDate/${custName}/${sDate}/${eDate}`);
   }

   //getSaleReturnDetailByInvoice
   getSaleReturnDetailByInvoice(id) {
    return http.get(`/saleReturnDetailByInvoice/${id}`);
  }





  /////////////////////////
  /////Others/////////////
  ////////////////////////

   

  //////Get balance sheet data
  getBalanceSheetByDate(sDate,eDate) {
   // console.log(`dates are ${sDate} ${eDate}`)
    return http.get(`/BalanceSheetByDate/${sDate}/${eDate}`);
  }

  //get total inventory value
  getTotalInv() {
    return http.get(`/getTotalInv/`);
  }

  //////Get item count per sale and purchase daily manual sheet by N&A
  getItemCountDailyReport(sDate,eDate) {
    // console.log(`dates are ${sDate} ${eDate}`)
     return http.get(`/itemCountDailyReport/${sDate}/${eDate}`);
   }
  



}

export default new inventoryDataService();