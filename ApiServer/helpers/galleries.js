const Gallery = require('../models/Gallery');

exports.getGalleriesFromRequest = async (req) => {
  const galleries = await Gallery.find({ createdBy: req.user })
    .populate('createdBy')
    .populate('images')
    .populate({
      path: 'images',
      populate: {
        path: 'likes',
      },
    })
    .populate({
      path: 'images',
      populate: {
        path: 'comments',
      },
    })
    .populate({
      path: 'images',
      populate: {
        path: 'shares',
      },
    })
    .sort('-dateTime');

  if (!galleries) {
    throw new Error(
      'An error occurred while retrieving galleries for supplied user id'
    );
  }

  return galleries;
};

exports.buildGalleryFromRequest = async (req) => {
  const { user, images } = req;
  const { galleryName } = req.body;

  const newGallery = new Gallery({
    createdBy: user._id,
    name: galleryName,
    images,
  });

  const result = await newGallery.save();

  if (!result) {
    throw new Error('An error occurred saving the new post');
  }

  return newGallery;
};

exports.updateGalleryFromRequest = async (req) => {
  const { images } = req;
  const { galleryName } = req.body;

  const galleries = await this.getGalleriesFromRequest(req);
  const gallery = galleries.find((item) => item.name === galleryName);

  if (images) {
    images.forEach((item) => {
      gallery.images.push(item);
    });
  }

  await gallery.save();
};
