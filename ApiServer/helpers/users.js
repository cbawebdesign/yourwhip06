const User = require('../models/User');
const CONFIG = require('../constants');

exports.buildUserFromRequest = async (req) => {
  const {
    firstName,
    lastName,
    email,
    password,
    birthday,
    gender,
    location,
    description,
  } = req.body;
  const { profileImage } = req;
  const user = new User({
    firstName,
    lastName,
    email,
    password,
    profileImage,
    birthday: birthday === 'undefined' || birthday === 'null' ? null : birthday,
    gender: gender === 'undefined' || gender === 'null' ? null : gender,
    location: location === 'undefined' || location === 'null' ? null : location,
    description,
  });

  try {
    const result = await user.save();

    if (!result) {
      throw new Error('An error occurred creating a new user account');
    }

    return user;
  } catch (error) {
    console.log('41', error);
  }
};

exports.findOneUserFromRequest = async (req) => {
  let userId;
  let email;

  if (req.findCurrentUser) {
    userId = req.user._id;
  } else if (req.params.userId || req.params.email) {
    userId = req.params.userId;
    email = req.params.email;
  } else if (req.body.user || req.user) {
    userId = req.body.user ? req.body.user._id : req.user._id;
  } else {
    email = req.body.email;
  }

  try {
    let userResult;

    if (email) {
      userResult = await User.findOne({ email });
    } else {
      userResult = await User.findById(userId).populate('following');
    }

    return userResult;
  } catch (error) {
    console.log('42', error);
  }
};

exports.findUsersFromRequest = async (req) => {
  const { user, friendsAndRemovedIds } = req;
  const enableSuggestions = CONFIG.ENABLE_CONTROL_SUGGESTIONS
    ? user.settings.enableSuggestions
    : CONFIG.ENABLE_SUGGESTIONS;
  const { interests } = req.user;
  const searchInput =
    req.params && req.params.searchInput
      ? req.params.searchInput.toLowerCase()
      : null;
  const excludeIds = friendsAndRemovedIds
    ? [user._id, ...friendsAndRemovedIds]
    : [user._id];

  try {
    let users;

    if (req.search) {
      users = User.aggregate([
        {
          $project: {
            name: {
              $concat: [
                { $toLower: '$firstName' },
                ' ',
                { $toLower: '$lastName' },
              ],
            },
          },
        },
        { $match: { name: { $regex: searchInput } } },
      ]);

      return users;
    } else {
      if (enableSuggestions) {
        users = await User.find({
          _id: { $nin: excludeIds },
          interests: { $in: interests },
        });
      } else {
        users = await User.find({ _id: { $nin: excludeIds } });
      }

      return users;
    }
  } catch (error) {
    console.log('43', error);
  }
};

exports.getMonthlyFollowersFromRequest = async (req) => {
  const { user } = req;
  const { year, month } = req.params;

  try {
    const matches = user.followers.filter(
      (item) =>
        new Date(item.dateTime).getFullYear() === Number(year) &&
        new Date(item.dateTime).getMonth() + 1 === Number(month)
    );

    return matches.length;
  } catch (error) {
    console.log('44', error);
  }
};

exports.getDailyFollowersPerMonthFromRequest = async (req) => {
  const { user } = req;
  const { year, month } = req.params;

  const matchesList = [];
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let i = 1; i <= daysInMonth; i++) {
    const matches = user.followers.filter(
      (item) =>
        new Date(item.dateTime).getFullYear() === Number(year) &&
        new Date(item.dateTime).getMonth() + 1 === Number(month) &&
        new Date(item.dateTime).getDate() === i
    );

    matchesList.push({
      date: i,
      followersCount: matches.length,
    });
  }

  return matchesList;
};

exports.deleteUserFromRequest = async (req) => {
  try {
    const result = await User.findOneAndDelete({ _id: req.body.userId });

    return result;
  } catch (error) {
    console.log('45', error);
  }
};
