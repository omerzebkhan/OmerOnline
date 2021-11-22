
import StockActionType from './stock.types';
const INITIAL_STATE ={
    stock:null,
    currentStock:null,
    isFetching:false,
    errorMessage: undefined
}

const stockReducer = (state = INITIAL_STATE,action) =>{
    switch(action.type){
        case StockActionType.SET_CURRENT_STOCK:
            return{
                ...state,
                currentStock:action.payload
            }
        case StockActionType.FETCH_STOCK_START:
            return{
                ...state,
                isFetching:true
            }

        case StockActionType.FETCH_STOCK_SUCCESS:
            return{
                ...state,
                isFetching:false,
                stock:action.payload
            }
        case StockActionType.FETCH_STOCK_FAILURE:
            return{
                ...state,
                errorMessage:action.payload
            }    
        default:
            return state;
    }
}

export default stockReducer;