

import ExpenseActionType from './expense.types';
const INITIAL_STATE ={
    expense:null,
    currentExpense:null,
    isFetching:false,
    errorMessage: undefined
}

const expenseReducer = (state = INITIAL_STATE,action) =>{
    switch(action.type){
        case ExpenseActionType.SET_CURRENT_EXPENSE:
            return{
                ...state,
                currentExpense:action.payload
            }
        case ExpenseActionType.FETCH_EXPENSE_START:
            return{
                ...state,
                isFetching:true
            }

        case ExpenseActionType.FETCH_EXPENSE_SUCCESS:
            return{
                ...state,
                isFetching:false,
                expense:action.payload
            }
        case ExpenseActionType.FETCH_EXPENSE_FAILURE:
            return{
                ...state,
                errorMessage:action.payload
            }    
        default:
            return state;
    }
}

export default expenseReducer;