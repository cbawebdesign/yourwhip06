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

exports.updateCommentFromRequest = async (req) => {
  const { user, images } = req;
  const { description, commentId } = req.body;
  let comment;

  if (images) {
    // TODO: ADD COMMENT IMAGES
  } else {
    comment = await Comment.findByIdAndUpdate(commentId, {
      description,
    });
  }

  return comment;
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
    comments = await Comment.find({
      post: { _id: parentId },
      _id: {
        $nin: [...req.user.filters.hiddenComments],
      },
      createdBy: {
        $nin: [...req.user.filters.hiddenUsers],
      },
    })
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
  } else if (commentType === 'FLAGGED') {
    comments = await Comment.find({ flagged: true })
      .populate('createdBy')
      .populate('post')
      .populate('image')
      .populate('comment')
      .populate('likes')
      .sort('-dateTime');
  } else if (commentType === 'EDIT') {
    comments = await Comment.find({ comment });
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
    req.activityType === 'LIKE_REPLY' ||
    req.activityType === 'FLAGGED' ||
    req.activityType === 'EXPLORE' ||
    req.activityType === 'DELETE_REPLY'
  ) {
    id = commentId;
  } else {
    id = parentId; // USED WHEN LOOKING FOR COMMENT WHICH IS PARENT OF PARTICULAR REPLY
  }

  const comment = await Comment.findById(id)
    .populate('post')
    .populate('likes')
    .populate('createdBy');

  if (!comment) {
    throw new Error(
      `An error occured while retrieving the comment from supplied id: ${id}`
    );
  }

  return comment;
};

exports.getFlaggedCommentsFromRequest = async (req) => {
  try {
    const comments = await Comment.find({ flagged: true })
      .populate('createdBy')
      .populate('likes')
      .sort('-dateTime');

    return comments;
  } catch (error) {
    console.log('53', error);
  }
};
