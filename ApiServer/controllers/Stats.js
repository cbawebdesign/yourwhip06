const HttpStatus = require('http-status-codes/index');

const likeHelper = require('../helpers/likes');
const userHelper = require('../helpers/users');

exports.getMonthly = async (req, res) => {
  const likesCount = await likeHelper.getMonthlyLikesFromRequest(req);
  const followersCount = await userHelper.getMonthlyFollowersFromRequest(req);
  const dailyLikesList = await likeHelper.getDailyLikesPerMonthFromRequest(req);
  const dailyFollowersList = await userHelper.getDailyFollowersPerMonthFromRequest(
    req
  );

  req.getgetPreviousPeriod = true;
  const likesCountPreviousPeriod = await likeHelper.getMonthlyLikesFromRequest(
    req
  );
  const followersCountPreviousPeriod = await userHelper.getMonthlyFollowersFromRequest(
    req
  );

  const likesGrowth =
    likesCountPreviousPeriod > 0
      ? ((likesCount - likesCountPreviousPeriod) / likesCountPreviousPeriod) *
        100
      : 0;
  const followersGrowth =
    followersCountPreviousPeriod > 0
      ? ((followersCount - followersCountPreviousPeriod) /
          followersCountPreviousPeriod) *
        100
      : 0;

  res.status(HttpStatus.OK).send({
    likesCount: likesCount,
    followersCount: followersCount,
    likesGrowth,
    followersGrowth,
    dailyLikesList,
    dailyFollowersList,
  });
};
