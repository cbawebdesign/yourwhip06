const dotenv = require('dotenv');

dotenv.config();

// UNCOMMENT FOR TESTING ON SERVER ENVIRONMENT ONLY
// exports.MONGODB = {
//   connectionString: process.env.MONGODB_CONNECTION,
// };

// exports.SENDGRID = {
//   username: process.env.SENDGRID_USERNAME,
//   password: process.env.SENDGRID_PASSWORD,
// };

// exports.CLOUDINARY = {
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// };

// UNCOMMENT FOR TESTING ON LOCALHOST ENVIRONMENT ONLY
exports.MONGODB = {
  connectionString:
    'mongodb+srv://henkcorporaal:M!xensenna1@stockportfolio-rc1zg.mongodb.net/rn_share?retryWrites=true&w=majority',
};

exports.SENDGRID = {
  username: 'knowlephant',
  password: 'ILoveElephants88',
};

exports.CLOUDINARY = {
  cloud_name: 'knowlephant',
  api_key: '291472866985434',
  api_secret: 'ZltFjsHGEYoDwydZumuo1PeWuAc',
};
