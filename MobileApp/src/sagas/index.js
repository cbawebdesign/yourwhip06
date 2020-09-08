import { takeEvery } from 'redux-saga/effects';

import {
  LOGIN,
  SIGNUP_STEP1,
  SIGNUP_STEP2,
  LOGOUT,
  REQUEST_CODE,
  VALIDATE_CODE,
  RESET_PASSWORD,
  DELETE_ACCOUNT,
} from '../actions/auth';
import {
  login,
  logout,
  signupStep1,
  signupStep2,
  requestCode,
  validateCode,
  resetPassword,
  deleteAccount,
} from './auth';

import {
  GET_USER_INFO,
  UPDATE_INTERESTS,
  UPDATE_SETTINGS,
  GET_RECOMMENDED_USERS,
  REMOVE_USER_PRESS,
  EDIT_PROFILE,
  SEARCH,
} from '../actions/user';
import {
  getUserInfo,
  updateInterests,
  updateSettings,
  getRecommendedUsers,
  removeUserPress,
  editProfile,
  search,
} from './user';

import { LIKE_POST_PRESS } from '../actions/likes';
import { likePostPress } from './likes';

import { SHARE_POST_PRESS, SHARE_IMAGE_PRESS } from '../actions/shares';
import { sharePost, shareImage } from './shares';

import { GET_HOME_FEED, CREATE_NEW_POST, DELETE_POST } from '../actions/home';
import { getHomeFeed, composePost, deletePost } from './home';

import { GET_DETAIL_POST, LIKE_IMAGE_PRESS } from '../actions/detail';
import { getOnePost, likeImagePress } from './detail';

import { GET_PROFILE, FOLLOW_USER_PRESS } from '../actions/profile';
import { getProfile, followUserPress } from './profile';

import {
  GET_COMMENT_FEED,
  LIKE_COMMENT_PRESS,
  COMPOSE_NEW_COMMENT,
  DELETE_COMMENT,
} from '../actions/comments';
import {
  getCommentFeed,
  likeCommentPress,
  composeComment,
  deleteComment,
} from './comments';

import {
  GET_REPLY_FEED,
  LIKE_REPLY_PRESS,
  COMPOSE_NEW_REPLY,
  DELETE_REPLY,
} from '../actions/replies';
import {
  getReplyFeed,
  likeReplyPress,
  composeReply,
  deleteReply,
} from './replies';

import { GET_GALLERY_FEED } from '../actions/galleries';
import { getGalleryFeed } from './galleries';

import { GET_TIMELINE_FEED } from '../actions/timeline';
import { getTimelineFeed } from './timeline';

import { GET_STATS_FOR_MONTH } from '../actions/stats';
import { getStatsForMonth } from './stats';

export default function* rootSaga() {
  // AUTH
  yield takeEvery(LOGIN, login);
  yield takeEvery(LOGOUT, logout);
  yield takeEvery(SIGNUP_STEP1, signupStep1);
  yield takeEvery(SIGNUP_STEP2, signupStep2);
  yield takeEvery(GET_USER_INFO, getUserInfo);
  yield takeEvery(REQUEST_CODE, requestCode);
  yield takeEvery(VALIDATE_CODE, validateCode);
  yield takeEvery(RESET_PASSWORD, resetPassword);
  yield takeEvery(DELETE_ACCOUNT, deleteAccount);

  // SOCIAL
  yield takeEvery(LIKE_POST_PRESS, likePostPress);
  yield takeEvery(SHARE_POST_PRESS, sharePost);

  // HOME
  yield takeEvery(GET_HOME_FEED, getHomeFeed);
  yield takeEvery(CREATE_NEW_POST, composePost);
  yield takeEvery(DELETE_POST, deletePost);

  // POST DETAIL
  yield takeEvery(GET_DETAIL_POST, getOnePost);
  yield takeEvery(LIKE_IMAGE_PRESS, likeImagePress);
  yield takeEvery(SHARE_IMAGE_PRESS, shareImage);

  // COMMENTS PAGE
  yield takeEvery(GET_COMMENT_FEED, getCommentFeed);
  yield takeEvery(LIKE_COMMENT_PRESS, likeCommentPress);
  yield takeEvery(COMPOSE_NEW_COMMENT, composeComment);
  yield takeEvery(DELETE_COMMENT, deleteComment);

  // REPLIES
  yield takeEvery(GET_REPLY_FEED, getReplyFeed);
  yield takeEvery(LIKE_REPLY_PRESS, likeReplyPress);
  yield takeEvery(COMPOSE_NEW_REPLY, composeReply);
  yield takeEvery(DELETE_REPLY, deleteReply);

  // PROFILE
  yield takeEvery(GET_PROFILE, getProfile);
  yield takeEvery(FOLLOW_USER_PRESS, followUserPress);

  // TIMELINE
  yield takeEvery(GET_TIMELINE_FEED, getTimelineFeed);

  // GALLERY
  yield takeEvery(GET_GALLERY_FEED, getGalleryFeed);

  // PEOPLE / USER
  yield takeEvery(UPDATE_INTERESTS, updateInterests);
  yield takeEvery(UPDATE_SETTINGS, updateSettings);
  yield takeEvery(EDIT_PROFILE, editProfile);
  yield takeEvery(GET_RECOMMENDED_USERS, getRecommendedUsers);
  yield takeEvery(REMOVE_USER_PRESS, removeUserPress);
  yield takeEvery(SEARCH, search);

  // STATS
  yield takeEvery(GET_STATS_FOR_MONTH, getStatsForMonth);
}
