import BrandActionType from './brands.types';
import brandService from "../../services/brand.service";

export const fetchBrandStart = () =>({
    type:BrandActionType.FETCH_BRANDS_START
});

export const fetchBrandSuccess = brandMap =>({
    type:BrandActionType.FETCH_BRANDS_SUCCESS,
    payload:brandMap
});

export const fetchBrandFailure = errorMessage => ({
    type:BrandActionType.FETCH_BRANDS_FAILURE,
    payload:errorMessage
})

export const setCurrentBrand = brand =>({
    type:BrandActionType.SET_CURRENT_BRAND,
    payload:brand
})

export const clearCurrentBrand = () => ({
  type: BrandActionType.CLEAR_CURRENT_BRAND,
});

export const fetchBrandStartAsync = () => {
    return dispatch =>{

        dispatch (fetchBrandStart());
        brandService.getAll()
          .then(response => {
            const brandMap = response.data;
            console.log(brandMap);
            dispatch(fetchBrandSuccess(brandMap)); 

          })
          //.catch(error=>dispatch(fetchBrandFailure(error.response.request.response.message)));
          //.catch(error=>dispatch(fetchBrandFailure(error.response.data.message)));
          .catch(error=>dispatch(fetchBrandFailure(error.response.data.message)));

    }
}

