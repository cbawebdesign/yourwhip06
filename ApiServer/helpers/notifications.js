const sendNotification = require('../emails_and_notifications/notifications');

const CONFIG = require('../constants');

const getActionText = (activity) => {
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

const getAppUrl = (activityType, item, userAction) => {
  switch (activityType) {
    case 'LIKE_POST': // WORKING
      return `${CONFIG.APP_SCHEME}://detail/?post&screen=post&id=${item._id}`;
    case 'SHARE_POST': // WORKING
      return `${CONFIG.APP_SCHEME}://detail/?post&screen=explore&id=${null}`;
    case 'LIKE_COMMENT': // WORKING
      return `${CONFIG.APP_SCHEME}://detail/?post&screen=comments&id=${item.post._id}`;
    case 'LIKE_IMAGE':
      return `${
        CONFIG.APP_SCHEME
      }://detail/?post&screen=post&id=${item.post.toString()}`;
    case 'FOLLOW': //
      return `${CONFIG.APP_SCHEME}://detail/?profile&screen=profile&id=${null}`;
    case 'SHARE_IMAGE': // WORKING BUT WRONG MESSAGE
      return `${CONFIG.APP_SCHEME}://detail/?explore&screen=explore&id=${null}`;
    case 'POST_COMMENT': // WORKING
      return `${CONFIG.APP_SCHEME}://detail/?post&screen=post&id=${item._id}`;
    case 'IMAGE_COMMENT': // WORKING
      return `${CONFIG.APP_SCHEME}://detail/?post&screen=post&id=${item.post._id}`;
    case 'REPLY': // WORKING
      return `${CONFIG.APP_SCHEME}://detail/?comment&screen=replies&id=${item._id}`;
    case 'LIKE_REPLY': // WORKING
      return `${CONFIG.APP_SCHEME}://detail/?comment&screen=replies&id=${item.comment._id}`;
    default:
      return null;
  }
};

exports.createNotificationFromActivity = (
  userAction,
  userReceiver,
  activityType,
  item
) => {
  // CREATE PUSH NOTIFICATIONS
  // TO ALL PEOPLE THAT FOLLOW CURRENTUSER
  var message = {
    app_id: CONFIG.ONESIGNAL_APP_ID,
    headings: {
      en: `${`Just now on ${CONFIG.COMPANY_INFO.app_name}`}`,
    },
    contents: {
      en: `${userAction.firstName} ${userAction.lastName} ${getActionText(
        activityType
      )}`,
    },
    app_url: getAppUrl(activityType, item, userAction),
    channel_for_external_user_ids: 'push',
    include_external_user_ids: [userReceiver._id.toString()],
  };
  sendNotification(message);
};
