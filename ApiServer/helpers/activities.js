const Activity = require('../models/Activity');

exports.buildActivityFromRequest = async (req) => {
  const { user, post, comment, image, activityType, createdBy } = req;

  let activity;

  if (
    activityType === 'LIKE_POST' ||
    activityType === 'SHARE_POST' ||
    activityType === 'POST_COMMENT'
  ) {
    activity = new Activity({
      user_action: user,
      user_receiver: post.createdBy,
      activity: activityType,
      post,
    });
  } else if (
    activityType === 'LIKE_COMMENT' ||
    activityType === 'LIKE_REPLY' ||
    activityType === 'REPLY'
  ) {
    activity = new Activity({
      user_action: user,
      user_receiver: comment.createdBy,
      activity: activityType,
      comment,
    });
  } else if (
    activityType === 'LIKE_IMAGE' ||
    activityType === 'IMAGE_COMMENT' ||
    activityType === 'SHARE_IMAGE'
  ) {
    activity = new Activity({
      user_action: user,
      user_receiver: image.createdBy,
      activity: activityType,
      image,
    });
  } else if (activityType === 'FOLLOW') {
    activity = new Activity({
      user_action: user,
      user_receiver: createdBy,
      activity: activityType,
    });
  }

  const result = await activity.save();

  if (!result) {
    throw new Error('An error occurred saving the new activity');
  }

  return activity;
};
