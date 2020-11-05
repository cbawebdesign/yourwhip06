const Activity = require('../models/Activity');

exports.getActivitiesFromRequest = async (req) => {
  const { user } = req;
  const skip = Number(req.params.skip);
  const limit = Number(req.params.limit);

  try {
    const result = await Activity.find({ user_receiver: user }, null, {
      skip,
      limit,
    })
      .populate('user_action')
      .sort('-dateTime');

    return result;
  } catch (error) {
    console.log(error);
  }
};

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

exports.deleteActivityFromRequest = async (req) => {
  const { user } = req.body;
  const currentUser = req.user;
  const { activityType, post, image, comment, id } = req;

  let result;

  try {
    switch (activityType) {
      case 'FOLLOW':
        result = await Activity.findOneAndDelete({
          activity: activityType,
          user_action: currentUser,
          user_receiver: user,
        });
        break;
      case 'LIKE_POST':
        result = await Activity.findOneAndDelete({
          activity: activityType,
          user_action: currentUser,
          post,
        });
        break;
      case 'LIKE_IMAGE':
        result = await Activity.findOneAndDelete({
          activity: activityType,
          user_action: currentUser,
          image,
        });
        break;
      case 'LIKE_COMMENT':
      case 'LIKE_REPLY':
        result = await Activity.findOneAndDelete({
          activity: activityType,
          user_action: currentUser,
          comment,
        });
        break;
      case 'POST_COMMENT':
        result = await Activity.findOneAndDelete({
          activity: activityType,
          user_action: currentUser,
          post: { _id: id },
        });
        break;
      case 'IMAGE_COMMENT':
        result = await Activity.findOneAndDelete({
          activity: activityType,
          user_action: currentUser,
          image: { _id: id },
        });
        break;
      default:
        break;
    }

    return result;
  } catch (error) {
    console.log('46', error);
  }
};

exports.deleteActivitiesFromRequest = async (req) => {
  const user_action = req.body.userId;

  try {
    const result = await Activity.deleteMany({ user_action });

    return result;
  } catch (error) {
    console.log('47', error);
  }
};
