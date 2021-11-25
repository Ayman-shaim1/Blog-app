import { SET_ALERT, REMOVE_ALERT } from "./alertTypes";

export const setAlert = (content, type) => {
  const payload = {
    content: content,
    type: type,
  };
  return {
    type: SET_ALERT,
    payload: payload,
  };
};

export const removeAlert = () => {
  return { type: REMOVE_ALERT };
};
