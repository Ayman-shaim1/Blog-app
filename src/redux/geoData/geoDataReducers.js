import {
  GET_GEODATA_FAIL,
  GET_GEODATA_REQUEST,
  GET_GEODATA_SUCCESS,
  GET_GEODATA_RESET,
} from "./geoDataTypes";

export const geoDataReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_GEODATA_REQUEST:
      return { loading: true };
    case GET_GEODATA_SUCCESS:
      return { loading: false, data: action.payload };
    case GET_GEODATA_FAIL:
      return { loading: false, error: action.payload };
    case GET_GEODATA_RESET:
      return {};
    default:
      return state;
  }
};
