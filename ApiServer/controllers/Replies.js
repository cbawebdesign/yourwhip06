const HttpStatus = require('http-status-codes/index');

const imageHelper = require('../helpers/images');
const commentHelper = require('../helpers/comments');
const activityHelper = require('../helpers/activities');
const likeHelper = require('../helpers/likes');
const generalHelper = require('../helpers/general');

exports.getReplyFeed = async (req, res) => {
  req.commentType = 'REPLY';

  try {
    // NOTE: REPLIES ARE NORMAL COMMENTS DISGUISED AS REPLIES
    const replies = await commentHelper.getCommentsFromRequest(req);

    res.status(HttpStatus.OK).send(replies);
  } catch (error) {
    console.log('24', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};

exports.likeReplyPress = async (req, res) => {
  const { user } = req;

  req.activityType = 'LIKE_REPLY';

  const reply = await commentHelper.getOneCommentFromRequest(req);
  req.comment = reply;

  const hasLikeByUser = reply.likes.some(
    (item) => item.createdBy.toString() === user._id.toString()
  );

  if (hasLikeByUser) {
    // REMOVE LIKE
    reply.likes = reply.likes.filter(
      (item) => item.createdBy.toString() !== user._id.toString()
    );

    try {
      const deletedLike = await likeHelper.deleteLikeFromRequest(req);
      await reply.save();

      // DELETE ACTIVITY
      req.activityId = deletedLike.activityId;
      const result = await activityHelper.deleteActivityFromRequest(req);

      if (!result) {
        throw new Error('An error occurred deleting the like reply activity');
      }

      res.status(HttpStatus.OK).send({ success: 'Like successfully removed' });
    } catch (error) {
      console.log('25', error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: error.message });
    }
  } else {
    try {
      const activity = await activityHelper.buildActivityFromRequest(req);
      const newLike = await likeHelper.buildLikeFromRequest(req);

      // UPDATE LIKE WITH ACITIVITY DATA
      newLike.activityId = activity._id;
      await newLike.save();

      reply.likes.push(newLike);
      await reply.save();

      res.status(HttpStatus.OK).send({ success: 'Like successfully created' });
    } catch (error) {
      console.log('26', error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: error.message });
    }
  }
};

exports.composeReply = async (req, res) => {
  const { parentId } = req.body;
  // const imagePath = req.file ? req.file.path : ''; // TODO: ENABLE UPLOADING IMAGES TO COMMENTS

  try {
    const comment = await commentHelper.getOneCommentFromRequest(req);
    req.comment = comment;
    req.commentType = 'REPLY';
    req.activityType = 'REPLY';

    const activity = await activityHelper.buildActivityFromRequest(req);
    const newReply = await commentHelper.buildCommentFromRequest(req);

    newReply.activityId = activity._id;
    await newReply.save();

    comment.replies.push(newReply);
    await comment.save();

    const replies = await commentHelper.getCommentsFromRequest(req);

    res.status(HttpStatus.OK).send({
      success: 'Reply posted successfully',
      id: parentId,
      replyId: newReply._id,
      replies,
    });
  } catch (error) {
    console.log('27', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};

exports.deleteReply = async (req, res) => {
  const { parentId, commentId } = req.body;

  try {
    req.activityType = 'DELETE_REPLY';
    const reply = await commentHelper.getOneCommentFromRequest(req);

    // DELETE ALL LIKES AND LINKED ACTIVITIES
    reply.likes.forEach(async (likeId) => {
      const deletedLike = await likeHelper.deleteLikeById(likeId);

      if (!deletedLike) {
        throw Error('An error occurred deleting like on Comment object');
      }

      req.activityId = deletedLike.activityId;
      const deletedActivity = await activityHelper.deleteActivityFromRequest(
        req
      );

      if (!deletedActivity) {
        throw Error(
          'An error occurred deling the activity from like on Comment object'
        );
      }
    });

    // DELETE ACTIVITY
    req.activityId = reply.activityId;
    const result = await activityHelper.deleteActivityFromRequest(req);

    // DELETE REPLY FROM COMMENT OBJECT
    req.activityType = null;
    const parentComment = await commentHelper.getOneCommentFromRequest(req);

    parentComment.replies = parentComment.replies.filter(
      (id) => id.toString() !== commentId.toString()
    );
    await parentComment.save();

    // DELETE REPLY
    await commentHelper.deleteOneCommentFromRequest(req);

    // RETURN UPDATED FEED
    req.commentType = 'REPLY';
    const replies = await commentHelper.getCommentsFromRequest(req);

    res.status(HttpStatus.OK).send({
      success: 'Reply deleted successfully',
      id: parentId,
      replyId: commentId,
      action: 'DELETE_REPLY',
      replies,
    });
  } catch (error) {
    console.log('28', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};
