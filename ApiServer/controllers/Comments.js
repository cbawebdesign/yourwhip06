const HttpStatus = require('http-status-codes/index');

const Comment = require('../models/Comment');
const Post = require('../models/Post');
const Image = require('../models/Image');
const Like = require('../models/Like');
const Activity = require('../models/Activity');

const commentHelper = require('../helpers/comments');
const postHelper = require('../helpers/posts');
const likeHelper = require('../helpers/likes');
const activityHelper = require('../helpers/activities');
const imageHelper = require('../helpers/images');
const generalHelper = require('../helpers/general');

exports.getPostCommentFeed = async (req, res) => {
  req.commentType = 'POST_COMMENT';

  try {
    const comments = await commentHelper.getCommentsFromRequest(req);

    res.status(HttpStatus.OK).send(comments);
  } catch (error) {
    console.log('5', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};

exports.getImageCommentFeed = async (req, res) => {
  req.commentType = 'IMAGE_COMMENT';

  try {
    const comments = await commentHelper.getCommentsFromRequest(req);

    res.status(HttpStatus.OK).send(comments);
  } catch (error) {
    console.log('6', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};

exports.likeCommentPress = async (req, res) => {
  const { user } = req;
  const { id } = req.body;

  req.activityType = 'LIKE_COMMENT';
  req.commentType = 'POST_COMMENT';
  const comment = await commentHelper.getOneCommentFromRequest(req);
  req.comment = comment;

  const hasLikeByUser = comment.likes.some(
    (item) => item.createdBy.toString() === user._id.toString()
  );

  if (hasLikeByUser) {
    //REMOVE LIKE
    comment.likes = comment.likes.filter(
      (item) => item.createdBy.toString() !== user._id.toString()
    );

    try {
      await generalHelper.deleteLikeAndActivityFromRequest(req);
      await comment.save();

      // DELETE ACTIVITY
      req.activityType = 'LIKE_COMMENT';
      const result = await activityHelper.deleteActivityFromRequest(req);

      if (!result) {
        throw new Error('An error occurred deleting the like comment activity');
      }

      // RETURN NEW LIST WITH UPDATED COMMENTS
      const comments = await commentHelper.getCommentsFromRequest(req);

      res
        .status(HttpStatus.OK)
        .send({ success: 'Like successfully removed', id, comments });
    } catch (error) {
      console.log('7', error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: error.message });
    }
  } else {
    try {
      const newLike = await likeHelper.buildLikeFromRequest(req);
      await activityHelper.buildActivityFromRequest(req);

      comment.likes.push(newLike);
      await comment.save();

      // RETURN NEW LIST WITH UPDATED COMMENTS
      const comments = await commentHelper.getCommentsFromRequest(req);

      res
        .status(HttpStatus.OK)
        .send({ success: 'Like successfully created', comments });
    } catch (error) {
      console.log('8', error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: error.message });
    }
  }
};

exports.composePostComment = async (req, res) => {
  const { parentId, fromScreen } = req.body;
  // const imagePath = req.file ? req.file.path : ''; // TODO: ENABLE UPLOADING IMAGES TO COMMENTS

  try {
    const post = await postHelper.getOnePostFromRequest(req);
    req.post = post;
    req.activityType = 'POST_COMMENT';
    req.commentType = 'POST_COMMENT';

    const comment = await commentHelper.buildCommentFromRequest(req);
    post.comments.push(comment);
    await post.save();

    const comments = await commentHelper.getCommentsFromRequest(req);
    await activityHelper.buildActivityFromRequest(req);

    res.status(HttpStatus.OK).send({
      success: 'Comment posted successfully',
      id: parentId,
      commentId: comment._id,
      type: 'POST',
      action: 'COMPOSE_COMMENT',
      fromScreen,
      comments,
    });
  } catch (error) {
    console.log('9', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};

exports.composeImageComment = async (req, res) => {
  const { parentId, fromScreen, type } = req.body;
  // const imagePath = req.file ? req.file.path : ''; // TODO: ENABLE UPLOADING IMAGES TO COMMENTS

  try {
    const image = await imageHelper.getOneImageFromRequest(req);
    req.image = image;
    req.commentType = 'IMAGE_COMMENT';
    req.activityType = 'IMAGE_COMMENT';

    const newComment = await commentHelper.buildCommentFromRequest(req);

    image.comments.push(newComment);
    await image.save();

    const comments = await commentHelper.getCommentsFromRequest(req);
    await activityHelper.buildActivityFromRequest(req);

    res.status(HttpStatus.OK).send({
      success: 'Comment posted successfully',
      id: parentId,
      commentId: newComment._id,
      type,
      fromScreen,
      comments,
      action: 'NEW_COMMENT',
    });
  } catch (error) {
    console.log('10', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  const { parentId, commentId, fromScreen, type } = req.body;

  try {
    // DELETE COMMENT
    await commentHelper.deleteOneCommentFromRequest(req);

    // DELETE ACTIVITY
    req.activityType = type === 'POST' ? 'POST_COMMENT' : 'IMAGE_COMMENT';
    req.id = parentId;
    const result = await activityHelper.deleteActivityFromRequest(req);

    if (!result) {
      throw new Error(
        `An error occurred deleting the ${type.toLowerCase()} comment activity`
      );
    }

    req.commentType = `${type}_COMMENT`;
    const comments = await commentHelper.getCommentsFromRequest(req);

    res.status(HttpStatus.OK).send({
      success: 'Comment deleted successfully',
      id: parentId,
      commentId,
      action: 'DELETE_COMMENT',
      fromScreen,
      comments,
      type,
    });
  } catch (error) {
    console.log('11', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};

exports.hideComment = async (req, res) => {
  const currentUser = req.user;
  const { commentId, type } = req.body;

  try {
    // SET USER MODEL
    currentUser.filters.hiddenComments.push(commentId);
    await currentUser.save();

    // UPDATE FEED
    req.commentType = type === 'POST' ? 'POST_COMMENT' : 'IMAGE_COMMENT';
    const comments = await commentHelper.getCommentsFromRequest(req);

    res.status(HttpStatus.OK).send(comments);
  } catch (error) {
    console.log('50', error);
  }
};

exports.hideCommentsByUser = async (req, res) => {
  const currentUser = req.user;
  const { hiddenUserId, type } = req.body;

  try {
    // SET USER MODEL
    currentUser.filters.hiddenUsers.push(hiddenUserId);
    await currentUser.save();

    // UPDATE FEED
    req.activityType = type === 'POST' ? 'POST_COMMENT' : 'IMAGE_COMMENT';
    const comments = await commentHelper.getCommentsFromRequest(req);

    res.status(HttpStatus.OK).send(comments);
  } catch (error) {
    console.log('51', error);
  }
};
