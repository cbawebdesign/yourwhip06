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
      await generalHelper.deleteLikeAndActivityFromRequest(req);
      await reply.save();

      // DELETE ACTIVITY
      req.activityType = 'LIKE_REPLY';

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
      const newLike = await likeHelper.buildLikeFromRequest(req);
      await activityHelper.buildActivityFromRequest(req);

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

    const newReply = await commentHelper.buildCommentFromRequest(req);
    await activityHelper.buildActivityFromRequest(req);

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
    // DELETE REPLY
    await commentHelper.deleteOneCommentFromRequest(req);

    // DELETE REPLY FROM COMMENT OBJECT
    req.activityType = 'DELETE_REPLY';
    const parentComment = await commentHelper.getOneCommentFromRequest(req);

    parentComment.replies = parentComment.replies.filter(
      (id) => id.toString() !== commentId.toString()
    );
    await parentComment.save();

    // RETURN UPDATED FEED
    req.commentType = 'REPLY';
    const replies = await commentHelper.getCommentsFromRequest(req);

    res.status(HttpStatus.OK).send({
      success: 'Reply deleted successfully',
      id: parentId,
      replyId: commentId,
      action: 'DELETE_COMMENT',
      replies,
    });
  } catch (error) {
    console.log('28', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};
