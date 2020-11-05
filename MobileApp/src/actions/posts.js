export const GET_HOME_FEED = 'GET_HOME_FEED';
export const HOME_FEED_RESULT = 'HOME_FEED_RESULT';
export const HOME_FEED_ERROR = 'HOME_FEED_ERROR';

export const CREATE_NEW_POST = 'CREATE_NEW_POST';
export const NEW_POST_RESULT = 'NEW_POST_RESULT';
export const NEW_POST_ERROR = 'NEW_POST_ERROR';

export const DELETE_POST = 'DELETE_POST';
export const DELETE_POST_RESULT = 'DELETE_POST_RESULT';
export const DELETE_POST_ERROR = 'DELETE_POST_ERROR';

export const HIDE_POST = 'HIDE_POST';
export const HIDE_POST_RESULT = 'HIDE_POST_RESULT';
export const HIDE_POST_ERROR = 'HIDE_POST_ERROR';

export const REPORT_POST = 'REPORT_POST';
export const REPORT_POST_RESULT = 'REPORT_POST_RESULT';
export const REPORT_POST_ERROR = 'REPORT_POST_ERROR';

export const HIDE_POSTS_BY_USER = 'HIDE_POSTS_BY_USER';
export const HIDE_POSTS_BY_USER_RESULT = 'HIDE_POSTS_BY_USER_RESULT';
export const HIDE_POSTS_BY_USER_ERROR = 'HIDE_POSTS_BY_USER_ERROR';

export const RESET_DELETE_POST = 'RESET_DELETE_POST';

export const GET_FLAGGED_FEED = 'GET_FLAGGED_FEED';
export const GET_FLAGGED_FEED_RESULT = 'GET_FLAGGED_FEED_RESULT';
export const GET_FLAGGED_FEED_ERROR = 'GET_FLAGGED_FEED_ERROR';

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

export const hidePost = (postId) => ({
  type: HIDE_POST,
  postId,
});

export const hidePostsByUser = (userId) => ({
  type: HIDE_POSTS_BY_USER,
  userId,
});

export const reportPost = (postId) => ({
  type: REPORT_POST,
  postId,
});

export const resetDeletePost = () => ({
  type: RESET_DELETE_POST,
});

export const getFlaggedFeed = (skip, limit) => ({
  type: GET_FLAGGED_FEED,
  skip,
  limit,
});
