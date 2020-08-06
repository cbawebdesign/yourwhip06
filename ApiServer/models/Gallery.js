const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const gallerySchema = new mongoose.Schema(
  {
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: String,
    images: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
    dateTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { collection: 'galleries' }
);

const ModelClass = mongoose.model('Gallery', gallerySchema, 'gallery');

module.exports = ModelClass;
