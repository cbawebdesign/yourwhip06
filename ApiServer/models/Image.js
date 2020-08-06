const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const imageSchema = new mongoose.Schema(
  {
    image: String,
    publicId: String,
    resourceType: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    likes: [{ type: Schema.Types.ObjectId, ref: 'Like' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    shares: [{ type: Schema.Types.ObjectId, ref: 'Share' }],
    dateTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { collection: 'images' }
);

const ModelClass = mongoose.model('Image', imageSchema, 'images');

module.exports = ModelClass;
