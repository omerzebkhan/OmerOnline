

import SubCategoryActionType from './subCategory.types';
const INITIAL_STATE ={
    subCategory:null,
    currentSubCategory:null,
    isFetching:false,
    errorMessage: undefined
}

const subCategoryReducer = (state = INITIAL_STATE,action) =>{
    switch(action.type){
        case SubCategoryActionType.SET_CURRENT_SUBCATEGORY:
            return{
                ...state,
                currentSubCategory:action.payload
            }
        case SubCategoryActionType.FETCH_SUBCATEGORY_START:
            return{
                ...state,
                isFetching:true
            }

        case SubCategoryActionType.FETCH_SUBCATEGORY_SUCCESS:
            return{
                ...state,
                isFetching:false,
                subCategory:action.payload
            }
        case SubCategoryActionType.FETCH_SUBCATEGORY_FAILURE:
            return{
                ...state,
                errorMessage:action.payload
            }    
        default:
            return state;
    }
}

export default subCategoryReducer;