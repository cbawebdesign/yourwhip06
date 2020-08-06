import { put, call, select } from 'redux-saga/effects';

import {
  USER_INFO_RESULT,
  USER_INFO_ERROR,
  RECOMMENDED_USERS_RESULT,
  RECOMMENDED_USERS_ERROR,
  REMOVE_USER_PRESS_RESULT,
  REMOVE_USER_PRESS_ERROR,
  EDIT_PROFILE_RESULT,
  EDIT_PROFILE_ERROR,
  SEARCH_RESULT,
  SEARCH_ERROR,
} from '../actions/user';

import { API_HOST } from '../config/constants';

const fetchUserInfo = (action) =>
  fetch(`${API_HOST}/get-user-info/`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${action.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

const fetchRecommendedUsers = (token) =>
  fetch(`${API_HOST}/get-recommended-users/`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

const fetchRemoveUserPress = ({ action, token }) =>
  fetch(`${API_HOST}/remove-user-press/`, {
    method: 'post',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user: action.user,
    }),
  });

const fetchEditProfile = ({ token, formData }) =>
  fetch(`${API_HOST}/edit-profile/`, {
    method: 'post',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });

const fetchSearch = ({ action, token }) =>
  fetch(`${API_HOST}/search-users/${action.input}`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

export function* getUserInfo(action) {
  try {
    const response = yield call(fetchUserInfo, action);
    const result = yield response.json();

    if (result.error) {
      yield put({ type: USER_INFO_ERROR, error: result.error });
    } else {
      yield put({ type: USER_INFO_RESULT, result });
    }
  } catch (e) {
    yield put({ type: USER_INFO_ERROR, error: e.message });
  }
}

export function* getRecommendedUsers() {
  const token = yield select((state) => state.auth.authToken);

  try {
    const response = yield call(fetchRecommendedUsers, token);
    const result = yield response.json();

    if (result.error) {
      yield put({ type: RECOMMENDED_USERS_ERROR, error: result.error });
    } else {
      yield put({ type: RECOMMENDED_USERS_RESULT, result });
    }
  } catch (e) {
    yield put({ type: RECOMMENDED_USERS_ERROR, error: e.message });
  }
}

export function* removeUserPress(action) {
  const token = yield select((state) => state.auth.authToken);

  try {
    const response = yield call(fetchRemoveUserPress, { action, token });
    const result = yield response.json();

    if (result.error) {
      yield put({ type: REMOVE_USER_PRESS_ERROR, error: result.error });
    } else {
      yield put({ type: REMOVE_USER_PRESS_RESULT, result });
    }
  } catch (e) {
    yield put({ type: REMOVE_USER_PRESS_ERROR, error: e.message });
  }
}

export function* editProfile(action) {
  const token = yield select((state) => state.auth.authToken);
  const user = yield select((state) => state.user.user);

  const formData = new FormData();
  // if (action.userInfo.birthday) {
  formData.append(
    'birthday',
    action.userInfo.birthday
      ? action.userInfo.birthday.toString()
      : user.birthday
  );
  // }
  formData.append('gender', action.userInfo.gender || user.gender);
  formData.append('location', action.userInfo.location || user.location);
  formData.append(
    'description',
    action.userInfo.description || user.description
  );

  if (
    action.userInfo.profileImage &&
    action.userInfo.profileImage.uri &&
    action.userInfo.profileImage.uri.length > 0
  ) {
    formData.append('profileImage', {
      uri: action.userInfo.profileImage.uri,
      type: 'image/jpg',
      name: 'profileImage',
    });
  }
  try {
    const response = yield call(fetchEditProfile, { token, formData });
    const result = yield response.json();

    if (result.error) {
      yield put({ type: EDIT_PROFILE_ERROR, error: result.error });
    } else {
      yield put({ type: EDIT_PROFILE_RESULT, result });
    }
  } catch (e) {
    yield put({ type: EDIT_PROFILE_ERROR, error: e.message });
  }
}

export function* search(action) {
  const token = yield select((state) => state.auth.authToken);

  try {
    const response = yield call(fetchSearch, { action, token });
    const result = yield response.json();

    if (result.error) {
      yield put({ type: SEARCH_ERROR, error: result.error });
    } else {
      yield put({ type: SEARCH_RESULT, result });
    }
  } catch (e) {
    yield put({ type: SEARCH_ERROR, error: e.message });
  }
}
