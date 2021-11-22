

import ItemActionType from './item.types';
const INITIAL_STATE ={
    items:null,
    currentItem:null,
    isFetching:false,
    errorMessage: undefined
}

const itemReducer = (state = INITIAL_STATE,action) =>{
    switch(action.type){
        case ItemActionType.SET_CURRENT_ITEM:
            return{
                ...state,
                currentItem:action.payload
            }
        case ItemActionType.FETCH_ITEM_START:
            return{
                ...state,
                isFetching:true
            }

        case ItemActionType.FETCH_ITEM_SUCCESS:
            return{
                ...state,
                isFetching:false,
                items:action.payload
            }
        case ItemActionType.FETCH_ITEM_FAILURE:
            return{
                ...state,
                errorMessage:action.payload
            }    
        default:
            return state;
    }
}

export default itemReducer;