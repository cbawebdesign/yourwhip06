const Share = require('../models/Share');

exports.buildShareFromRequest = async (req) => {
  const { user, post, comment, image, activityType } = req;

  let share;

  if (activityType === 'SHARE_POST') {
    share = new Share({
      post,
      createdBy: user,
    });
  } else if (
    activityType === 'SHARE_COMMENT' ||
    activityType === 'SHARE_REPLY'
  ) {
    share = new Share({
      comment,
      createdBy: user,
    });
  } else if (activityType === 'SHARE_IMAGE') {
    share = new Share({
      image,
      createdBy: user,
    });
  }

  const result = await share.save();

  if (!result) {
    throw new Error('An error occurred saving the new share');
  }

  return share;
};
