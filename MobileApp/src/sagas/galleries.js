import { put, call, select } from 'redux-saga/effects';

import { GALLERY_FEED_RESULT, GALLERY_FEED_ERROR } from '../actions/galleries';

import { API_HOST } from '../config/constants';

const fetchGalleryFeed = (token) =>
  fetch(`${API_HOST}/get-gallery-feed/`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

export function* getGalleryFeed() {
  const token = yield select((state) => state.auth.authToken);

  try {
    const response = yield call(fetchGalleryFeed, token);
    const result = yield response.json();

    if (result.error) {
      yield put({ type: GALLERY_FEED_ERROR, error: result.error });
    } else {
      yield put({ type: GALLERY_FEED_RESULT, result });
    }
  } catch (e) {
    yield put({ type: GALLERY_FEED_ERROR, error: e.message });
  }
}

export default { getGalleryFeed };
