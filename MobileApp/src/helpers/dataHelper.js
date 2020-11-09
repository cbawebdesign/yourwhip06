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
  FLAGGED,
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
const flagged = require('../../assets/icons/flagged.png');

export const NAVIGATION_ITEMS = [
  {
    title: EXPLORE,
    navigateTo: EXPLORE,
    icon: feed,
  },
  {
    title: FLAGGED,
    navigateTo: FLAGGED,
    icon: flagged,
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
];

export const termsPar0 = 'Last updated: 04-11-2020';
export const termsPar1 =
  "Please read this End-User License Agreement (Agreement) carefully before clicking the 'I Agree' button or using the 'React Native Backend App' Application. By clicking the 'I Agree' button, downloading or using the Application, you are agreeing to be bound by the terms and conditions of this Agreement. If you do not agree to the terms of this Agreement, do not click on the 'I Agree' button and do not download or use the Application.";
export const termsPar1_1 =
  "We are committed to making this app a save place. Expression that threatens people has the potential to intimidate, exclude or silence others and isn't allowed on this app. This means that there is no tolerance for objectionable content or abusive users on this app. As a user of the app you are provided methods to filter and to flag objectional content inside the app. All flagged content will be reviewed by our admins within 24 hours and Knowlephant reserves the right to delete any such content and its creators from the app at its own descretion.";
export const termsPar2 =
  'Knowlephant grants you a revocable, non-exclusive, non-transferable, limited license to download, install and use the Application solely for your personal, non-commercial purposes strictly in accordance with the terms of this Agreement.';
export const termsPar3 =
  'You agree not to, and you will not permit others to: license, sell, rent, lease, assign, distribute, transmit, host, outsource, disclose or otherwise commercially exploit the Application or make the Application available to any third party.';
export const termsPar4 =
  'Knowlephant reserves the right to modify, suspend or discontinue, temporarily or permanently, the Application or any service to which it connects, with or without notice and without liability to you.';
export const termsPar5 =
  'This Agreement shall remain in effect until terminated by you or Knowlephant. Knowlephant may, in its sole discretion, at any time and for any or no reason, suspend or terminate this Agreement with or without prior notice.';
export const termsPar6 =
  'This Agreement will terminate immediately, without prior notice from Knowlephant, in the event that you fail to comply with any provision of this Agreement. You may also terminate this Agreement by deleting the Application and all copies thereof from your mobile device or from your desktop. Upon termination of this Agreement, you shall cease all use of the Application and delete all copies of the Application from your mobile device or from your desktop.';
export const termsPar7 =
  'If any provision of this Agreement is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law and the remaining provisions will continue in full force and effect.';
export const termsPar8 =
  "Knowlephant reserves the right, at its sole discretion, to modify or replace this Agreement at any time. If a revision is material we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.";
export const termsPar9 =
  'If you have any questions about this Agreement, please contact us at info@knowlephant.com.';
