import {
  GET_TIMELINE_FEED,
  TIMELINE_FEED_RESULT,
  TIMELINE_FEED_ERROR,
} from '../actions/timeline';

const initialState = {
  fetching: false,
  error: null,
  success: null,
  timelineFeed: [],
};

const timelineState = (state = initialState, action) => {
  switch (action.type) {
    case GET_TIMELINE_FEED:
      return {
        ...state,
        fetching: true,
      };
    case TIMELINE_FEED_RESULT:
      return {
        ...state,
        fetching: false,
        timelineFeed: action.result,
        error: null,
      };
    case TIMELINE_FEED_ERROR:
      return {
        ...state,
        etching: false,
        error: action.error,
      };
    default:
      return state;
  }
};

export default timelineState;
