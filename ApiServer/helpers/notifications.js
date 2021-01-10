const sendNotification = require('../emails_and_notifications/notifications');

const CONFIG = require('../constants');

const getActionText = (activity) => {
  console.log(activity);
  switch (activity) {
    case 'LIKE_POST':
      return 'liked your post';
    case 'SHARE_POST':
      return 'shared your post';
    case 'LIKE_COMMENT':
      return 'liked your comment';
    case 'LIKE_IMAGE':
      return 'liked your photo';
    case 'FOLLOW':
      return 'started following you';
    case 'SHARE_IMAGE':
      return 'shared one of your images';
    case 'POST_COMMENT':
      return 'commented on your post';
    case 'IMAGE_COMMENT':
      return 'commented on your image';
    case 'REPLY':
      return 'replied to your comment';
    case 'LIKE_REPLY':
      return 'liked your reply';
    default:
      return null;
  }
};

exports.createNotificationFromActivity = (
  userAction,
  userReceiver,
  activityType,
  post
) => {
  // CREATE PUSH NOTIFICATIONS
  // TO ALL PEOPLE THAT FOLLOW CURRENTUSER
  var message = {
    app_id: CONFIG.ONESIGNAL_APP_ID,
    headings: {
      en: `${`Posted just now on ${CONFIG.COMPANY_INFO.app_name}`}`,
    },
    contents: {
      en: `${userAction.firstName} ${userAction.lastName} ${getActionText(
        activityType
      )}`,
    },
    app_url: `${CONFIG.APP_SCHEME}://detail/?${post._id}`,
    channel_for_external_user_ids: 'push',
    include_external_user_ids: userReceiver._id.toString(),
  };
  sendNotification(message);
};
