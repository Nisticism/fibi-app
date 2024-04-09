import { combineReducers } from "redux";
import auth from "./auth";
import message from "./message";
import users from "./users";
import forums from "./forums";
export default combineReducers({
  auth,
  message,
  users,
  forums,
});