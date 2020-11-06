const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const likeSchema = new mongoose.Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
    comment: { type: Schema.Types.ObjectId, ref: 'Comment' },
    image: { type: Schema.Types.ObjectId, ref: 'Image' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    offeredTo: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    activityId: String, // THE LINKED ACTIVITY MODEL ID
    dateTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { collection: 'likes' }
);

const ModelClass = mongoose.model('Like', likeSchema, 'likes');

module.exports = ModelClass;
