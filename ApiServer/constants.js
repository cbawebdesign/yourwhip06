const dotenv = require('dotenv');

dotenv.config();

const development = true;

const MONGODB_CONNECTION_STRING = '';

const SENDGRID_USERNAME = '';
const SENDGRID_PASSWORD = '';

const CLOUDINARY_CLOUD_NAME = '';
const CLOUDINARY_API_KEY = '';
const CLOUDINARY_API_SECRET = '';
const CLOUDINARY_MEDIA_FOLDER = '';

exports.MONGODB = {
  connectionString: development
    ? MONGODB_CONNECTION_STRING
    : process.env.MONGODB_CONNECTION,
};

exports.SENDGRID = {
  username: development ? SENDGRID_USERNAME : process.env.SENDGRID_USERNAME,
  password: development ? SENDGRID_PASSWORD : process.env.SENDGRID_PASSWORD,
};

exports.CLOUDINARY = {
  cloud_name: development
    ? CLOUDINARY_CLOUD_NAME
    : process.env.CLOUDINARY_CLOUD_NAME,
  api_key: development ? CLOUDINARY_API_KEY : process.env.CLOUDINARY_API_KEY,
  api_secret: development
    ? CLOUDINARY_API_SECRET
    : process.env.CLOUDINARY_API_SECRET,
  MEDIA_FOLDER: development
    ? CLOUDINARY_MEDIA_FOLDER
    : process.env.CLOUDINARY_MEDIA_FOLDER,
};
