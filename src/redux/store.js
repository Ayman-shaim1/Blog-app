import { createStore, applyMiddleware, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { alertReducer } from "./alert/alertReducers";
import { geoDataReducer } from "./geoData/geoDataReducers";

// Initial state :
const initialState = {};

// Reducers :
const reducer = combineReducers({
  alert: alertReducer,
  geoData: geoDataReducer,
});
// Create Store :
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(thunk))
);
export default store;
