import { put, call, select } from 'redux-saga/effects';

import {
  HOME_FEED_RESULT,
  HOME_FEED_ERROR,
  NEW_POST_RESULT,
  NEW_POST_ERROR,
  DELETE_POST_RESULT,
  DELETE_POST_ERROR,
} from '../actions/home';
import { API_HOST } from '../config/constants';

const fetchHomeFeed = ({ action, token }) =>
  fetch(`${API_HOST}/get-home-feed/${action.skip}/${action.limit}`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

const fetchCompose = ({ data, token }) =>
  fetch(`${API_HOST}/compose-post/`, {
    method: 'post',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
    body: data,
  });

const fetchDeletePost = ({ action, token }) =>
  fetch(`${API_HOST}/delete-post/`, {
    method: 'post',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      postId: action.data.postId,
      fromScreen: action.data.fromScreen,
    }),
  });

export function* getHomeFeed(action) {
  const token = yield select((state) => state.auth.authToken);

  try {
    const response = yield call(fetchHomeFeed, {
      action,
      token,
    });
    const result = yield response.json();

    if (result.error) {
      yield put({ type: HOME_FEED_ERROR, error: result.error });
    } else {
      yield put({ type: HOME_FEED_RESULT, result });
    }
  } catch (e) {
    yield put({ type: HOME_FEED_ERROR, error: e.message });
  }
}

export function* composePost(action) {
  const token = yield select((state) => state.auth.authToken);

  const formData = new FormData();

  formData.append('description', action.data.description);
  formData.append('caption', action.data.caption);
  formData.append('parentId', action.data.sharedPostId);
  formData.append('imageId', action.data.sharedImageId);
  formData.append('limit', action.data.limit);

  if (action.data.gallery) {
    formData.append('galleryType', action.data.gallery.type);
    formData.append('galleryName', action.data.gallery.name);
  }

  if (action.data.media && action.data.media.images) {
    action.data.media.images.forEach((item) => {
      // CHECK FILE TYPES
      const ext = item.file.uri.substr(item.file.uri.length - 3).toLowerCase();

      if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') {
        formData.append('media', {
          uri: item.file.uri,
          type: `image/${ext}`,
          name: 'media',
        });
      } else if (ext === 'mp4' || ext === 'mov') {
        formData.append('media', {
          uri: item.localUri || item.file.uri,
          type: 'video/mp4',
          name: 'media',
        });
      }
    });
  } else if (action.data.media && action.data.media.video) {
    formData.append('media', {
      uri: action.data.media.video.uri,
      type: 'video/mp4',
      name: 'media',
    });
  }

  try {
    const response = yield call(fetchCompose, {
      data: formData,
      token,
    });
    const result = yield response.json();

    if (result.error) {
      yield put({ type: NEW_POST_ERROR, error: result.error });
    } else {
      yield put({ type: NEW_POST_RESULT, result });
    }
  } catch (e) {
    yield put({ type: NEW_POST_ERROR, error: e.message });
  }
}

export function* deletePost(action) {
  const token = yield select((state) => state.auth.authToken);

  try {
    const response = yield call(fetchDeletePost, { action, token });
    const result = yield response.json();

    if (result.error) {
      yield put({ type: DELETE_POST_ERROR, error: result.error });
    } else {
      yield put({ type: DELETE_POST_RESULT, result });
    }
  } catch (e) {
    yield put({ type: DELETE_POST_ERROR, error: e.message });
  }
}
