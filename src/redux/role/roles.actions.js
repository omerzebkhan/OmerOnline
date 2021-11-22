import RoleActionType from './roles.types';
import userService from "../../services/user.service";

export const fetchRoleStart = () =>({
    type:RoleActionType.FETCH_ROLES_START
});

export const fetchRoleSuccess = roleMap =>({
    type:RoleActionType.FETCH_ROLES_SUCCESS,
    payload:roleMap
});

export const fetchRoleFailure = errorMessage => ({
    type:RoleActionType.FETCH_ROLES_FAILURE,
    payload:errorMessage
})

export const setCurrentRole = role =>({
    type:RoleActionType.SET_CURRENT_ROLE,
    payload:role
})

export const fetchRoleStartAsync = () => {
    return dispatch =>{

        dispatch (fetchRoleStart());
        userService.getAllRole()
          .then(response => {
            const roleMap = response.data;
            //console.log(roleMap);
            dispatch(fetchRoleSuccess(roleMap)); 

          })
          .catch(error=>dispatch(fetchRoleFailure(error.response.request.response.message)));
        

    }
}

