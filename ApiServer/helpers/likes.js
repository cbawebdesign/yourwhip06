const Like = require('../models/Like');

exports.buildLikeFromRequest = async (req) => {
  const { user, post, comment, image, activityType } = req;

  let like;

  if (activityType === 'LIKE_POST') {
    like = new Like({
      post,
      createdBy: user,
      offeredTo: post.createdBy._id,
    });
  } else if (activityType === 'LIKE_COMMENT' || activityType === 'LIKE_REPLY') {
    like = new Like({
      comment,
      createdBy: user,
      offeredTo: comment.createdBy,
    });
  } else if (activityType === 'LIKE_IMAGE') {
    like = new Like({
      image,
      createdBy: user,
      offeredTo: image.createdBy,
    });
  }

  const result = await like.save();

  if (!result) {
    throw new Error('An error occurred saving the new like');
  }

  return like;
};

exports.deleteLikeFromRequest = async (req) => {
  const { post, comment, user, image, activityType } = req;

  let like;

  try {
    if (activityType === 'LIKE_POST') {
      like = await Like.findOneAndDelete({
        post,
        createdBy: user,
      });
    } else if (
      activityType === 'LIKE_COMMENT' ||
      activityType === 'LIKE_REPLY'
    ) {
      like = await Like.findOneAndDelete({
        comment,
        createdBy: user,
      });
    } else if (activityType === 'LIKE_IMAGE') {
      like = await Like.findOneAndDelete({
        image,
        createdBy: user,
      });
    }

    return like;
  } catch (error) {
    throw new Error(error);
  }
};

exports.deleteLikeById = async (id) => {
  try {
    const result = await Like.findByIdAndDelete(id);

    return result;
  } catch (error) {
    console.log('36', error);
  }
};

exports.getCountFromRequest = async (req) => {
  const { userId } = req.params;

  try {
    const count = await Like.countDocuments({ offeredTo: userId });

    if (!count && count !== 0) {
      throw new Error(
        'An error occured while retrieving number of likes for user'
      );
    }

    return count;
  } catch (error) {
    console.log('34', error);
  }
};

exports.getMonthlyLikesFromRequest = async (req) => {
  const { user } = req;
  const { year, month } = req.params;
  const { getPreviousPeriod } = req;

  const getPeriod = () => {
    if (getPreviousPeriod) {
      return Number(month) - 1 > 0
        ? {
            month: Number(month),
            year: Number(year),
          }
        : {
            month: 12,
            year: Number(year) - 1,
          };
    }

    return {
      month: Number(month),
      year: Number(year),
    };
  };

  try {
    let matches;
    const startingYear = new Date(user.dateTime).getFullYear();
    const startingMonth = new Date(user.dateTime).getMonth();

    // MAKE SURE GETPERIOD() RETURNS VALUES THAT EXIST IN DATABASE
    // IF NOT, MATCHES.COUNT = 0
    if (
      getPeriod().year < startingYear ||
      (getPeriod().year == startingYear && getPeriod().month < startingMonth)
    ) {
      matches = [];
    } else {
      matches = await Like.aggregate([
        {
          $project: {
            year: { $year: '$dateTime' },
            month: { $month: '$dateTime' },
            offeredTo: 1,
          },
        },
        {
          $match: {
            year: getPeriod().year,
            month: getPeriod().month,
            offeredTo: req.user._id,
          },
        },
      ]);
    }

    if (!matches) {
      throw new Error(
        'An error occured while retrieving number of likes for date'
      );
    }

    return matches.length;
  } catch (error) {
    console.log('35', error);
  }
};

exports.getDailyLikesPerMonthFromRequest = async (req) => {
  const matchesList = [];

  const { year, month } = req.params;

  const daysInMonth = new Date(year, month, 0).getDate();

  const getMatches = async () => {
    for (let i = 1; i <= daysInMonth; i++) {
      try {
        const matches = await Like.aggregate([
          {
            $project: {
              year: { $year: '$dateTime' },
              month: { $month: '$dateTime' },
              date: { $dayOfMonth: '$dateTime' },
              offeredTo: 1,
            },
          },
          {
            $match: {
              year: Number(year),
              month: Number(month),
              date: i,
              offeredTo: req.user._id,
            },
          },
        ]);
        matchesList.push({
          date: i,
          likesCount: matches.length,
        });
      } catch (error) {
        console.log('36', error);
      }
    }

    return matchesList;
  };

  return getMatches();
};
