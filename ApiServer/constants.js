const dotenv = require('dotenv');

dotenv.config();

const development = true;

const MONGODB_CONNECTION_STRING =
  'mongodb+srv://henkcorporaal:2ZyEsk30ODqGPL44@share-development.rc1zg.mongodb.net/share_dev?retryWrites=true&w=majority';

const SENDGRID_USERNAME = 'knowlephant';
const SENDGRID_PASSWORD = 'ILoveElephants88';

const CLOUDINARY_CLOUD_NAME = 'knowlephant';
const CLOUDINARY_API_KEY = '291472866985434';
const CLOUDINARY_API_SECRET = 'ZltFjsHGEYoDwydZumuo1PeWuAc';
const CLOUDINARY_MEDIA_FOLDER = 'ReactNativeShare';

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
