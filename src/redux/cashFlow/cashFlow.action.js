import CashFlowActionType from './cashFlow.type';
import CashFlowService from "../../services/cashFlow.services";
import dateFormat from 'date-fns/format'
import cashFlowServices from '../../services/cashFlow.services';


export const fetchCashFlowStart = () => ({
    type: CashFlowActionType.FETCH_CASHFLOW_START
});

export const fetchCashFlowSuccess = cashFlowMap => ({
    type: CashFlowActionType.FETCH_CASHFLOW_SUCCESS,
    payload: cashFlowMap
});

export const fetchCashFlowARSuccess = cashFlowMap => ({
    type: CashFlowActionType.FETCH_CASHFLOWAR_SUCCESS,
    payload: cashFlowMap
});

export const fetchCashFlowAPSuccess = cashFlowMap => ({
    type: CashFlowActionType.FETCH_CASHFLOWAP_SUCCESS,
    payload: cashFlowMap
});

export const fetchCashFlowFailure = errorMessage => ({
    type: CashFlowActionType.FETCH_CASHFLOW_FAILURE,
    payload: errorMessage
})

export const fetchCashFlowPaySuccess = saleMap => ({
    type: CashFlowActionType.FETCH_CASHFLOWPAY_SUCCESS,
    payload: saleMap
});

export const fetchSaleARSuccess = saleMap => ({
    type: CashFlowActionType.FETCH_CASHFLOWAR_SUCCESS,
    payload: saleMap
})

export const fetchSaleAPSuccess = saleMap => ({
    type: CashFlowActionType.FETCH_CASHFLOWAAP_SUCCESS,
    payload: saleMap
})

export const fetchCashFlowAR = () => {
    return dispatch => {
        //const collectionRef = firestore.collection('PurchaseInvoice').where("supplierId", "==", userId);
        dispatch(fetchCashFlowStart());
        cashFlowServices.getCashFlow('AR')
            .then(response => {
                const cashFlowMap = response.data;
               // console.log(saleMap)
                dispatch(fetchCashFlowARSuccess(cashFlowMap));
            })
            .catch(error => dispatch(fetchCashFlowFailure((error.response.request.response.message))))
    }
}

export const fetchCashFlowAP = () => {
    return dispatch => {
        //const collectionRef = firestore.collection('PurchaseInvoice').where("supplierId", "==", userId);
        dispatch(fetchCashFlowStart());
        cashFlowServices.getCashFlow('AP')
            .then(response => {
                const cashFlowMap = response.data;
               // console.log(saleMap)
                dispatch(fetchCashFlowAPSuccess(cashFlowMap));
            })
            .catch(error => dispatch(fetchCashFlowFailure((error.response.request.response.message))))
    }
}

export const fetchCashFlowPay = (invoiceId) => {
    //console.log(`redux method is called ${invoiceId }`)
    return dispatch => {
        //const collectionRef = firestore.collection('PurchaseInvoice').where("supplierId", "==", userId);
        dispatch(fetchCashFlowStart());
        cashFlowServices.getCashFlowPay(invoiceId)
            .then(response => {
                const cashFlowMap = response.data;
               // console.log(saleMap)
                dispatch(fetchCashFlowPaySuccess(cashFlowMap));
            })
            .catch(error => dispatch(fetchCashFlowFailure((error.response.request.response.message))))
    }
}

