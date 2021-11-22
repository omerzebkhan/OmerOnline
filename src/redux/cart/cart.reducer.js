

import CartActionType from './cart.types';
const INITIAL_STATE ={
    carts:null,
    currentCart:null,
    isFetching:false,
    errorMessage: undefined
}

const cartReducer = (state = INITIAL_STATE,action) =>{
    switch(action.type){
        case CartActionType.SET_CURRENT_CART:
            return{
                ...state,
                currentCart:action.payload
            }
        case CartActionType.FETCH_CART_START:
            return{
                ...state,
                isFetching:true
            }

        case CartActionType.FETCH_CART_SUCCESS:
            return{
                ...state,
                isFetching:false,
                carts:action.payload
            }
        case CartActionType.FETCH_CART_FAILURE:
            return{
                ...state,
                errorMessage:action.payload
            }    
        default:
            return state;
    }
}

export default cartReducer;