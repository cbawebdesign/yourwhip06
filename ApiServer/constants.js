const dotenv = require('dotenv');

const CONFIG = dotenv.config().parsed;

// CHANGE FOR YOUR COMPANY AND APP INFORMATION SETTING
// USED IN EMAILS SENT BY APP
exports.COMPANY_INFO = {
  app_name: 'Share App',
  company_name: 'Share',
  app_emailaddress: 'info@knowlephant.com',
  address: 'Company address',
};

// CHANGE POST AUTO-DELETE SETTINGS
// IF 'TRUE', POSTS WILL EXPIRE AFTER 24 HOURS
// EXPIRY TIME CAN BE MODIFIED FROM BACKEND ONLY
exports.ENABLE_POST_SELF_DESTRUCT = true;

// DISPLAY SUGGESTIONS CONTROL SWITCH TO USER SETTINGS
// SWITCH LETS USER CONTROL SEEING SUGGESTED PEOPLE & POSTS BASED
// ON THEIR SELECTED INTERESTS
exports.ENABLE_CONTROL_SUGGESTIONS = true;

// DISPLAY SUGGESTED PEOPLE & POSTS BASED ON USER'S SELECTED INTERESTS GLOBAL SETTING
// ONLY ACTIVE IF ABOVE SET TO FALSE
exports.ENABLE_SUGGESTIONS = true;

exports.MONGODB = {
  connectionString:
    process.env.MONGODB_CONNECTION_STRING || CONFIG.MONGODB_CONNECTION_STRING,
};

exports.SENDGRID = {
  username: process.env.SENDGRID_USERNAME || CONFIG.SENDGRID_USERNAME,
  password: process.env.SENDGRID_PASSWORD || CONFIG.SENDGRID_PASSWORD,
};

exports.CLOUDINARY = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || CONFIG.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY || CONFIG.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET || CONFIG.CLOUDINARY_API_SECRET,
  MEDIA_FOLDER:
    process.env.CLOUDINARY_MEDIA_FOLDER || CONFIG.CLOUDINARY_MEDIA_FOLDER,
};

exports.JWT_KEY = process.env.JWT_KEY || CONFIG.JWT_KEY;
