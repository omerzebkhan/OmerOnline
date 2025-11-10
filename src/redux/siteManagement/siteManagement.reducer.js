import SiteManagementActionType from './siteManagement.types';
const INITIAL_STATE ={
    HeaderImage:null,
    isFetching:false,
    errorMessage: undefined
}

const siteManagementReducer = (state = INITIAL_STATE,action) =>{
    switch(action.type){
        case SiteManagementActionType.FETCH_SITEMANAGEMENT_START:
            return{
                ...state,
                isFetching:true
            }

        case SiteManagementActionType.FETCH_SITEMANAGEMENT_SUCCESS:
            return{
                ...state,
                isFetching:false,
                HeaderImage:action.payload
            }
        case SiteManagementActionType.FETCH_SITEMANAGEMENT_FAILURE:
            return{
                ...state,
                errorMessage:action.payload
            }    
        default:
            return state;
    }
}

export default siteManagementReducer;