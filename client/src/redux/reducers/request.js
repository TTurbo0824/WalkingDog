import { RESET_REQUEST, GET_REQUEST, REQUEST_DOGWALKER, CANCEL_DOGWALKER } from '../action';
import { initRequestState } from './initialState/initialState';

function request (state = initRequestState, action) {
  switch (action.type) {
    case RESET_REQUEST:
      return { dogWalkerRequest: [] };
    case GET_REQUEST:
      return { dogWalkerRequest: action.payload };
    case REQUEST_DOGWALKER:
      return {
        ...state,
        dogWalkerRequest: [
          ...state.dogWalkerRequest,
          {
            id: action.payload.id,
            dogwalkerId: action.payload.dogwalkerId,
            type: action.payload.type,
            location: action.payload.location,
            date: action.payload.date,
            duration: action.payload.duration,
            price: action.payload.price,
            status: 'pending'
          }
        ]
      };
    case CANCEL_DOGWALKER:
      return {
        ...state,
        dogWalkerRequest: state.dogWalkerRequest.filter((el) => !action.payload.includes(el.id))
      };
    default:
      return state;
  }
}

export default request;
