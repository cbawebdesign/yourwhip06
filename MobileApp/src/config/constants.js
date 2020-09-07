const DEVELOPMENT_API_HOST = 'http://localhost:4000';
const PRODUCTION_API_HOST = 'https://react-native-share.herokuapp.com';

const development = false;

export const API_HOST = development
  ? DEVELOPMENT_API_HOST
  : PRODUCTION_API_HOST;

// CHANGE INNER & OUTER MARGINS LEFT / RIGHT
// FOR LIST ITEM BLOCKS ON ALL SCREENS
// (EMPTY SPACE BETWEEN SCREEN EDGE AND CONTENT ITEM BLOCKS)
export const OUTER_CONTAINER_MARGIN_LEFT_RIGHT = 25;
export const INNER_CONTAINER_MARGIN_LEFT_RIGHT = 50;

// CHANGE INFINITE SCROLL SETTINGS
export const PAGINATION_LIMIT = 8;

// CHANGE SOCIAL BAR SETTINGS
export const ENABLE_LIKE_ANIMATION_1 = true;
export const ENABLE_LIKE_ANIMATION_2 = false;

export const ENABLE_LIKE_YOURSELF = true;

// PROFILE: DUMMY INTRO DESCRIPTION
export const PERSONAL_DESCRIPTION =
  'Still pondering on some cool catch-phrase...';

// DISCOVER ITEMS
export const SELECTIONS = [
  // TOP LIST
  ['Food', 'Photography', 'Beauty', 'Music', 'Gardening'],
  // MIDDLE LIST
  ['Nature & Science', 'Travel', 'Money & Business', 'Sports'],
  // BOTTOM LIST
  ['Health', 'Home & Garden', 'Books', 'Fashion', 'Technology'],
];

// CHANGE SCREEN TITLES SETTINGS
export const LOGIN = 'Login';
export const SIGNUP_STEP_1 = 'Signup (Step 1)';
export const SIGNUP_STEP_2 = 'Signup (Step 2)';
export const HELP = 'Help';
export const CODE = 'Code';
export const PASSWORD = 'Password';
export const CAMERA = 'Camera';

export const WALKTHROUGH = 'Walkthrough';
export const DISCOVER = 'Discover';

export const MEDIA_ALBUMS = 'Media Albums';
export const MEDIA = 'Media';

export const EXPLORE = 'Explore';
export const GALLERY = 'Gallery';
export const GALLERY_DETAIL = 'GalleryDetail';
export const PROFILE = 'Profile';
export const PEOPLE = 'People';
export const TIMELINE = 'Timeline';
export const SETTINGS = 'Settings';
export const STATS = 'Stats';
export const EXPLORE_DETAIL = 'ExploreDetail';

export const COMPOSE = 'Compose';
export const NAVIGATION = 'Navigation';
export const COMMENTS = 'Comments';
export const SEARCH = 'Search';
export const REPLIES = 'Replies';

// CHANGE COLOR SETTINGS
export const COLORS = {
  primary1: '#FD7E7E',
  primary2: '#FDD87E',
  backgroundGray: '#DDDDDD',
  black: '#020202',
  white: '#fff',
  lightGray: '#C4C4C4',
};
