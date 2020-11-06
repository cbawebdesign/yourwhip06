const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const activitySchema = new mongoose.Schema(
  {
    user_action: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    user_receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    activity: String,
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
    comment: { type: Schema.Types.ObjectId, ref: 'Comment' },
    image: { type: Schema.Types.ObjectId, ref: 'Image' },
    dateTime: {
      type: Date,
      required: true,
      default: Date.now,
      expires: 2678400, // 1 MONTH: TO PREVENT DB OVERLOADING WITH ACTIVITY OBJECTS
    },
  },
  { collection: 'posts' }
);

const ModelClass = mongoose.model('Activity', activitySchema, 'activities');

module.exports = ModelClass;
