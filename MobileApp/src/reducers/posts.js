import {
  CREATE_NEW_POST,
  HOME_FEED_RESULT,
  HOME_FEED_ERROR,
  NEW_POST_RESULT,
  NEW_POST_ERROR,
  DELETE_POST_RESULT,
  DELETE_POST_ERROR,
  RESET_DELETE_POST,
  HIDE_POST_RESULT,
  HIDE_POST_ERROR,
  HIDE_POSTS_BY_USER_RESULT,
  HIDE_POSTS_BY_USER_ERROR,
  REPORT_POST_RESULT,
  REPORT_POST_ERROR,
  GET_FLAGGED_FEED_RESULT,
  GET_FLAGGED_FEED_ERROR,
} from '../actions/posts';
import { LOGOUT_RESULT } from '../actions/auth';

import { PAGINATION_LIMIT } from '../config/constants';

const initialState = {
  error: null,
  success: null,
  fetching: true,
  homeFeed: [],
  endOfList: false,
  deletedPost: null,
  flaggedFeed: [],
};

const homeState = (state = initialState, action) => {
  switch (action.type) {
    case HOME_FEED_RESULT:
      return {
        ...state,
        homeFeed:
          action.result.skip === '0'
            ? action.result.homeFeed
            : [...state.homeFeed, ...action.result.homeFeed],
        endOfList: action.result.homeFeed.length < PAGINATION_LIMIT,
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
        flaggedFeed: state.flaggedFeed.filter(
          (item) => item._id !== action.result.postId
        ),
      };
    case HIDE_POST_RESULT:
      return {
        ...state,
        homeFeed: action.result,
        error: null,
      };
    case HIDE_POSTS_BY_USER_RESULT:
      return {
        ...state,
        homeFeed: action.result,
        error: null,
      };
    case REPORT_POST_RESULT:
      return {
        ...state,
        flaggedFeed: action.result.flaggedFeed,
        success: {
          ...state.success,
          reportPostSuccess: action.result.success,
        },
      };
    case GET_FLAGGED_FEED_RESULT:
      return {
        ...state,
        ...state,
        flaggedFeed:
          action.result.skip === '0'
            ? action.result.flaggedFeed
            : [...state.flaggedFeed, ...action.result.flaggedFeed],
        endOfList: action.result.flaggedFeed.length < PAGINATION_LIMIT,
        fetching: false,
        error: null,
      };
    case RESET_DELETE_POST:
      return {
        ...state,
        deletedPost: null,
      };
    case 'RESET_SUCCESS':
      return {
        ...state,
        success: null,
      };
    case LOGOUT_RESULT:
      return {
        ...state,
        homeFeed: [],
      };
    case NEW_POST_ERROR:
    case HOME_FEED_ERROR:
    case DELETE_POST_ERROR:
    case HIDE_POST_ERROR:
    case HIDE_POSTS_BY_USER_ERROR:
    case REPORT_POST_ERROR:
    case GET_FLAGGED_FEED_ERROR:
      return {
        ...state,
        error: action.error,
        success: null,
        fetching: false,
      };
    default:
      return state;
  }
};

export default homeState;
