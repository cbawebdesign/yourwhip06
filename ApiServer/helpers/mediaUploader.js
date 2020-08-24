const cloudinary = require('cloudinary').v2;

const Image = require('../models/Image');

const CONFIG = require('../constants');

exports.cloudinaryUploader = async (
  user,
  buffer,
  promise,
  files,
  imageList
) => {
  cloudinary.config(CONFIG.CLOUDINARY);

  cloudinary.uploader
    .upload_stream(
      {
        resource_type: 'auto',
        secure: true,
        folder: CONFIG.CLOUDINARY.MEDIA_FOLDER,
        width: 400,
        crop: 'scale',
      },
      async (error, result) => {
        if (error) {
          promise.reject(new Error(error.message));
        }

        const image = new Image({
          createdBy: user,
          image: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type,
        });
        const savedImage = await image.save();

        if (savedImage) {
          if (!files) {
            return promise.resolve(image);
          }

          imageList.push(image);

          // RESOLVE PROMISE AFTER FINAL IMAGE HAS BEEN SAVED
          if (files.length === imageList.length) {
            promise.resolve(imageList);
          }
        } else {
          promise.reject(
            new Error('An error occured processing the media item')
          );
        }
      }
    )
    .end(buffer);
};
