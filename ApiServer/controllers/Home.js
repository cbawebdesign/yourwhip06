const HttpStatus = require('http-status-codes/index');

const imageHelper = require('../helpers/images');
const postHelper = require('../helpers/posts');
const activityHelper = require('../helpers/activities');
const likeHelper = require('../helpers/likes');
const shareHelper = require('../helpers/shares');
const galleryHelper = require('../helpers/galleries');
const generalHelper = require('../helpers/general');

exports.getFeed = async (req, res) => {
  const { skip } = req.params;

  try {
    const posts = await postHelper.getPostsFromRequest(req);

    res.status(HttpStatus.OK).send({ posts, skip });
  } catch (error) {
    console.log('17', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};

exports.likePostPress = async (req, res) => {
  const { user } = req;
  const { fromScreen, parentId } = req.body;

  const post = await postHelper.getOnePostFromRequest(req);
  req.post = post;
  req.activityType = 'LIKE_POST';

  const hasLikeByUser = post.likes.some(
    (item) => item.createdBy.toString() === user._id.toString()
  );

  if (hasLikeByUser) {
    post.likes = post.likes.filter(
      (item) => item.createdBy.toString() !== user._id.toString()
    );

    try {
      await generalHelper.deleteLikeAndActivityFromRequest(req);
      await post.save();

      res.status(HttpStatus.OK).send({
        fromScreen,
        id: parentId,
        success: 'Like successfully removed',
      });
    } catch (error) {
      console.log('18', error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: error.message });
    }
  } else {
    try {
      const newLike = await likeHelper.buildLikeFromRequest(req);
      await activityHelper.buildActivityFromRequest(req);

      post.likes.push(newLike);
      await post.save();

      res.status(HttpStatus.OK).send({
        fromScreen,
        id: parentId,
        success: 'Post liked successfully',
      });
    } catch (error) {
      '2', ('2', error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: error.message });
    }
  }
};

exports.sharePost = async (req, res) => {
  const post = await postHelper.getOnePostFromRequest(req);
  req.post = post;
  req.activityType = 'SHARE_POST';

  try {
    const newShare = await shareHelper.buildShareFromRequest(req);
    await activityHelper.buildActivityFromRequest(req);

    post.shares.push(newShare);
    await post.save();

    res.status(HttpStatus.OK).send({ success: 'Post successfully shared' });
  } catch (error) {
    console.log('19', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};

exports.compose = async (req, res) => {
  const { galleryType } = req.body;

  let images;
  let sharedPost;

  try {
    if (req.files.length > 0) {
      images = await imageHelper.saveImagesFromRequest(req);
      req.images = images;
    }

    // CHECK IF COMPOSE IS FOR A SHARED POST
    if (req.body.parentId !== 'undefined') {
      sharedPost = await postHelper.getOnePostFromRequest(req);
      req.sharedPost = sharedPost;
    } else if (req.body.imageId !== 'undefined') {
      sharedImage = await imageHelper.getOneImageFromRequest(req);
      req.sharedImage = sharedImage;
    }

    // CHECK IF A GALLERY NAME HAS BEEN PROVIDED
    if (galleryType && galleryType === 'NEW_GALLERY') {
      await galleryHelper.buildGalleryFromRequest(req);
    } else if (galleryType && galleryType === 'EXISTING_GALLERY') {
      await galleryHelper.updateGalleryFromRequest(req);
    }

    await postHelper.buildPostFromRequest(req);

    // CURRENTLY PASSING BACK ALL EXISTING POSTS
    // TODO: update with passing userId
    const postsList = await postHelper.getPostsFromRequest(req);

    res.status(HttpStatus.OK).send(postsList);
  } catch (error) {
    console.log('20', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  const { postId, fromScreen } = req.body;

  try {
    // DELETE IMAGES BEFORE POST
    // OTHERWISE REFERENCE TO IMAGE IDS WILL GET LOST
    await imageHelper.deleteImagesFromRequest(req);
    await postHelper.deleteOnePostFromRequest(req);

    res
      .status(HttpStatus.OK)
      .send({ success: 'Post deleted successfully', postId, fromScreen });
  } catch (error) {
    console.log('21', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};
