import {
  CREATE_NEW_POST,
  HOME_FEED_RESULT,
  HOME_FEED_ERROR,
  NEW_POST_RESULT,
  NEW_POST_ERROR,
  DELETE_POST_RESULT,
  DELETE_POST_ERROR,
  RESET_DELETE_POST,
} from '../actions/home';
import { LOGOUT_RESULT } from '../actions/auth';

import { PAGINATION_LIMIT } from '../config/constants';

const initialState = {
  error: null,
  success: null,
  fetching: true,
  homeFeed: [],
  endOfList: false,
  deletedPost: null,
};

const homeState = (state = initialState, action) => {
  switch (action.type) {
    case HOME_FEED_RESULT:
      return {
        ...state,
        homeFeed:
          action.result.skip === '0'
            ? action.result.posts
            : [...state.homeFeed, ...action.result.posts],
        endOfList: action.result.posts.length < PAGINATION_LIMIT,
        fetching: false,
        error: null,
      };
    case CREATE_NEW_POST:
      return {
        ...state,
      };
    case NEW_POST_RESULT:
      return {
        ...state,
        homeFeed: action.result,
        error: null,
      };
    case DELETE_POST_RESULT:
      return {
        ...state,
        deletedPost: {
          ...state.deletedPost,
          postId: action.result.postId,
          fromScreen: action.result.fromScreen,
        },
        homeFeed: state.homeFeed.filter(
          (item) => item._id !== action.result.postId
        ),
      };
    case RESET_DELETE_POST:
      return {
        ...state,
        deletedPost: null,
      };
    case NEW_POST_ERROR:
    case HOME_FEED_ERROR:
    case DELETE_POST_ERROR:
      return {
        ...state,
        error: action.error,
        fetching: false,
      };
    case LOGOUT_RESULT:
      return {
        ...state,
        homeFeed: [],
      };
    default:
      return state;
  }
};

export default homeState;
