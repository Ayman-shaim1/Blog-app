import { createStore, applyMiddleware, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { alertReducer } from "./alert/alertReducers";
// Initial state :
const initialState = {};

// Reducers :
const reducer = combineReducers({
  alert: alertReducer,
});
// Create Store :
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(thunk))
);
export default store;
