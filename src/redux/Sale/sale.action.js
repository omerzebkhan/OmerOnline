import SaleActionType from './sale.type';
import inventoryService from "../../services/inventory.service";
import dateFormat from 'date-fns/format'


export const fetchSaleStart = () => ({
    type: SaleActionType.FETCH_SALE_START
});

export const fetchSaleSuccess = saleMap => ({
    type: SaleActionType.FETCH_SALE_SUCCESS,
    payload: saleMap
});

export const fetchSaleFailure = errorMessage => ({
    type: SaleActionType.FETCH_SALE_FAILURE,
    payload: errorMessage
})

export const fetchSaleReturnStart = () => ({
    type: SaleActionType.FETCH_SALERETURN_START
});

export const fetchSaleReturnSuccess = saleMap => ({
    type: SaleActionType.FETCH_SALERETURN_SUCCESS,
    payload: saleMap
});

export const fetchSaleReturnFailure = errorMessage => ({
    type: SaleActionType.FETCH_SALERETURN_FAILURE,
    payload: errorMessage
})

export const fetchSaleReturnDetailStart = () => ({
    type: SaleActionType.FETCH_SALERETURNDETAIL_START
});

export const fetchSaleReturnDetailSuccess = saleMap => ({
    type: SaleActionType.FETCH_SALERETURNDETAIL_SUCCESS,
    payload: saleMap
});

export const fetchSaleReturnDetailFailure = errorMessage => ({
    type: SaleActionType.FETCH_SALERETURNDETAIL_FAILURE,
    payload: errorMessage
})

export const fetchSaleSummaryStart = () => ({
    type: SaleActionType.FETCH_SALESUMMARY_START
});

export const fetchSaleSummarySuccess = saleMap => ({
    type: SaleActionType.FETCH_SALESUMMARY_SUCCESS,
    payload: saleMap
});

export const fetchSaleSummaryFailure = errorMessage => ({
    type: SaleActionType.FETCH_SALE_FAILURE,
    payload: errorMessage
})


export const fetchSaleInvoiceDetail = saleMap => ({
    type: SaleActionType.FETCH_SALEINVOICEDETAIL_SUCCESS,
    payload: saleMap
});

export const fetchSalInvPayDeatilSuccess = saleMap => ({
    type: SaleActionType.FETCH_SALINVPAYDETIAL_SUCCESS,
    payload: saleMap
});

export const fetchSalePayHisSuccess = saleMap => ({
    type : SaleActionType.FETCH_SALEPAYHIST_SUCCESS,
    payload : saleMap
})

export const FETCH_SALEPAYHIST_FAILURE = errorMessage => ({
    type: SaleActionType.FETCH_SALEPAYHIST_FAILURE,
    payload: errorMessage
})

export const fetchSaleARSuccess = saleMap => ({
    type: SaleActionType.FETCH_SALEAR_SUCCESS,
    payload: saleMap
})



export const setCurrentSale = sale => ({
    type: SaleActionType.SET_CURRENT_SALE,
    payload: sale
})

export const fetchSaleStartAsync = (sDate, eDate) => {
    return dispatch => {
        //var f = "";
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
            // console.log(`sDate=${sDate} 
            // edate=${eDate}`);
            // //          f = firestore.collection('SaleInvoice')
            //             .where("dt", '>=', sDate)
            //             .where("dt", '<=',eDate);
        }
        else {
            //  f = firestore.collection('SaleInvoice');
        }

        //const collectionRef = f;
        //const collectionRef = firestore.collection('SaleInvoice');
        dispatch(fetchSaleStart());
        // collectionRef.get()
        // .then (snapshot =>{
        //         const saleMap = convertSaleSnapshotToMap(snapshot);
        //         dispatch(fetchSaleSuccess(saleMap));          
        //  })
        //  .catch(error=>dispatch(fetchSaleFailure(error.message)));
    }
}

export const fetchSaleByIdAsync = (invoiceId) => {
    return dispatch => {

        dispatch(fetchSaleStart());
        inventoryService.getSale(invoiceId)
            .then(response => {
                const saleMap = response.data;
                //    console.log(saleMap);
                dispatch(fetchSaleSuccess(saleMap));
            })
            .catch(error => dispatch(fetchSaleFailure(error.message)));

    }
}

