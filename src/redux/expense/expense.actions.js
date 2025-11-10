import ExpenseActionType from './expense.types';
import expenseService from "../../services/expense.service";

export const fetchExpenseStart = () =>({
    type:ExpenseActionType.FETCH_EXPENSE_START
});

export const fetchExpenseSuccess = expenseMap =>({
    type:ExpenseActionType.FETCH_EXPENSE_SUCCESS,
    payload:expenseMap
});

export const fetchExpenseFailure = errorMessage => ({
    type:ExpenseActionType.FETCH_EXPENSE_FAILURE,
    payload:errorMessage
})

export const setCurrentExpense= expense =>({
    type:ExpenseActionType.SET_CURRENT_EXPENSE,
    payload:expense
})

export const fetchExpenseStartAsync = () => {
    return dispatch =>{

        dispatch (fetchExpenseStart());
        expenseService.getAll()
          .then(response => {
            const expenseMap = response.data;
            console.log(expenseMap);
            dispatch(fetchExpenseSuccess(expenseMap)); 

          })
          .catch(error=>dispatch(fetchExpenseFailure(error.response.request.response.message)));
        
    }
}

