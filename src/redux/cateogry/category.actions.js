import CategoryActionType from './category.types';
import categoryService from "../../services/category.services";

export const fetchCategoryStart = () =>({
    type:CategoryActionType.FETCH_CATEGORY_START
});

export const setCurrentCategory= category =>({
    type:CategoryActionType.SET_CURRENT_CATEGORY,
    payload:category
})

export const fetchCategorySuccess = CategoryMap =>({
    type:CategoryActionType.FETCH_CATEGORY_SUCCESS,
    payload:CategoryMap
});

export const fetchCategoryFailure = errorMessage => ({
    type:CategoryActionType.FETCH_CATEGORY_FAILURE,
    payload:errorMessage
})

export const fetchCategoryStartAsync = () => {
    return dispatch =>{

         dispatch (fetchCategoryStart());
        categoryService.getAll()
          .then(response => {
            const categoryMap = response.data;
            console.log(categoryMap);
            dispatch(fetchCategorySuccess(categoryMap)); 

          })
          .catch(error=>dispatch(fetchCategoryFailure(error.response.request.response.message)))
          ;
 

    }
}

