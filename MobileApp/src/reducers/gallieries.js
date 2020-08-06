import {
  GALLERY_FEED_RESULT,
  GALLERY_FEED_ERROR,
  GET_GALLERY_FEED,
} from '../actions/galleries';

const initialState = {
  fetching: false,
  error: null,
  success: null,
  galleryFeed: [],
};

const galleryState = (state = initialState, action) => {
  switch (action.type) {
    case GET_GALLERY_FEED:
      return {
        ...state,
        fetching: true,
      };
    case GALLERY_FEED_RESULT:
      return {
        ...state,
        fetching: false,
        galleryFeed: action.result,
        error: null,
      };
    case GALLERY_FEED_ERROR:
      return {
        ...state,
        fetching: false,
        error: action.error,
      };
    default:
      return state;
  }
};

export default galleryState;
