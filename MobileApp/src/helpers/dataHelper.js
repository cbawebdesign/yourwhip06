export const SELECTIONS = [
  [
    {
      title: 'Food',
      selected: false,
    },
    {
      title: 'Photography',
      selected: false,
    },
    {
      title: 'Beauty',
      selected: false,
    },
    {
      title: 'Music',
      selected: false,
    },
    {
      title: 'Gardening',
      selected: false,
    },
  ],
  [
    {
      title: 'Nature & Science',
      selected: false,
    },
    {
      title: 'Travel',
      selected: false,
    },
    {
      title: 'Money & Business',
      selected: false,
    },
    {
      title: 'Sports',
      selected: false,
    },
  ],
  [
    {
      title: 'Health',
      selected: false,
    },
    {
      title: 'Home & Garden',
      selected: false,
    },
    {
      title: 'Books',
      selected: false,
    },
    {
      title: 'Fashion',
      selected: false,
    },
    {
      title: 'Technology',
      selected: false,
    },
  ],
];

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
    title: 'Feed',
    navigateTo: 'Explore',
    icon: feed,
  },
  {
    title: 'People',
    navigateTo: 'People',
    icon: list,
  },
  {
    title: 'Gallery',
    navigateTo: 'Gallery',
    icon: gallery,
  },
  {
    title: 'Timeline',
    navigateTo: 'Timeline',
    icon: timeline,
  },
  {
    title: 'Compose',
    navigateTo: 'Compose',
    icon: compose,
  },
  {
    title: 'Capture',
    navigateTo: 'Camera',
    icon: capture,
  },
  {
    title: 'Profile',
    navigateTo: 'Profile',
    icon: profile,
  },
  {
    title: 'Stats',
    navigateTo: 'Stats',
    icon: stats,
  },
  {
    title: 'Settings',
    navigateTo: 'Settings',
    icon: settings,
  },
  {
    title: 'Discover',
    navigateTo: 'Walkthrough',
    icon: discover,
  },
];

const password = require('../../assets/icons/password.png');
const deleteIcon = require('../../assets/icons/delete.png');
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
      },
      {
        id: 1,
        title: 'Change Password',
        icon: password,
        navigateTo: 'Password',
      },
      {
        id: 2,
        title: 'Remove Account',
        icon: deleteIcon,
        navigateTo: '',
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
  //       isSocial: true,
  //     },
  //     {
  //       id: 3,
  //       title: 'Twitter',
  //       icon: twitter,
  //       navigateTo: null,
  //       isLinked: false,
  //       isSocial: true,
  //     },
  //     {
  //       id: 4,
  //       title: 'Facebook',
  //       icon: facebook,
  //       navigateTo: null,
  //       isLinked: false,
  //       isSocial: true,
  //     },
  //     {
  //       id: 5,
  //       title: 'LinkedIn',
  //       icon: linkedin,
  //       navigateTo: null,
  //       isLinked: true,
  //       isSocial: true,
  //     },
  //     {
  //       id: 6,
  //       title: 'Pinterest',
  //       icon: pinterest,
  //       navigateTo: null,
  //       isLinked: false,
  //       isSocial: true,
  //     },
  //   ],
  // },
];
