import StockActionType from './stock.types';
import {firestore,convertStockSnapshotToMap} from '../../firebase/firebase.util';

export const fetchStockStart = () =>({
    type:StockActionType.FETCH_STOCK_START
});

export const fetchStockSuccess = stockMap =>({
    type:StockActionType.FETCH_STOCK_SUCCESS,
    payload:stockMap
});

export const fetchStockFailure = errorMessage => ({
    type:StockActionType.FETCH_STOCK_FAILURE,
    payload:errorMessage
})

export const setCurrentStock= stock =>({
    type:StockActionType.SET_CURRENT_STOCK,
    payload:stock
})


export const fetchStockStartAsync = () => {
    return dispatch =>{

        const collectionRef = firestore.collection('Stock');
        dispatch (fetchStockStart());
        collectionRef.get()
        .then (snapshot =>{
                const stockMap = convertStockSnapshotToMap(snapshot);
                dispatch(fetchStockSuccess(stockMap));          
         })
         .catch(error=>dispatch(fetchStockFailure(error.response.request.response.message)));
 
    }
}

