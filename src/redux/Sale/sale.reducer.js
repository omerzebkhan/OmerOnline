import SaleActionType from './sale.type';
const INITIAL_STATE = {
    salePayHist: null,
    saleReturn: null,
    saleReturnDetail: null,
    sale: null,
    editSale: null,
    saleSummary: null,
    saleInvoiceDetail: null,
    saleAR: null,
    salePayDetail: null,
    currentSale: null,
    isFetching: false,
    errorMessage: undefined
}

const saleReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SaleActionType.SET_CURRENT_SALE:
            return {
                ...state,
                currentSale: action.payload
            }
        case SaleActionType.FETCH_SALE_START:
            return {
                ...state,
                isFetching: true
            }
        case SaleActionType.FETCH_SALE_SUCCESS:
            return {
                ...state,
                isFetching: false,
                sale: action.payload
            }
        case SaleActionType.FETCH_SALE_FAILURE:
            return {
                ...state,
                errorMessage: action.payload
            }
        case SaleActionType.FETCH_EDITSALE_START:
            return {
                ...state,
                isFetching: true
            }
        case SaleActionType.FETCH_EDITSALE_SUCCESS:
            return {
                ...state,
                isFetching: false,
                editSale: action.payload
            }
        case SaleActionType.FETCH_EDITSALE_FAILURE:
            return {
                ...state,
                errorMessage: action.payload
            }
        case SaleActionType.FETCH_SALEPAYHIST_SUCCESS:
            return {
                ...state,
                isFetching: false,
                salePayHist: action.payload
            }
        case SaleActionType.FETCH_SALERETURN_SUCCESS:
            return {
                ...state,
                isFetching: false,
                saleReturn: action.payload
            }
        case SaleActionType.FETCH_SALERETURNDETAIL_SUCCESS:
            return {
                ...state,
                isFetching: false,
                saleReturnDetail: action.payload
            }

        case SaleActionType.FETCH_SALESUMMARY_SUCCESS:
            return {
                ...state,
                isFetching: false,
                saleSummary: action.payload
            }
        case SaleActionType.FETCH_SALINVPAYDETIAL_SUCCESS:
            return {
                ...state,
                isFetching: false,
                salInvPayDetail: action.payload
            }
        case SaleActionType.FETCH_SALEINVOICEDETAIL_SUCCESS:
            return {
                ...state,
                isFetching: false,
                saleInvoiceDetail: action.payload
            }

        case SaleActionType.FETCH_SALEAR_SUCCESS:
            return {
                ...state,
                isFetching: false,
                saleAR: action.payload
            }


        default:
            return state;
    }
}

export default saleReducer;