import SubCategoryActionType from './subCategory.types';
import subCategoriesService from "../../services/subCategory";


export const fetchSubCategoryStart = () =>({
    type:SubCategoryActionType.FETCH_SUBCATEGORY_START
});

export const fetchSubCategorySuccess = subCategoryMap =>({
    type:SubCategoryActionType.FETCH_SUBCATEGORY_SUCCESS,
    payload:subCategoryMap
});

export const fetchSubCategoryFailure = errorMessage => ({
    type:SubCategoryActionType.FETCH_SUBCATEGORY_FAILURE,
    payload:errorMessage
})

export const setCurrentSubCategory = subCategory =>({
    type:SubCategoryActionType.SET_CURRENT_SUBCATEGORY,
    payload:subCategory
})

export const fetchSubCategoryStartAsync = (categoryId) => {
    console.log(categoryId);
    return dispatch =>{

    //     const collectionRef = firestore.collection('SubCategory').where("Category", "==", categoryId);
        dispatch (fetchSubCategoryStart());
        subCategoriesService.get(categoryId)
        .then(response => {
          const subCategoryMap = response.data;
          console.log(subCategoryMap);
          dispatch(fetchSubCategorySuccess(subCategoryMap)); 

        })
         .catch(error=>dispatch(fetchSubCategoryFailure(error.response.request.response.message)));
    }
}

export const fetchAllSubCategoryStartAsync = () => {
     return dispatch =>{
       

        dispatch (fetchSubCategoryStart());
        subCategoriesService.getAll()
        .then(response => {
          const subCategoryMap = response.data;
          console.log(subCategoryMap);
          dispatch(fetchSubCategorySuccess(subCategoryMap)); 

        })
         .catch(error=>dispatch(fetchSubCategoryFailure(error.message)));
     }
}



