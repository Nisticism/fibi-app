import {
  LIST_USERS,
  LIST_USERS_FAIL,
  SET_MESSAGE,
} from "./types";
import UsersService from "../services/users.service";

export const users = () => (dispatch) => {
  return UsersService.getUsers().then(
    (response) => {
      console.log("users action");
      dispatch({
        type: LIST_USERS,
        payload: response.data,
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
        type: LIST_USERS_FAIL,
      });
      return Promise.reject();
    }
  );
};