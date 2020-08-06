const cloudinary = require('cloudinary').v2;

const Image = require('../models/Image');
const Post = require('../models/Post');
const { cloudinaryUploader } = require('./mediaUploader');

const CONFIG = require('../constants');

exports.getOneImageFromRequest = async (req) => {
  const id = req.body.imageId ? req.body.imageId : req.body.parentId;

  const image = await Image.findById(id).populate('likes');

  if (!image) {
    throw new Error(
      'An error occured while retrieving the image from supplied id'
    );
  }

  return image;
};

exports.saveProfileImageFromRequest = async (req) =>
  new Promise((resolve, reject) => {
    const { user, file } = req;

    cloudinaryUploader(user, file.buffer, { resolve, reject });
  });

// PROMISE RETURNS LIST OF SAVED IMAGES
exports.saveImagesFromRequest = async (req) =>
  new Promise((resolve, reject) => {
    const { user, files } = req;
    const imageList = [];

    files.forEach(async (item) => {
      try {
        cloudinaryUploader(
          user,
          item.buffer,
          { resolve, reject },
          files,
          imageList
        );
      } catch (error) {
        reject(new Error(error));
      }
    });
  });

exports.deleteImagesFromRequest = async (req) => {
  cloudinary.config(CONFIG.CLOUDINARY);

  const postId = req.postId ? req.postId : req.body.postId;

  try {
    const post = await Post.findOne({ _id: postId }).populate('images');

    if (!post || !post.images || post.images.length === 0) {
      return;
    }

    post.images.forEach(async (item) => {
      cloudinary.uploader.destroy(
        item.publicId,
        { resource_type: item.resourceType },
        async (error, result) => {
          if (error) {
            throw new Error(error.message);
          }

          const deleteResult = await Image.findByIdAndDelete(item._id);

          if (!result || !deleteResult) {
            throw new Error('An error occured deleting the image');
          }
        }
      );
    });
  } catch (error) {
    console.log('33', error);
  }
};
