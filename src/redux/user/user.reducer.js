
import UserActionType from './user.types';
const user = JSON.parse(localStorage.getItem("user"));



const INITIAL_STATE = 
{
    users: null,
    currentUser: null,
    isFetching: false,
    errorMessage: undefined,
    message:null,
    user : user ? { isLoggedIn: true, user }:{ isLoggedIn: false, user: null }
}

const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case UserActionType.SET_CURRENT_USER:
            return {
                ...state,
                currentUser: action.payload
            }
        case UserActionType.FETCH_USER_START:
            return {
                ...state,
                isFetching: true
            }

        case UserActionType.FETCH_USER_SUCCESS:
            return {
                ...state,
                isFetching: false,
                users: action.payload
            }
        case UserActionType.FETCH_USER_FAILURE:
            return {
                ...state,
                errorMessage: action.payload
            }
        case UserActionType.SET_MESSAGE:
            return { 
                ...state,
                message: action.payload 
            };

        case UserActionType.CLEAR_MESSAGE:
            return {
                ...state, 
                message: "" };
        default:
            return state;
    }
}

export default userReducer;