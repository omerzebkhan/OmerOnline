import CartActionType from './cart.types';
import cartService from "../../services/cart.services";

export const fetchCartStart = () =>({
    type:CartActionType.FETCH_CART_START
});

export const fetchCartSuccess = cartMap =>({
    type:CartActionType.FETCH_CART_SUCCESS,
    payload:cartMap
});

export const fetchCartFailure = errorMessage => ({
    type:CartActionType.FETCH_CART_FAILURE,
    payload:errorMessage
})

export const setCurrentCart = cart =>({
    type:CartActionType.SET_CURRENT_CART,
    payload:cart
})

export const fetchCartStartAsync = () => {
    return dispatch =>{

        dispatch (fetchCartStart());
        cartService.getAll()
          .then(response => {
            const brandMap = response.data;
            console.log(brandMap);
            dispatch(fetchCartSuccess(brandMap)); 

          })
          .catch(error=>dispatch(fetchCartFailure(error.response.request.response.message)));
        

    }
}

export const fetchCartDetailByCust = (custId) => {
    return dispatch =>{

        dispatch (fetchCartStart());
        cartService.getCartDetailByCust(custId)
          .then(response => {
            const cartMap = response.data;
            console.log(cartMap);
            dispatch(fetchCartSuccess(cartMap)); 

          })
          .catch(error=>dispatch(fetchCartFailure(error.response.request.response.message)));
        

    }
}
