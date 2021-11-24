import PurchaseActionType from './purchase.type';
import inventoryService from '../../services/inventory.service';


export const fetchPurchaseStart = () =>({
    type:PurchaseActionType.FETCH_PURCHASE_START
});

export const fetchPurchaseSuccess = purchaseMap =>({
    type:PurchaseActionType.FETCH_PURCHASE_SUCCESS,
    payload:purchaseMap
});

export const fetchPurInvPayDeatilSuccess = purchaseMap =>({
    type:PurchaseActionType.FETCH_PURINVPAYDETIAL_SUCCESS,
    payload:purchaseMap
});


export const fetchPurchaseFailure = errorMessage => ({
    type:PurchaseActionType.FETCH_PURCHASE_FAILURE,
    payload:errorMessage
})

export const setCurrentPurchase= purchase =>({
    type:PurchaseActionType.SET_CURRENT_PURCHASE,
    payload:purchase
})

export const fetchPurchaseStartAsync = () => {
    return dispatch =>{
       // const collectionRef = firestore.collection('PurchaseInvoice');
        dispatch (fetchPurchaseStart());
        inventoryService.getAllPurchase()
        .then (response => {
                const purchaseMap = response.data;
                dispatch(fetchPurchaseSuccess(purchaseMap));          
         })
         .catch(error=>dispatch(fetchPurchaseFailure(error.response.request.response.message)));
    }}

export const fetchPurInvPayDetial = (invoiceId) =>{
    //console.log(`redux method is called ${invoiceId }`)
    return dispatch =>{
        //const collectionRef = firestore.collection('PurchaseInvoice').where("supplierId", "==", userId);
        dispatch (fetchPurchaseStart());
        inventoryService.getPurchaseInvPay(invoiceId)
         .then (response =>{
                const purchaseMap = response.data;
                console.log(purchaseMap)
                dispatch(fetchPurInvPayDeatilSuccess(purchaseMap));          
          })
          .catch(error=>dispatch(fetchPurchaseFailure(error.response.request.response.message)));
        }
          } 


    export const fetchPurchaseByDate = (sDate, eDate) => {
        return dispatch =>{
            if (sDate !== "" && eDate !== "") {
                var dateFormat = require('dateformat');
                sDate =dateFormat(sDate, "yyyy-mm-dd");
                eDate=dateFormat(eDate, "yyyy-mm-dd");
                var myDate = new Date(eDate);
                myDate.setDate(myDate.getDate() + 1);
                myDate=dateFormat(myDate,"yyyy-mm-dd");
                eDate = myDate;
                // var now = new Date();
               // dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");
                console.log(`sDate=${sDate} 
                edate=${eDate}`);
               // f = firestore.collection('SaleInvoice')
                // .where("dt", '>=', sDate)
                // .where("dt", '<=',eDate);
           // const collectionRef = firestore.collection('PurchaseInvoice');
           dispatch (fetchPurchaseStart());
           inventoryService.getAllPurchaseByDate(sDate, eDate)
           .then (response => {
                   const purchaseMap = response.data;
                   dispatch(fetchPurchaseSuccess(purchaseMap));          
            })
            .catch(error=>dispatch(fetchPurchaseFailure(error.response.request.response.message)));
       }}
            }
            
    
           


    export const fetchPurchaseByInputStartAsync = (userId) => {
        return dispatch =>{
        //const collectionRef = firestore.collection('PurchaseInvoice').where("supplierId", "==", userId);
        dispatch (fetchPurchaseStart());
        inventoryService.getAllPurchaseByCustId(userId)
         .then (response =>{
                const purchaseMap = response.data;
                dispatch(fetchPurchaseSuccess(purchaseMap));          
          })
          .catch(error=>dispatch(fetchPurchaseFailure(error.response.request.response.message)));
        }}
     
