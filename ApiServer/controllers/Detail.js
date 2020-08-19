const HttpStatus = require('http-status-codes/index');

const postHelper = require('../helpers/posts');
const imageHelper = require('../helpers/images');
const activityHelper = require('../helpers/activities');
const likeHelper = require('../helpers/likes');
const shareHelper = require('../helpers/shares');
const generalHelper = require('../helpers/general');

exports.getOnePost = async (req, res) => {
  try {
    const post = await postHelper.getOnePostFromRequest(req);

    res.status(HttpStatus.OK).send(post);
  } catch (error) {
    console.log('12', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};

exports.likeImagePress = async (req, res) => {
  const { user } = req;

  const image = await imageHelper.getOneImageFromRequest(req);
  req.image = image;
  req.activityType = 'LIKE_IMAGE';

  const hasLikeByUser = image.likes.some(
    (item) => item.createdBy.toString() === user._id.toString()
  );

  if (hasLikeByUser) {
    // REMOVE LIKE
    image.likes = image.likes.filter(
      (item) => item.createdBy.toString() !== user._id.toString()
    );

    try {
      await generalHelper.deleteLikeAndActivityFromRequest(req);
      await image.save();

      // DELETE ACTIVITY
      req.activityType = 'LIKE_IMAGE';
      const result = await activityHelper.deleteActivityFromRequest(req);

      if (!result) {
        throw new Error('An error occurred deleting the like image activity');
      }

      res.status(HttpStatus.OK).send({ success: 'Like successfully removed' });
    } catch (error) {
      console.log('13', error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: error.message });
    }
  } else {
    try {
      const newLike = await likeHelper.buildLikeFromRequest(req);
      await activityHelper.buildActivityFromRequest(req);

      image.likes.push(newLike);
      await image.save();

      res.status(HttpStatus.OK).send({ success: 'Image liked successfully' });
    } catch (error) {
      console.log('14', error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: error.message });
    }
  }
};

exports.shareImage = async (req, res) => {
  const image = await imageHelper.getOneImageFromRequest(req);
  req.image = image;
  req.activityType = 'SHARE_IMAGE';

  try {
    const newShare = await shareHelper.buildShareFromRequest(req);
    await activityHelper.buildActivityFromRequest(req);

    image.shares.push(newShare);
    await image.save();

    res.status(HttpStatus.OK).send({ success: 'Image successfully shared' });
  } catch (error) {
    console.log('15', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};
