import {
  EXPLORE,
  PEOPLE,
  GALLERY,
  TIMELINE,
  COMPOSE,
  CAMERA,
  PROFILE,
  STATS,
  SETTINGS,
  DISCOVER,
} from '../config/constants';

const feed = require('../../assets/icons/feed.png');
const list = require('../../assets/icons/list.png');
const gallery = require('../../assets/icons/gallery.png');
const timeline = require('../../assets/icons/timeline.png');
const compose = require('../../assets/icons/compose.png');
const capture = require('../../assets/icons/capture.png');
const profile = require('../../assets/icons/profile.png');
const stats = require('../../assets/icons/stats.png');
const settings = require('../../assets/icons/settings.png');
const discover = require('../../assets/icons/discover.png');

export const NAVIGATION_ITEMS = [
  {
    title: EXPLORE,
    navigateTo: EXPLORE,
    icon: feed,
  },
  {
    title: PEOPLE,
    navigateTo: PEOPLE,
    icon: list,
  },
  {
    title: GALLERY,
    navigateTo: GALLERY,
    icon: gallery,
  },
  {
    title: TIMELINE,
    navigateTo: TIMELINE,
    icon: timeline,
  },
  {
    title: COMPOSE,
    navigateTo: COMPOSE,
    icon: compose,
  },
  {
    title: CAMERA,
    navigateTo: CAMERA,
    icon: capture,
  },
  {
    title: PROFILE,
    navigateTo: PROFILE,
    icon: profile,
  },
  {
    title: STATS,
    navigateTo: STATS,
    icon: stats,
  },
  {
    title: SETTINGS,
    navigateTo: SETTINGS,
    icon: settings,
  },
  {
    title: DISCOVER,
    navigateTo: DISCOVER,
    icon: discover,
  },
];

const password = require('../../assets/icons/password.png');
const deleteIcon = require('../../assets/icons/delete.png');
const suggestions = require('../../assets/icons/suggestions.png');
const animations = require('../../assets/icons/animations.png');
// const twitter = require('../../assets/icons/twitter.png');
// const facebook = require('../../assets/icons/facebook.png');
// const instagram = require('../../assets/icons/instagram.png');
// const linkedin = require('../../assets/icons/linkedin.png');
// const pinterest = require('../../assets/icons/pinterest.png');

export const SETTINGS_ITEMS = [
  {
    title: 'General',
    data: [
      {
        id: 0,
        title: 'Edit Profile',
        icon: profile,
        navigateTo: 'Signup (Step 2)',
        type: 'NAVIGATE',
      },
      {
        id: 1,
        title: 'Change Password',
        icon: password,
        navigateTo: 'Password',
        type: 'NAVIGATE',
      },
      {
        id: 2,
        title: 'Remove Account',
        icon: deleteIcon,
        navigateTo: '',
        type: 'NAVIGATE',
      },
    ],
  },
  {
    title: 'Personal',
    data: [
      {
        id: 3,
        title: 'Use my selected interest to suggest new people and posts',
        icon: suggestions,
        navigateTo: null,
        type: 'ENABLE_SUGGESTIONS',
      },
      {
        id: 4,
        title: 'Show screen intro animations',
        icon: animations,
        navigateTo: null,
        type: 'ENABLE_INTRO_ANIMATIONS',
      },
    ],
  },
  // {
  //   title: 'Linked Accounts',
  //   data: [
  //     {
  //       id: 2,
  //       title: 'Instagram',
  //       icon: instagram,
  //       navigateTo: null,
  //       isLinked: true,
  //       type: 'SOCIAL'
  //     },
  //     {
  //       id: 3,
  //       title: 'Twitter',
  //       icon: twitter,
  //       navigateTo: null,
  //       isLinked: false,
  //       type: 'SOCIAL'
  //     },
  //     {
  //       id: 4,
  //       title: 'Facebook',
  //       icon: facebook,
  //       navigateTo: null,
  //       isLinked: false,
  //       type: 'SOCIAL'
  //     },
  //     {
  //       id: 5,
  //       title: 'LinkedIn',
  //       icon: linkedin,
  //       navigateTo: null,
  //       isLinked: true,
  //       type: 'SOCIAL'
  //     },
  //     {
  //       id: 6,
  //       title: 'Pinterest',
  //       icon: pinterest,
  //       navigateTo: null,
  //       isLinked: false,
  //       type: 'SOCIAL'
  //     },
  //   ],
  // },
];
