import UserActionType from './user.types';
import userService from "../../services/user.service";
import AuthService from "../../services/auth.service";


export const fetchUserStart = () =>({
    type:UserActionType.FETCH_USER_START
});

export const fetchUserSuccess = userMap =>({
    type:UserActionType.FETCH_USER_SUCCESS,
    payload:userMap
});

export const fetchUserFailure = errorMessage => ({
    type:UserActionType.FETCH_USER_FAILURE,
    payload:errorMessage
});

export const setCurrentUser= user =>({
    type:UserActionType.SET_CURRENT_USER,
    payload:user
});
/////////////
////////Auth/
/////////////

export const setMessage = (message) => ({
    type: UserActionType.SET_MESSAGE,
    payload: message,
  });
  
  export const clearMessage = () => ({
    type: UserActionType.CLEAR_MESSAGE,
  });



  export const register = (username, email, password) => (dispatch) => {
    return AuthService.register(username, email, password)
    .then(
      (response) => {
        dispatch({type: UserActionType.REGISTER_SUCCESS,});
  
        dispatch({
          type: UserActionType.SET_MESSAGE,
          payload: response.data.message,
        });
  
        return Promise.resolve();
      },
      (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
  
        dispatch({
          type: UserActionType.REGISTER_FAIL,
        });
  
        dispatch({
          type: UserActionType.SET_MESSAGE,
          payload: message,
        });
  
        return Promise.reject();
      }
    );
  };

  export const login = (username, password) => (dispatch) => {
    return AuthService.login(username, password).then(
      (data) => {
        dispatch({
          type: UserActionType.LOGIN_SUCCESS,
          payload: { user: data },
        });
  
        return Promise.resolve();
      },
      (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
  
        dispatch({
          type: UserActionType.LOGIN_FAIL,
        });
  
        dispatch({
          type: UserActionType.SET_MESSAGE,
          payload: message,
        });
  
        return Promise.reject();
      }
    );
  };

  export const logout = () => (dispatch) => {
    AuthService.logout();
  
    dispatch({
      type: UserActionType.LOGOUT,
    });
  };

  /////////////////////////////////

export const fetchUserStartAsync = (params) => {
   // console.log(`page = ${params.page}   pageSize = ${params.pageSize} `)
    return dispatch =>{
       
        dispatch (fetchUserStart());
        userService.getAll(params)
        .then(response => {
          console.log(response.data)
          const userMap = response.data;
          console.log(userMap);
          dispatch(fetchUserSuccess(userMap)); 

        })
        .catch(error=>{
          dispatch(fetchUserFailure(error.response.request.response.message))
        });
        
}};

export const fetchUserByInputAsync = (id) => {
     console.log(`serching with id ${id}`)
     return dispatch =>{

        dispatch (fetchUserStart());
        userService.get(id)
        .then(response => {
          const userMap = response.data;
          //console.log(userMap);
          dispatch(fetchUserSuccess(userMap)); 

        })
        .catch(error=>dispatch(fetchUserFailure(error.response.request.response.message)));

        
 }};




