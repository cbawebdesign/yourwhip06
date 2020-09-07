const dotenv = require('dotenv');

const CONFIG = dotenv.config().parsed;

exports.COMPANY_INFO = {
  app_name: 'Share App',
  company_name: 'Share',
  app_emailaddress: 'info@knowlephant.com',
  address: 'Compnay address',
};

// CHANGE POST AUTO-DELETE SETTINGS
// IF 'TRUE', POSTS WILL EXPIRE AFTER 24 HOURS
// EXPIRY TIME CAN BE MODIFIED FROM BACKEND ONLY
exports.ENABLE_POST_SELF_DESTRUCT = true;

// THIS SETTING ADDS ENABLE SUGGESTIONS CONTROL SWITCH TO USER SETTINS
// SETTING LETS USER CONTROL SEEING SUGGESTED PEOPLE & POSTS BASED
// ON THEIR SELECTED INTERESTS
exports.ENABLE_CONTROL_SUGGESTIONS = true;

// ONLY ACTIVE IF ABOVE SET TO FALSE:
// DISPLAYS SUGGESTED PEOPLE & POSTS BASED ON USER'S SELECTED INTERESTS
exports.ENABLE_SUGGESTIONS = true;

exports.MONGODB = {
  connectionString: CONFIG.MONGODB_CONNECTION_STRING,
};

exports.SENDGRID = {
  username: CONFIG.SENDGRID_USERNAME,
  password: CONFIG.SENDGRID_PASSWORD,
};

exports.CLOUDINARY = {
  cloud_name: CONFIG.CLOUDINARY_CLOUD_NAME,
  api_key: CONFIG.CLOUDINARY_API_KEY,
  api_secret: CONFIG.CLOUDINARY_API_SECRET,
  MEDIA_FOLDER: CONFIG.CLOUDINARY_MEDIA_FOLDER,
};

exports.JWT_KEY = CONFIG.JWT_KEY;
