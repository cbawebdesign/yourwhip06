const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const CONFIG = require('../constants');

cloudinary.config(CONFIG.CLOUDINARY);

const upload = multer();

exports.uploadProfileImage = upload.single('profileImage');
exports.uploadImage = upload.array('media', 12);
