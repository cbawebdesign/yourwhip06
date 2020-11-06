import { put, call, select } from 'redux-saga/effects';

import {
  GET_FLAGGED_POSTS_FEED_RESULT,
  GET_FLAGGED_POSTS_FEED_ERROR,
  REPORT_POST_RESULT,
  REPORT_POST_ERROR,
  UNFLAG_POST_RESULT,
  UNFLAG_POST_ERROR,
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

const fetchReportPost = ({ action, token }) =>
  fetch(`${API_HOST}/report-post/`, {
    method: 'post',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      parentId: action.postId,
    }),
  });

const fetchUnflagPost = ({ action, token }) =>
  fetch(`${API_HOST}/unflag-post/`, {
    method: 'post',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      parentId: action.postId,
    }),
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

export function* reportPost(action) {
  const token = yield select((state) => state.auth.authToken);

  try {
    const response = yield call(fetchReportPost, { action, token });
    const result = yield response.json();

    if (result.error) {
      yield put({ type: REPORT_POST_ERROR, error: result.error });
    } else {
      yield put({ type: REPORT_POST_RESULT, result });
    }
  } catch (e) {
    yield put({ type: REPORT_POST_ERROR, error: e.message });
  }
}

export function* unflagPost(action) {
  const token = yield select((state) => state.auth.authToken);

  try {
    const response = yield call(fetchUnflagPost, { action, token });
    const result = yield response.json();

    if (result.error) {
      yield put({ type: UNFLAG_POST_ERROR, error: result.error });
    } else {
      yield put({ type: UNFLAG_POST_RESULT, result });
    }
  } catch (e) {
    yield put({ type: UNFLAG_POST_ERROR, error: e.message });
  }
}

export function* getFlaggedCommentsFeed(action) {}
