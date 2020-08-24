import { Share, Platform, Alert } from 'react-native';

export const onLikePressHelper = (
  userId,
  feed,
  postOrMedia,
  newLikeCheck = null
) => {
  const feedCopy = Array.isArray(feed) ? [...feed] : [{ ...feed }];
  let index;

  if (postOrMedia) {
    index = feedCopy.findIndex((item) => item._id === postOrMedia._id);
  } else if (newLikeCheck) {
    index = feedCopy.findIndex((item) => item._id === newLikeCheck.id);
  } else {
    index = 0;
  }

  if (
    feedCopy[index].likes.some((like) => like.createdBy.toString() === userId)
  ) {
    feedCopy[index].likes = feedCopy[index].likes.filter(
      (like) => like.createdBy.toString() !== userId
    );
  } else {
    feedCopy[index].likes.push({
      _id: Math.floor(Math.random() * 100).toString(),
      createdBy: userId,
    });
  }

  return feedCopy;
};

export const onLikeSharedImageHelper = (feed, sharedImage) => {
  const feedCopy = [...feed];

  const index = feedCopy.findIndex(
    (item) => item.sharedImage && item.sharedImage._id === sharedImage._id
  );
  feedCopy[index].sharedImage = sharedImage;

  return feedCopy;
};

export const onNewCommentHelper = (
  userId,
  feed,
  commentsUpdateCheck,
  isReply = false
) => {
  const feedCopy = Array.isArray(feed) ? [...feed] : [{ ...feed }];
  const type = isReply ? 'replies' : 'comments';
  const itemId = isReply
    ? commentsUpdateCheck.replyId
    : commentsUpdateCheck.commentId;

  feedCopy.forEach((item, index) => {
    if (commentsUpdateCheck.id === item._id) {
      if (
        commentsUpdateCheck.action === 'DELETE_COMMENT' ||
        commentsUpdateCheck.action === 'DELETE_REPLY'
      ) {
        feedCopy[index][type] = feedCopy[index][type].filter(
          (el) => (el._id ? el._id : el) !== itemId
        );
      } else {
        feedCopy[index][type].push({
          _id: itemId,
          createdBy: userId,
        });
      }
    }
  });

  return feedCopy;
};

export const onSharedImageNewCommentHelper = (feed, sharedImage, comments) => {
  const feedCopy = [...feed];

  const index = feedCopy.findIndex(
    (item) => item.sharedImage && item.sharedImage._id === sharedImage._id
  );

  feedCopy[index].sharedImage.comments = comments;

  return feedCopy;
};

export const onSocialMediaShare = async (userId, feed, postOrImage) => {
  let text = postOrImage.description ? postOrImage.description : '';

  if (Platform.OS === 'android') text = text.concat('https://bit.ly/2XmmQ7S');
  else text = text.concat('http://itunes.apple.com/app/id1453977874');

  try {
    const result = await Share.share(
      {
        subject: 'Download ReactNative Share App Now',
        title: 'Download ReactNativeShare App Now',
        message: text,
        url: 'app://reactnativeshare',
      },
      {
        dialogTitle: 'Share ReactNativeShare App',
        excludedActivityTypes: [],
      }
    );
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        const updatedFeed = onShareHelper(userId, feed, postOrImage);
        return { share: result, feed: updatedFeed };
      }

      const updatedFeed = onShareHelper(userId, feed, postOrImage);
      return { share: result, feed: updatedFeed };
    }

    if (result.action === Share.dismissedAction) {
      return result.action;
    }
  } catch (error) {
    Alert.alert(error.message);
  }
};

export const onShareHelper = (userId, feed, post) => {
  const feedCopy = post ? [...feed] : [{ ...feed }];
  let index;

  if (post) {
    index = feedCopy.findIndex((item) => item._id === post._id);
  } else {
    index = 0;
  }

  feedCopy[index].shares.push({
    _id: Math.floor(Math.random() * 100).toString(),
    createdBy: userId,
    post: post ? post._id : feedCopy[index]._id,
    dateTime: Date.now().toString(),
  });

  return feedCopy;
};

export const onSharedImageShareHelper = (userId, feed, sharedImage) => {
  const feedCopy = [...feed];

  const index = feedCopy.findIndex(
    (item) => item.sharedImage && item.sharedImage._id === sharedImage._id
  );

  feedCopy[index].sharedImage.shares.push({
    _id: Math.floor(Math.random() * 100),
    createdBy: userId,
  });

  return feedCopy;
};

export const onDeleteHelper = (feed, deletedItem) => {
  const feedCopy = [...feed];

  feedCopy.forEach((item, index) => {
    if (item._id === deletedItem._id) {
      feedCopy[index].deleted = true;
    }
  });

  return feedCopy;
};
