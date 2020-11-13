const HttpStatus = require('http-status-codes/index');

const imageHelper = require('../helpers/images');
const postHelper = require('../helpers/posts');
const userHelper = require('../helpers/users');
const activityHelper = require('../helpers/activities');
const likeHelper = require('../helpers/likes');
const shareHelper = require('../helpers/shares');
const galleryHelper = require('../helpers/galleries');
const generalHelper = require('../helpers/general');

exports.getFeed = async (req, res) => {
  const currentUser = req.user;
  const { skip } = req.params;

  try {
    const posts = await postHelper.getPostsFromRequest(req);

    res.status(HttpStatus.OK).send({ homeFeed: posts, skip });
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
    // REMOVE LIKE
    post.likes = post.likes.filter(
      (item) => item.createdBy.toString() !== user._id.toString()
    );

    try {
      const deletedLike = await likeHelper.deleteLikeFromRequest(req);

      await post.save();

      // DELETE ACITIVITY
      req.activityId = deletedLike.activityId;
      const result = await activityHelper.deleteActivityFromRequest(req);

      if (!result) {
        throw new Error('An error occurred deleting the like post activity');
      }

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
      const activity = await activityHelper.buildActivityFromRequest(req);
      const newLike = await likeHelper.buildLikeFromRequest(req);

      // UPDATE LIKE WITH ACITIVITY DATA
      newLike.activityId = activity._id;
      await newLike.save();

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
  try {
    const post = await postHelper.getOnePostFromRequest(req);
    req.post = post;
    req.activityType = 'SHARE_POST';

    const activity = await activityHelper.buildActivityFromRequest(req);
    const newShare = await shareHelper.buildShareFromRequest(req);

    newShare.activityId = activity._id;
    await newShare.save();

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

    // CURRENTLY PASSING BACK LIMITED NUMBER OF POSTS
    // LIMITED BASED ON PAGINATION_LIMIT CONSTANT MOBILE APP
    // TODO: get posts for specific user
    const postsList = await postHelper.getPostsFromRequest(req);

    res.status(HttpStatus.OK).send(postsList);
  } catch (error) {
    console.log('20', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};

exports.edit = async (req, res) => {
  const { galleryType } = req.body;

  let images;
  let sharedPost;

  try {
    // STORE NEW MEDIA
    if (req.files.length > 0) {
      // FIRST, DELETE ORIGINAL MEDIA
      await imageHelper.deleteImagesFromRequest(req);

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

    // UPDATE POST DATA
    await postHelper.updatePostFromRequest(req);

    // CURRENTLY PASSING BACK LIMITED NUMBER OF POSTS
    // LIMITED BASED ON PAGINATION_LIMIT CONSTANT MOBILE APP
    // TODO: get posts for specific user
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
    // const post = await postHelper.getOnePostFromRequest(req);

    // DELETE IMAGES
    await imageHelper.deleteImagesFromRequest(req);

    // DELETE COMMENTS
    // DELETE LIKES
    // DELETE SHARES
    // TODO

    const deletedPost = await postHelper.deleteOnePostFromRequest(req);

    if (!deletedPost) {
      throw new Error('An error occured while deleting the post');
    }

    res
      .status(HttpStatus.OK)
      .send({ success: 'Post deleted successfully', postId, fromScreen });
  } catch (error) {
    console.log('21', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};

exports.hidePost = async (req, res) => {
  const currentUser = req.user;
  const { postId } = req.body;

  try {
    // SET USER MODEL
    currentUser.filters.hiddenPosts.push(postId);
    await currentUser.save();

    // UPDATE FEED
    const posts = await postHelper.getPostsFromRequest(req);

    res.status(HttpStatus.OK).send(posts);
  } catch (error) {
    console.log('46', error);
  }
};

exports.hidePostsByUser = async (req, res) => {
  const currentUser = req.user;
  const { hiddenUserId } = req.body;

  try {
    // SET USER MODEL
    currentUser.filters.hiddenUsers.push(hiddenUserId);
    await currentUser.save();

    // UPDATE FEED
    const posts = await postHelper.getPostsFromRequest(req);

    res.status(HttpStatus.OK).send(posts);
  } catch (error) {
    console.log('47', error);
  }
};
