const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
    comment: { type: Schema.Types.ObjectId, ref: 'Comment' },
    image: { type: Schema.Types.ObjectId, ref: 'Image' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    description: String,
    // images: [String], // TODO: ENABLE UPLOADING IMAGES TO COMMENTS
    likes: [{ type: Schema.Types.ObjectId, ref: 'Like' }],
    replies: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    activityId: String, // THE LINKED ACTIVITY MODEL ID
    flagged: Boolean,
    dateTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { collection: 'comments' }
);

const ModelClass = mongoose.model('Comment', commentSchema, 'comments');

module.exports = ModelClass;
