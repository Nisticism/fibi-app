import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  EDIT_SUCCESS,
  EDIT_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  DELETE_USER,
} from "../actions/types";

const user = JSON.parse(localStorage.getItem("user"));
const initialState = user
  ? { isLoggedIn: true, user }
  : { isLoggedIn: false, user: null};
  
export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case REGISTER_SUCCESS:
      return {
        ...state,
        isLoggedIn: false,
      };
    case REGISTER_FAIL:
      return {
        ...state,
        isLoggedIn: false,
      };
    case EDIT_SUCCESS:
      console.log("in edit reducer - edit success");
      return {
        ...state,
        user: payload.user,
      }
    case EDIT_FAIL:
      return {
        ...state,
      }
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        user: payload.user,
      };
    case LOGIN_FAIL:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
    case DELETE_USER:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      }
    default:
      return state;
  }
}