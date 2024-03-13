import {
  LIST_USERS,
  LIST_USERS_FAIL,
  REMOVE_USERS,
} from "../actions/types";

const initialState = {};
  
export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case LIST_USERS:
      return {
        ...state,
        usersList: payload,
      };
    case LIST_USERS_FAIL:
      return {
        ...state,
        usersList: null,
        message: "User list failed",
      };
    case REMOVE_USERS:
      const newState = {...state};
      delete newState["usersList"];
      return newState;
    default:
      return state;
  }
}