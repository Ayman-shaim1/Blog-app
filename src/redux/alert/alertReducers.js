import { SET_ALERT, REMOVE_ALERT } from "./alertTypes";

export const alertReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_ALERT:
      return { content: payload.content, type: payload.type };
    case REMOVE_ALERT:
      return {};
    default:
      return state;
  }
};
