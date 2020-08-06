export const GET_HOME_FEED = 'GET_HOME_FEED';
export const HOME_FEED_RESULT = 'HOME_FEED_RESULT';
export const HOME_FEED_ERROR = 'HOME_FEED_ERROR';

export const CREATE_NEW_POST = 'CREATE_NEW_POST';
export const NEW_POST_RESULT = 'NEW_POST_RESULT';
export const NEW_POST_ERROR = 'NEW_POST_ERROR';

export const DELETE_POST = 'DELETE_POST';
export const DELETE_POST_RESULT = 'DELETE_POST_RESULT';
export const DELETE_POST_ERROR = 'DELETE_POST_ERROR';

export const RESET_DELETE_POST = 'RESET_DELETE_POST';

export const getHomeFeed = (skip, limit) => ({
  type: GET_HOME_FEED,
  skip,
  limit,
});

export const composePost = (data) => ({
  type: CREATE_NEW_POST,
  data,
});

export const deletePost = (data) => ({
  type: DELETE_POST,
  data,
});

export const resetDeletePost = () => ({
  type: RESET_DELETE_POST,
});
