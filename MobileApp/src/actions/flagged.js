export const GET_FLAGGED_POSTS_FEED = 'GET_FLAGGED_POSTS_FEED';
export const GET_FLAGGED_POSTS_FEED_RESULT = 'GET_FLAGGED_POSTS_FEED_RESULT';
export const GET_FLAGGED_POSTS_FEED_ERROR = 'GET_FLAGGED_POSTS_FEED_ERROR';

export const REPORT_POST = 'REPORT_POST';
export const REPORT_POST_RESULT = 'REPORT_POST_RESULT';
export const REPORT_POST_ERROR = 'REPORT_POST_ERROR';

export const UNFLAG_POST = 'UNFLAG_POST';
export const UNFLAG_POST_RESULT = 'UNFLAG_POST_RESULT';
export const UNFLAG_POST_ERROR = 'UNFLAG_POST_ERROR';

export const getFlaggedPostsFeed = (skip, limit) => ({
  type: GET_FLAGGED_POSTS_FEED,
  skip,
  limit,
});

export const reportPost = (postId) => ({
  type: REPORT_POST,
  postId,
});

export const unflagPost = (postId) => ({
  type: UNFLAG_POST,
  postId,
});
