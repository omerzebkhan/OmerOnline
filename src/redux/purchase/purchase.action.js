import PurchaseActionType from './purchase.type';
import inventoryService from '../../services/inventory.service';
import dateFormat from 'date-fns/format'


export const fetchPurchaseStart = () =>({
    type:PurchaseActionType.FETCH_PURCHASE_START
});

export const fetchPurchaseSuccess = purchaseMap =>({
    type:PurchaseActionType.FETCH_PURCHASE_SUCCESS,
    payload:purchaseMap
});

export const fetchPurchaseFailure = errorMessage => ({
    type:PurchaseActionType.FETCH_PURCHASE_FAILURE,
    payload:errorMessage
})


export const fetchEditPurchaseStart = () => ({
    type: PurchaseActionType.FETCH_EDITPURCHASE_START
});

export const fetchEditPurchaseSuccess = saleMap => ({
    type: PurchaseActionType.FETCH_EDITPURCHASE_SUCCESS,
    payload: saleMap
});

export const fetchEditPurchaseFailure = errorMessage => ({
    type: PurchaseActionType.FETCH_EDITPURCHASE_FAILURE,
    payload: errorMessage
})



export const fetchPurchaseInvoiceDetail = purchaseMap => ({
    type: PurchaseActionType.FETCH_PURCHASEINVOICEDETAIL_SUCCESS,
    payload: purchaseMap
});



export const fetchPurchaseAPSuccess = purchaseMap =>({
    type:PurchaseActionType.FETCH_PURCHASEAP_SUCCESS,
    payload:purchaseMap
});

export const fetchPurInvPayDeatilSuccess = purchaseMap =>({
    type:PurchaseActionType.FETCH_PURINVPAYDETIAL_SUCCESS,
    payload:purchaseMap
});




export const setCurrentPurchase= purchase =>({
    type:PurchaseActionType.SET_CURRENT_PURCHASE,
    payload:purchase
})

export const fetchPurchaseSummaryStart = () => ({
    type: PurchaseActionType.FETCH_PURCHASESUMMARY_START
});

export const fetchPurchaseSummarySuccess = saleMap => ({
    type: PurchaseActionType.FETCH_PURCHASESUMMARY_SUCCESS,
    payload: saleMap
});

export const fetchPurchaseSummaryFailure = errorMessage => ({
    type: PurchaseActionType.FETCH_PURCHASE_FAILURE,
    payload: errorMessage
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


export const fetchPurchaseByDate = (sDate, eDate, customerId) => {
        return dispatch =>{
            if (sDate !== "" && eDate !== "") {
               // var dateFormat = require('dateformat');
               sDate = dateFormat(new Date(sDate), "yyyy-M-dd");
               eDate = dateFormat(new Date(eDate), "yyyy-M-dd");
               var myDate = new Date(eDate);
               myDate.setDate(myDate.getDate() + 1);
              myDate = dateFormat(myDate, "yyyy-M-dd");
               eDate = myDate;
                // var now = new Date();
               // dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");
               console.log(`sDate=${sDate} 
               edate=${eDate}
               customerid =${customerId}`);
               // f = firestore.collection('SaleInvoice')
                // .where("dt", '>=', sDate)
                // .where("dt", '<=',eDate);
           // const collectionRef = firestore.collection('PurchaseInvoice');
           dispatch (fetchPurchaseStart());
           inventoryService.getAllPurchaseByDate(sDate, eDate, customerId)
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


     
export const fetchPurchaseAP = () => {
            return dispatch => {
                //const collectionRef = firestore.collection('PurchaseInvoice').where("supplierId", "==", userId);
                dispatch(fetchPurchaseStart());
                inventoryService.getPurchaseAP()
                    .then(response => {
                        const purchaseMap = response.data;
                        //console.log(purchaseMap)
                        dispatch(fetchPurchaseAPSuccess(purchaseMap));
                    })
                    .catch(error => dispatch(fetchPurchaseFailure((error.response.request.response.message))))
            }
        }

        export const fetchPurchaseInvoiceDetailAsync = (PurchaseInvoiceId) => {
            //console.log(`Sale Invoce ID = ${SaleInvoiceId}`);
            return dispatch => {
                //const collectionRef = firestore.collection('SaleInvoiceDetail').where("SaleInvoiceId", "==", SaleInvoiceId);
                dispatch(fetchPurchaseStart());
                inventoryService.getAllPurchaseDetailByInvoice(PurchaseInvoiceId)
                    .then(response => {
                        const purchaseMap = response.data;
                        // console.log(saleMap);
                        dispatch(fetchPurchaseInvoiceDetail(purchaseMap));
                    })
                    .catch(error=> dispatch(fetchPurchaseFailure((error.response.request.response.message))))
            }
        }

        export const fetchPurchaseByDateSummary = (sDate, eDate) => {
            return dispatch => {
                if (sDate !== "" && eDate !== "") {
                   // var dateFormat = require('dateformat');
                   sDate = dateFormat(new Date(sDate), "yyyy-M-dd");
                   eDate = dateFormat(new Date(eDate), "yyyy-M-dd");
                   var myDate = new Date(eDate);
                   myDate.setDate(myDate.getDate() + 1);
                  myDate = dateFormat(myDate, "yyyy-M-dd");
                   eDate = myDate;
        
                    dispatch(fetchPurchaseSummaryStart());
                    inventoryService.getAllPurchaseByDateSummary(sDate, eDate)
                        .then(response => {
                            const saleMap = response.data;
                            dispatch(fetchPurchaseSummarySuccess(saleMap));
                        })
                        .catch(error => dispatch(fetchPurchaseSummaryFailure(error.response.request.response.message)))
                        ;
                }
            }
        }


        export const fetchEditPurchase = (sDate, eDate,itemId,invoiceId) => {
            return dispatch => {
                if (sDate !== "" && eDate !== "") {
                    //var dateFormat = require('dateformat');
                    sDate = dateFormat(new Date(sDate), "yyyy-M-dd");
                    eDate = dateFormat(new Date(eDate), "yyyy-M-dd");
                    var myDate = new Date(eDate);
                    myDate.setDate(myDate.getDate() + 1);
                   myDate = dateFormat(myDate, "yyyy-M-dd");
                    eDate = myDate;
        
                    console.log(`sDate=${sDate} 
                    edate=${eDate}
                    itemid =${itemId}
                    invoiceid =${invoiceId}
                    `);
        
                    dispatch(fetchEditPurchaseStart());
                    inventoryService.getAllEditPurchase(sDate, eDate,itemId,invoiceId)
                        .then(response => {
                            const saleMap = response.data;
                            //console.log(response.data)
                            dispatch(fetchEditPurchaseSuccess(saleMap));
                        })
                        .catch(error => dispatch(fetchEditPurchaseFailure(error.response.request.response.message)))
                        ;
                }
            }
        }
        

