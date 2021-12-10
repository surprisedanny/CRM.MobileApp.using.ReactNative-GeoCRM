import {
  SLIDE_STATUS,
  CHANGE_PROFILE_STATUS,
  CHANGE_MORE_STATUS,
  SHOW_MORE_COMPONENT
} from '../actions/actionTypes';

const initialState = {
  crmSlideStatus: false,
  showProfile: 1,
  showMoreScreen: 1,
  visibleMore: ''
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (state=initialState, action) => {
  switch(action.type) {
    case SLIDE_STATUS:
      return {
        ...state,
        crmSlideStatus: action.payload 
      }
    case CHANGE_PROFILE_STATUS:
      return {
        ...state,
        showProfile: action.payload
      }
    case CHANGE_MORE_STATUS: 
      return {
        ...state,
        showMoreScreen: action.payload
      }
    case SHOW_MORE_COMPONENT:
      return {
        ...state,
        visibleMore: action.payload
      }
    default: 
      return state;
  }
}