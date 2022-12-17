import CashFlowActionType from './cashFlow.type';
const INITIAL_STATE = {
    cashFlow: null,
    cashFlowAR: null,
    cashFlowAP: null,
    cashFlowPay: null,
    currentSale: null,
    isFetching: false,
    errorMessage: undefined
}

const cashFlowReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CashFlowActionType.FETCH_CASHFLOW_START:
            return {
                ...state,
                isFetching: true
            }
            
        case CashFlowActionType.FETCH_CASHFLOW_SUCCESS:
            return {
                ...state,
                isFetching: false,
                cashFlow: action.payload
            }
        
        case CashFlowActionType.FETCH_CASHFLOWAR_SUCCESS:
            return {
                ...state,
                isFetching: false,
                cashFlowAR: action.payload
            }
            case CashFlowActionType.FETCH_CASHFLOWAP_SUCCESS:
                return {
                    ...state,
                    isFetching: false,
                    cashFlowAP: action.payload
                }    
            case CashFlowActionType.FETCH_CASHFLOWPAY_SUCCESS:
            return {
                ...state,
                isFetching: false,
                cashFlowPay: action.payload
            }

        case CashFlowActionType.FETCH_CASHFLOW_FAILURE:
            return {
                ...state,
                errorMessage: action.payload
            }
        default:
            return state;
    }
}

export default cashFlowReducer;