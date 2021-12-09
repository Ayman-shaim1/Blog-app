import axios from "axios";
import {
  GET_GEODATA_REQUEST,
  GET_GEODATA_SUCCESS,
  GET_GEODATA_RESET,
} from "./geoDataTypes";

export const getGeoData = () => {
  return async (dispatch) => {
    dispatch({ type: GET_GEODATA_REQUEST });
    try {
      const IpRes = await axios.get(
        "https://api.ipify.org?format=jsonp&callback=?"
      );
      const ipAdresse = String(
        IpRes.data.split(`?({"ip":"`)[1].split(`"})`)[0]
      );

      const GeoDataRes = await axios.get(
        `https://geolocation-db.com/json/${ipAdresse}`
      );
      // console.log(GeoDataRes.data);
      dispatch({ type: GET_GEODATA_SUCCESS, payload: GeoDataRes.data });
    } catch (error) {
      dispatch({ type: GET_GEODATA_SUCCESS, payload: null });
    }
  };
};

export const resetGeoData = () => {
  return (dispatch) => {
    dispatch({ type: GET_GEODATA_RESET });
  };
};
