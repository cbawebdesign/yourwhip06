const HttpStatus = require('http-status-codes/index');

const userHelper = require('../helpers/users');
const imageHelper = require('../helpers/images');
const CONFIG = require('../constants');

exports.getUserInfo = async (req, res) => {
  const user = await userHelper.findOneUserFromRequest(req);
  const app = { enableSuggestionsControl: CONFIG.ENABLE_CONTROL_SUGGESTIONS };

  if (!user) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      error:
        'An error occurred while retrieving the user or the user does not exist',
    });
  }

  res.status(HttpStatus.OK).send({ user, app });
};

exports.updateInterests = async (req, res) => {
  const currentUser = req.user;

  currentUser.interests = req.body.interests;

  try {
    await currentUser.save();

    res.status(HttpStatus.OK).send(currentUser.interests);
  } catch (error) {
    console.log('46', error);
  }
};

exports.updateSettings = async (req, res) => {
  const currentUser = req.user;
  const { settings } = req.body;

  currentUser.settings = settings;

  try {
    await currentUser.save();

    res.status(HttpStatus.OK).send(currentUser.settings);
  } catch (error) {
    console.log('47', error);
  }
};

exports.getRecommended = async (req, res) => {
  const currentUser = req.user;

  req.friendsAndRemovedIds = [...currentUser.following, ...currentUser.removed];
  const recommendedUsers = await userHelper.findUsersFromRequest(req);

  if (!recommendedUsers) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: 'An error occurred finding recommended users' });
  }

  res.status(HttpStatus.OK).send(recommendedUsers);
};

exports.removeUserPress = async (req, res) => {
  const currentUser = req.user;
  const { user } = req.body;

  try {
    currentUser.removed.push(user);

    const result = await currentUser.save();

    if (!result) {
      throw new Error('An error occured saving the remove press action');
    }

    req.friendsAndRemovedIds = [
      ...currentUser.following,
      ...currentUser.removed,
    ];
    const recommendedUsers = await userHelper.findUsersFromRequest(req);

    if (!recommendedUsers) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: 'An error occurred finding recommended users' });
    }

    res.status(HttpStatus.OK).send(recommendedUsers);
  } catch (error) {
    console.log('29', error);
  }
};

exports.editProfile = async (req, res) => {
  const { user } = req;
  const { birthday, gender, location, description } = req.body;

  let image;

  if (req.file) {
    image = await imageHelper.saveProfileImageFromRequest(req);

    if (image) {
      user.profileImage = image.image;
    }
  }

  user.birthday =
    birthday === 'null' || birthday === 'undefined' ? null : birthday;
  user.gender = gender === 'null' || gender === 'undefined' ? null : gender;
  user.location =
    location === 'null' || location === 'undefined' ? null : location;
  user.description =
    description === 'null' || description === 'undefined' ? null : description;

  const result = await user.save();
  const updatedUser = await userHelper.findOneUserFromRequest(req);

  if (!result) {
    throw new Error('An error occured saving current user edits');
  }

  res
    .status(HttpStatus.OK)
    .send({ success: 'Profile successfully updated', user: updatedUser });
};

exports.searchUsers = async (req, res) => {
  req.search = true;
  const users = await userHelper.findUsersFromRequest(req);

  if (!users) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: 'An error occurred finding users from the search input' });
  }

  res.status(HttpStatus.OK).send({ users });
};
