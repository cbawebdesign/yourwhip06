const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new mongoose.Schema(
  {
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    description: String,
    caption: String,
    images: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'Like' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    shares: [{ type: Schema.Types.ObjectId, ref: 'Share' }],
    sharedPost: { type: Schema.Types.ObjectId, ref: 'Post' },
    sharedImage: { type: Schema.Types.ObjectId, ref: 'Image' },
    flagged: Boolean,
    shouldExpire: { type: Boolean, required: true },
    dateTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { collection: 'posts' }
);
postSchema.index(
  { dateTime: 1 },
  {
    expireAfterSeconds: 60 * 60 * 24,
    partialFilterExpression: { shouldExpire: true },
  }
);

const ModelClass = mongoose.model('Post', postSchema, 'posts');

module.exports = ModelClass;
