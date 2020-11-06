export const GET_FLAGGED_POSTS_FEED = 'GET_FLAGGED_POSTS_FEED';
export const GET_FLAGGED_POSTS_FEED_RESULT = 'GET_FLAGGED_POSTS_FEED_RESULT';
export const GET_FLAGGED_POSTS_FEED_ERROR = 'GET_FLAGGED_POSTS_FEED_ERROR';

export const getFlaggedPostsFeed = (skip, limit) => ({
  type: GET_FLAGGED_POSTS_FEED,
  skip,
  limit,
});
