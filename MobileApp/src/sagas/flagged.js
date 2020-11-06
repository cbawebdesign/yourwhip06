import { put, call, select } from 'redux-saga/effects';

import {
  GET_FLAGGED_POSTS_FEED_RESULT,
  GET_FLAGGED_POSTS_FEED_ERROR,
} from '../actions/flagged';
import { API_HOST } from '../config/constants';

const fetchFlaggedPostsFeed = ({ action, token }) =>
  fetch(`${API_HOST}/get-flagged-posts-feed/${action.skip}/${action.limit}/`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

export function* getFlaggedPostsFeed(action) {
  const token = yield select((state) => state.auth.authToken);

  try {
    const response = yield call(fetchFlaggedPostsFeed, {
      action,
      token,
    });
    const result = yield response.json();

    if (result.error) {
      yield put({ type: GET_FLAGGED_POSTS_FEED_ERROR, error: result.error });
    } else {
      yield put({ type: GET_FLAGGED_POSTS_FEED_RESULT, result });
    }
  } catch (e) {
    yield put({ type: GET_FLAGGED_POSTS_FEED_ERROR, error: e.message });
  }
}

export function* getFlaggedCommentsFeed(action) {}
