const Comment = require('../models/Comment');

exports.buildCommentFromRequest = async (req) => {
  const { user, post, image, comment, commentType } = req;
  const { description } = req.body;

  let newComment;

  if (commentType === 'POST_COMMENT') {
    newComment = new Comment({
      post,
      createdBy: user,
      description,
      // images: [req.file.map(item => item.path)], // TODO: ENABLE UPLOADING IMAGES TO COMMENTS
    });
  } else if (commentType === 'IMAGE_COMMENT') {
    newComment = new Comment({
      image,
      createdBy: user,
      description,
      // images: [req.file.map(item => item.path)], // TODO: ENABLE UPLOADING IMAGES TO COMMENTS
    });
  } else if (commentType === 'REPLY') {
    newComment = new Comment({
      comment,
      createdBy: user,
      description,
      // images: [req.file.map(item => item.path)], // TODO: ENABLE UPLOADING IMAGES TO COMMENTS
    });
  }

  const result = await newComment.save();

  if (!result) {
    throw new Error('An error occurred saving the new comment');
  }

  return newComment;
};

exports.deleteOneCommentFromRequest = async (req) => {
  const { commentId } = req.body;

  try {
    const result = await Comment.findByIdAndDelete(commentId.toString());
    if (!result) {
      throw new Error(
        `An error occured deleting the comment with id: ${commentId}`
      );
    }
  } catch (error) {
    console.log('31', error);
  }
};

exports.deleteCommentsFromRequest = async (req) => {
  const { userId } = req.body;

  try {
    const result = await Comment.deleteMany({ createdBy: userId });

    return result;
  } catch (error) {
    console.log('46', error);
  }
};

exports.getCommentsFromRequest = async (req) => {
  const { commentType } = req;
  let parentId =
    req.params && req.params.parentId ? req.params.parentId : req.body.parentId;

  let comments = [];

  if (commentType === 'POST_COMMENT') {
    comments = await Comment.find({ post: { _id: parentId } })
      .populate('createdBy')
      .populate('likes')
      .sort('-dateTime');
  } else if (
    commentType === 'IMAGE_COMMENT' ||
    commentType === 'SHARED_IMAGE_COMMENT'
  ) {
    comments = await Comment.find({ image: { _id: parentId } })
      .populate('createdBy')
      .populate('likes')
      .sort('-dateTime');
  } else if (commentType === 'REPLY') {
    comments = await Comment.find({ comment: { _id: parentId } })
      .populate('createdBy')
      .populate('likes')
      .sort('-dateTime');
  }

  if (!comments) {
    throw new Error(
      'An error occured while retrieving the comments from supplied id'
    );
  }

  return comments;
};

exports.getOneCommentFromRequest = async (req) => {
  const { parentId, commentId } = req.body;

  let id;

  if (
    req.activityType === 'LIKE_COMMENT' ||
    req.activityType === 'LIKE_REPLY'
  ) {
    id = commentId;
  } else {
    id = parentId;
  }

  const comment = await Comment.findById(id).populate('post').populate('likes');

  if (!comment) {
    throw new Error(
      `An error occured while retrieving the comment from supplied id: ${id}`
    );
  }

  return comment;
};
