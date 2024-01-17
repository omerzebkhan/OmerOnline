import PurchaseActionType from './purchase.type';
const INITIAL_STATE = {
    purchase: null,
    editPurchase: null,
    purchaseSummary: null,
    purchaseInvoiceDetail: null,
    purchaseAR: null,
    purInvPayDetail: null,
    currentPurchase: null,
    isFetching: false,
    errorMessage: undefined
}

const purchaseReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case PurchaseActionType.SET_CURRENT_PURCHASE:
            return {
                ...state,
                currentPurchase: action.payload
            }
        case PurchaseActionType.FETCH_PURCHASE_START:
            return {
                ...state,
                isFetching: true
            }
        case PurchaseActionType.FETCH_PURCHASE_SUCCESS:
                return {
                    ...state,
                    isFetching: false,
                    purchase: action.payload
                }
        case PurchaseActionType.FETCH_PURCHASE_FAILURE:
                    return {
                        ...state,
                        errorMessage: action.payload
                    }

        case PurchaseActionType.FETCH_EDITPURCHASE_START:
                return {
                    ...state,
                    isFetching: true
                }
        case PurchaseActionType.FETCH_EDITPURCHASE_SUCCESS:
                return {
                    ...state,
                    isFetching: false,
                    editPurchase: action.payload
                }
        case PurchaseActionType.FETCH_EDITPURCHASE_FAILURE:
                return {
                    ...state,
                    errorMessage: action.payload
                }    
        case PurchaseActionType.FETCH_PURCHASEINVOICEDETAIL_SUCCESS:
            return {
                ...state,
                isFetching: false,
                purchaseInvoiceDetail: action.payload
            }

        
        case PurchaseActionType.FETCH_PURCHASESUMMARY_SUCCESS:
            return {
                ...state,
                isFetching: false,
                purchaseSummary: action.payload
            }
        case PurchaseActionType.FETCH_PURCHASEAP_SUCCESS:
            return {
                ...state,
                isFetching: false,
                purchaseAP: action.payload
            }
        case PurchaseActionType.FETCH_PURINVPAYDETIAL_SUCCESS:
            return {
                ...state,
                isFetching: false,
                purInvPayDetail: action.payload
            }
        
        default:
            return state;
    }
}

export default purchaseReducer;