export const fetchSaleByDate = (sDate, eDate, customerId,agentId) => {
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
            customerid =${customerId}`);

            dispatch(fetchSaleStart());
            inventoryService.getAllSaleByDate(sDate, eDate, customerId,agentId)
                .then(response => {
                    const saleMap = response.data;
                    dispatch(fetchSaleSuccess(saleMap));
                })
                .catch(error => dispatch(fetchSaleFailure(error.response.request.response.message)))
                ;
        }
    }
}

export const fetchSaleReturnByDate = (sDate,eDate) =>{
    return dispatch => {
        if (sDate !== "" && eDate !== "") {
           // var dateFormat = require('dateformat');
           sDate = dateFormat(new Date(sDate), "yyyy-M-dd");
           eDate = dateFormat(new Date(eDate), "yyyy-M-dd");
           var myDate = new Date(eDate);
           myDate.setDate(myDate.getDate() + 1);
          myDate = dateFormat(myDate, "yyyy-M-dd");
           eDate = myDate;
            dispatch(fetchSaleReturnStart());
            inventoryService.getAllSaleReturnByDate(sDate, eDate)
                .then(response => {
                    const saleMap = response.data;
                    dispatch(fetchSaleReturnSuccess(saleMap));
                })
                .catch(error => dispatch(fetchSaleReturnFailure(error.response.request.response.message)))
                ;
        }
    }

}

export const fetchSaleReturnDetail = (SaleInvoiceId) => {
    return dispatch => {
        dispatch(fetchSaleReturnDetailStart());
        inventoryService.getSaleReturnDetailByInvoice(SaleInvoiceId)
            .then(response => {
                const saleMap = response.data;
                // console.log(saleMap);
                dispatch(fetchSaleReturnDetailSuccess(saleMap));
            })
            .catch(error => dispatch(fetchSaleReturnDetailFailure((error.response.request.response.message))))
    }
}

export const fetchSaleByDateSummary = (sDate, eDate) => {
    return dispatch => {
        if (sDate !== "" && eDate !== "") {
           // var dateFormat = require('dateformat');
           sDate = dateFormat(new Date(sDate), "yyyy-M-dd");
           eDate = dateFormat(new Date(eDate), "yyyy-M-dd");
           var myDate = new Date(eDate);
           myDate.setDate(myDate.getDate() + 1);
          myDate = dateFormat(myDate, "yyyy-M-dd");
           eDate = myDate;

            dispatch(fetchSaleSummaryStart());
            inventoryService.getAllSaleByDateSummary(sDate, eDate)
                .then(response => {
                    const saleMap = response.data;
                    dispatch(fetchSaleSummarySuccess(saleMap));
                })
                .catch(error => dispatch(fetchSaleSummaryFailure(error.response.request.response.message)))
                ;
        }
    }
}

export const fetchSalInvPayDetial = (invoiceId) => {
    //console.log(`redux method is called ${invoiceId }`)
    return dispatch => {
        //const collectionRef = firestore.collection('PurchaseInvoice').where("supplierId", "==", userId);
        dispatch(fetchSaleStart());
        inventoryService.getSalInvPay(invoiceId)
            .then(response => {
                const saleMap = response.data;
               // console.log(saleMap)
                dispatch(fetchSalInvPayDeatilSuccess(saleMap));
            })
            .catch(error => dispatch(fetchSaleFailure((error.response.request.response.message))))
    }
}

export const fetchSaleAR = () => {
    return dispatch => {
        //const collectionRef = firestore.collection('PurchaseInvoice').where("supplierId", "==", userId);
        dispatch(fetchSaleStart());
        inventoryService.getSaleAR()
            .then(response => {
                const saleMap = response.data;
               // console.log(saleMap)
                dispatch(fetchSaleARSuccess(saleMap));
            })
            .catch(error => dispatch(fetchSaleFailure((error.response.request.response.message))))
    }
}

export const fetchSalePayHist = (custId) =>{
     //console.log(`redux method is called ${invoiceId }`)
     return dispatch => {
        dispatch(fetchSaleStart());
        inventoryService.getSalePayHist(custId)
            .then(response => {
                const saleMap = response.data;
                //console.log(saleMap)
                dispatch(fetchSalePayHisSuccess(saleMap));
            })
            .catch(error => dispatch( FETCH_SALEPAYHIST_FAILURE((error.response.request.response.message))))
    }
}

export const fetchSaleByInputStartAsync = (userId) => {
    return dispatch => {

        dispatch(fetchSaleStart());
        inventoryService.getAllSaleByCustId(userId)
            .then(response => {
                const saleMap = response.data;
                dispatch(fetchSaleSuccess(saleMap));
            })
            .catch(error => dispatch(fetchSaleFailure((error.response.request.response.message))))
    }
}

export const fetchSaleInvoiceDetailAsync = (SaleInvoiceId) => {
    //console.log(`Sale Invoce ID = ${SaleInvoiceId}`);
    return dispatch => {
        //const collectionRef = firestore.collection('SaleInvoiceDetail').where("SaleInvoiceId", "==", SaleInvoiceId);
        dispatch(fetchSaleStart());
        inventoryService.getAllSaleDetailByInvoice(SaleInvoiceId)
            .then(response => {
                const saleMap = response.data;
                // console.log(saleMap);
                dispatch(fetchSaleInvoiceDetail(saleMap));
            })
            .catch(error => dispatch(fetchSaleFailure((error.response.request.response.message))))
    }
}



