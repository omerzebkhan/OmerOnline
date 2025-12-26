

import BrandActionType from './brands.types';
const INITIAL_STATE ={
    brands:null,
    currentBrand:null,
    isFetching:false,
    errorMessage: undefined
}

const brandReducer = (state = INITIAL_STATE,action) =>{
    switch(action.type){
        case BrandActionType.SET_CURRENT_BRAND:
            return{
                ...state,
                currentBrand:action.payload
            }
        case BrandActionType.FETCH_BRANDS_START:
            return{
                ...state,
                isFetching:true
            }

        case BrandActionType.FETCH_BRANDS_SUCCESS:
            return{
                ...state,
                isFetching:false,
                brands:action.payload
            }
        case BrandActionType.FETCH_BRANDS_FAILURE:
            return{
                ...state,
                isFetching:false,
                errorMessage:action.payload
            } 
         case BrandActionType.CLEAR_CURRENT_BRAND:
      return {
        ...state,
        currentBrand: null,
      };   
        default:
            return state;
    }
}

export default brandReducer;