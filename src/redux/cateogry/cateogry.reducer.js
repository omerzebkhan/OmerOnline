

import CategoryActionType from './category.types';
const INITIAL_STATE ={
    category:null,
    currentCategory:null,
    isFetching:false,
    errorMessage: undefined
}

const categoryReducer = (state = INITIAL_STATE,action) =>{
    switch(action.type){
        case CategoryActionType.SET_CURRENT_CATEGORY:
            return{
                ...state,
                currentCategory:action.payload
            }
        case CategoryActionType.FETCH_CATEGORY_START:
            return{
                ...state,
                isFetching:true
            }

        case CategoryActionType.FETCH_CATEGORY_SUCCESS:
            return{
                ...state,
                isFetching:false,
                category:action.payload
            }
        case CategoryActionType.FETCH_CATEGORY_FAILURE:
            return{
                ...state,
                errorMessage:action.payload
            }    
        default:
            return state;
    }
}

export default categoryReducer;