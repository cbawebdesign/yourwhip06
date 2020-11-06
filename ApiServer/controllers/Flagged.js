const HttpStatus = require('http-status-codes/index');

const postHelper = require('../helpers/posts');

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
