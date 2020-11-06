const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const shareSchema = new mongoose.Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
    comment: { type: Schema.Types.ObjectId, ref: 'Comment' },
    image: { type: Schema.Types.ObjectId, ref: 'Image' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    activityId: String,
    dateTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { collection: 'shares' }
);

const ModelClass = mongoose.model('Share', shareSchema, 'shares');

module.exports = ModelClass;
