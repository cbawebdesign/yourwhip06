const HttpStatus = require('http-status-codes/index');

const postHelper = require('../helpers/posts');
const userHelper = require('../helpers/users');

exports.getFlaggedPostsFeed = async (req, res) => {
  const currentUser = req.user;
  const { skip } = req.params;

  try {
    req.isFlagged = true;
    const posts = await postHelper.getPostsFromRequest(req);

    res.status(HttpStatus.OK).send({ flaggedPostsFeed: posts, skip });
  } catch (error) {
    console.log('48', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};

exports.reportPost = async (req, res) => {
  const currentUser = req.user;

  try {
    // SET USER MODEL
    const reportedPost = await postHelper.getOnePostFromRequest(req);

    req.user = reportedPost.createdBy;
    const reportedUser = await userHelper.findOneUserFromRequest(req);

    if (
      reportedPost.flagged &&
      currentUser.reportedPosts.some(
        (postId) => postId === reportedPost._id.toString()
      )
    ) {
      return res.status(HttpStatus.OK).send({
        success:
          'You have already successfully reported this post to our admins.',
      });
    } else {
      reportedUser.reportedBy.push(currentUser._id);
      await reportedUser.save();

      currentUser.reportedPosts.push(reportedPost._id);
      await currentUser.save();
    }

    // SET POST AS FLAGGED
    reportedPost.flagged = true;
    await reportedPost.save();

    // UPDATE REPORTED POSTS FEED
    const flaggedFeed = await postHelper.getFlaggedPostsFromRequest(req);

    res.status(HttpStatus.OK).send({
      success:
        'The post has been reported to our admins for breaking community guidelines and will be reviewed within 24 hours. ',
      flaggedFeed,
    });
  } catch (error) {
    console.log('47', error);
  }
};

exports.unflagPost = async (req, res) => {
  const postId = req.body.parentId;

  try {
    // SET USER MODEL
    const reportedPost = await postHelper.getOnePostFromRequest(req);

    req.user = reportedPost.createdBy;
    const reportedUser = await userHelper.findOneUserFromRequest(req);

    // REMOVE REPORTED FLAG FROM USER
    // TODO: CREATE FLAG COUNT FOR USER MODEL

    // SET POST AS FLAGGED
    reportedPost.flagged = false;
    await reportedPost.save();

    res.status(HttpStatus.OK).send({
      success: 'The reported post has been unflagged ',
      postId,
    });
  } catch (error) {
    console.log('53', error);
  }
};
