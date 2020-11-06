const HttpStatus = require('http-status-codes/index');

const userHelper = require('../helpers/users');
const postHelper = require('../helpers/posts');
const likeHelper = require('../helpers/likes');
const activityhelper = require('../helpers/activities');

exports.getProfile = async (req, res) => {
  const skip = Number(req.params.skip);

  const user = await userHelper.findOneUserFromRequest(req);

  if (!user) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      error:
        'An error occurred while retrieving the user or the user does not exist',
    });
  }

  const posts = await postHelper.getPostsByUserFromRequest(req);
  const postsCount = await postHelper.getCountFromRequest(req);
  const likesCount = await likeHelper.getCountFromRequest(req);

  res.status(HttpStatus.OK).send({
    skip,
    user,
    feed: posts,
    likesCount: likesCount,
    followersCount: user.followers.length,
    postsCount: postsCount,
  });
};

exports.followUserPress = async (req, res) => {
  const { user } = req.body;
  const currentUser = req.user;

  const isFollowing = currentUser.following.some(
    (id) => id.toString() === user._id.toString()
  );

  if (isFollowing) {
    try {
      const followedUser = await userHelper.findOneUserFromRequest(req);

      if (!followedUser) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          error:
            'An error occurred while retrieving the user or the user does not exist',
        });
      }

      // REMOVE FOLLOWER ID FROM FOLLOWERS AND FOLLOWING OBJECTS
      let activityId;
      followedUser.followers = followedUser.followers.filter((item) => {
        if (item.user.toString() === currentUser._id.toString()) {
          activityId = item.activityId;
        }

        return item.user.toString() !== currentUser._id.toString();
      });
      currentUser.following = currentUser.following.filter(
        (item) => item._id.toString() !== user._id.toString()
      );

      const resultFollowedUser = await followedUser.save();
      const resultCurrentUser = await currentUser.save();

      // DELETE FOLLOW ACTIVITY
      req.activityId = activityId;
      const result = await activityhelper.deleteActivityFromRequest(req);

      if (!result) {
        throw new Error('An error occured while deleting the follow activity');
      }

      req.findCurrentUser = true;
      const updatedUser = await userHelper.findOneUserFromRequest(req);

      if (!resultFollowedUser || !resultCurrentUser) {
        throw new Error('An error occured saving the follow press action');
      }

      res.status(HttpStatus.OK).send(updatedUser);
    } catch (error) {
      console.log('22', error);
    }
  } else {
    try {
      // BEFORE ADDING THE NEW USER, MAKE SURE TO POPULATE THE
      // 'FOLLOWING' FIELD, WHICH IS USED TO DISPLAY FOLLOWERS FEED
      const followedUser = await userHelper.findOneUserFromRequest(req);

      if (!followedUser) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          error:
            'An error occurred while retrieving the user or the user does not exist',
        });
      }

      // CREATE NEW ACTIVITY
      req.activityType = 'FOLLOW';
      req.createdBy = user;
      const activity = await activityhelper.buildActivityFromRequest(req);

      followedUser.followers.push({
        user: currentUser,
        activityId: activity._id,
      });
      currentUser.following.push(followedUser);

      const resultFollowedUser = await followedUser.save();
      const resultCurrentUser = await currentUser.save();

      req.findCurrentUser = true;
      const updatedUser = await userHelper.findOneUserFromRequest(req);

      if (!resultFollowedUser || !resultCurrentUser) {
        throw new Error('An error occured saving the follow press action');
      }

      res.status(HttpStatus.OK).send(updatedUser);
    } catch (error) {
      console.log('23', error);
    }
  }
};
