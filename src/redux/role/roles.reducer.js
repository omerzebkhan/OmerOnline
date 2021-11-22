

import RoleActionType from './roles.types';
const INITIAL_STATE ={
    roles:null,
    currentRole:null,
    isFetching:false,
    errorMessage: undefined
}

const roleReducer = (state = INITIAL_STATE,action) =>{
    switch(action.type){
        case RoleActionType.SET_CURRENT_ROLE:
            return{
                ...state,
                currentRole:action.payload
            }
        case RoleActionType.FETCH_ROLES_START:
            return{
                ...state,
                isFetching:true
            }

        case RoleActionType.FETCH_ROLES_SUCCESS:
            return{
                ...state,
                isFetching:false,
                roles:action.payload
            }
        case RoleActionType.FETCH_ROLES_FAILURE:
            return{
                ...state,
                errorMessage:action.payload
            }    
        default:
            return state;
    }
}

export default roleReducer;