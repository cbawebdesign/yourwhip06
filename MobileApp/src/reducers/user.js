import {
  USER_INFO_RESULT,
  WALKTHROUGH_COMPLETE,
  RECOMMENDED_USERS_RESULT,
  RECOMMENDED_USERS_ERROR,
  REMOVE_USER_PRESS_RESULT,
  REMOVE_USER_PRESS_ERROR,
  EDIT_PROFILE_RESULT,
  EDIT_PROFILE_ERROR,
  SEARCH_RESULT,
  SEARCH_ERROR,
  EDIT_PROFILE,
  GET_RECOMMENDED_USERS,
} from '../actions/user';
import { RESET_MESSAGES } from '../actions/auth';
import { FOLLOW_USER_PRESS_RESULT } from '../actions/profile';

const initialState = {
  fetching: false,
  error: null,
  success: null,
  editProfileFetching: false,
  user: null,
  walkthroughComplete: false,
  recommendedFeed: [],
  usersSearchFeed: [],
};

const userState = (state = initialState, action) => {
  switch (action.type) {
    case EDIT_PROFILE:
      return {
        ...state,
        editProfileFetching: true,
      };
    case GET_RECOMMENDED_USERS:
      return {
        ...state,
        fetching: true,
      };
    case RESET_MESSAGES: {
      return {
        ...state,
        error: null,
        success: null,
      };
    }
    case USER_INFO_RESULT:
      return {
        ...state,
        user: action.result.user,
      };
    case WALKTHROUGH_COMPLETE:
      return {
        ...state,
        walkthroughComplete: true,
      };
    case FOLLOW_USER_PRESS_RESULT:
      return {
        ...state,
        user: action.result,
      };
    case REMOVE_USER_PRESS_RESULT:
      return {
        ...state,
        recommendedFeed: action.result,
      };
    case RECOMMENDED_USERS_RESULT:
      return {
        ...state,
        fetching: false,
        recommendedFeed: action.result,
        error: null,
      };
    case SEARCH_RESULT:
      return {
        ...state,
        usersSearchFeed: action.result.users,
        error: null,
      };
    case 'RESET_USER':
      return {
        ...state,
        user: null,
      };
    case 'RESET_PROFILE':
      return {
        ...state,
        success: null,
        error: null,
      };
    case 'REMOVE_WALKTHROUGH_COMPLETE':
      return {
        ...state,
        walkthroughComplete: false,
      };
    case EDIT_PROFILE_RESULT:
      return {
        ...state,
        success: {
          ...state.success,
          editProfileSuccess: action.result.success,
        },
        editProfileFetching: false,
        user: action.result.user,
      };
    case RECOMMENDED_USERS_ERROR:
    case REMOVE_USER_PRESS_ERROR:
    case EDIT_PROFILE_ERROR:
    case SEARCH_ERROR:
      return {
        ...state,
        fetching: false,
        error: action.error,
        usersSearchFeed: [],
      };
    default:
      return state;
  }
};

export default userState;
