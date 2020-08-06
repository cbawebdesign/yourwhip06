const dotenv = require('dotenv');

dotenv.config();

exports.MONGODB = {
  connectionString: process.env.MONGODB_CONNECTION,
};

exports.SENDGRID = {
  username: process.env.SENDGRID_USERNAME,
  password: process.env.SENDGRID_PASSWORD,
};

exports.CLOUDINARY = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};
