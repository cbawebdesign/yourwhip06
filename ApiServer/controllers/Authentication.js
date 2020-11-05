const HttpStatus = require('http-status-codes/index');

const User = require('../models/User');

const userHelper = require('../helpers/users');
const generalHelper = require('../helpers/general');
const postHelper = require('../helpers/posts');
const imageHelper = require('../helpers/images');
const commentsHelper = require('../helpers/comments');
const activityHelper = require('../helpers/activities');

const sendCodeEmail = require('../emails/recoveryCodeEmail');

exports.login = async (req, res) => {
  try {
    const user = await User.findByCredentials(req, res);

    if (!user) {
      return res.status(HttpStatus.FORBIDDEN).send({
        error: 'Login failed. Please check your authentication credentials.',
      });
    }

    if (user) {
      const tokenString = await user.generateAuthToken();

      // AVOID SENDING PASSWORD BACK TO CLIENT
      user.password = null;

      res.status(HttpStatus.OK).send({
        message: 'Login successful',
        token: tokenString,
        user: user,
      });
    }
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error });
  }
};

exports.logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((item) => {
      return item.token !== req.token;
    });
    await req.user.save();

    res.status(HttpStatus.OK).send({ success: 'You have been logged out.' });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return re.test(email);
}

exports.signupStep1 = async (req, res) => {
  const user = await userHelper.findOneUserFromRequest(req);

  if (user) {
    return res
      .status(HttpStatus.FORBIDDEN)
      .send({ error: 'The provided Email already exists' });
  }

  if (!validateEmail(req.body.email)) {
    return res
      .status(HttpStatus.FORBIDDEN)
      .send({ error: 'The entered Email address appears to be invalid' });
  }

  if (req.body.firstName.length < 3) {
    return res.status(HttpStatus.FORBIDDEN).send({
      error:
        '"The "First Name" field is either empty or the name you entered too short. Please enter your given name."',
    });
  }
  if (req.body.lastName < 3) {
    return res.status(HttpStatus.FORBIDDEN).send({
      error:
        'the "Last Name" field is either empty or the name you entered too short. Please enter your family name.',
    });
  }
  if (req.body.password.length < 8) {
    return res.status(HttpStatus.FORBIDDEN).send({
      error: 'The password you entered must contain a minimum of 8 characters',
    });
  }

  res.status(HttpStatus.OK).send({ success: 'User does not yet exist' });
};

exports.signupStep2 = async (req, res) => {
  try {
    if (req.file) {
      const image = await imageHelper.saveProfileImageFromRequest(req);
      req.profileImage = image.image;
    }
    const newUser = await userHelper.buildUserFromRequest(req);

    if (!newUser) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: 'An error occured creating a new account' });
    }

    const tokenString = await newUser.generateAuthToken();

    res.status(HttpStatus.OK).send({
      success: 'Signup successful',
      token: tokenString,
      user: newUser,
    });
  } catch (error) {
    console.log('1', error);
  }
};

exports.requestCode = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await userHelper.findOneUserFromRequest(req);

    if (!user) {
      return res.status(HttpStatus.FORBIDDEN).send({
        error: 'The provided Email does not match any address in our records',
      });
    }

    req.user = user;

    recoveryCode = await generalHelper.buildCodeFromRequest(req);

    sendCodeEmail(req, recoveryCode.code);

    res.status(HttpStatus.OK).send({
      success: 'A recovery code has been sent to the provided email address',
      email,
    });
  } catch (error) {
    console.log('2', error);
  }
};

exports.validateCode = async (req, res) => {
  try {
    const user = await userHelper.findOneUserFromRequest(req);

    if (req.params.code.length < 6) {
      return res.status(HttpStatus.FORBIDDEN).send({
        error: 'Please enter a valid recovery code',
      });
    }

    if (!user) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        error:
          'An error occurred while retrieving the user or the user does not exist',
      });
    }

    req.user = user;
    const code = await generalHelper.findOneCodeFromRequest(req);

    if (code) {
      res.status(HttpStatus.OK).send({
        success:
          'The supplied code is correct. Please provide a new password to login to your account',
      });
    } else {
      res.status(HttpStatus.FORBIDDEN).send({
        error:
          'No match was found for the supplied code or your code may have expired',
      });
    }
  } catch (error) {
    console.log('3', error);
  }
};

exports.resetPassword = async (req, res) => {
  const { password } = req.body;

  try {
    const user = await userHelper.findOneUserFromRequest(req);

    if (!user) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        error:
          'An error occurred while retrieving the user or the user does not exist',
      });
    }

    user.password = password;

    await user.save();
    const tokenString = await user.generateAuthToken();

    res.status(HttpStatus.OK).send({
      success: `Your password has been changed successfully.`,
      token: tokenString,
      user,
    });
  } catch (error) {
    console.log('4', error);
  }
};

exports.deleteAccount = async (req, res) => {
  const { fromScreen } = req.body;

  try {
    // DELETE USER ACTIVITIES
    const deleteActivitiesResult = await activityHelper.deleteActivitiesFromRequest(
      req
    );

    if (!deleteActivitiesResult) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        error: `An error occurred deleting activities linked to the account`,
      });
    }

    // DELETE USER COMMENTS
    const deletedComments = await commentsHelper.deleteCommentsFromRequest(req);
    if (!deletedComments) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        error: `An error occurred deleting comments linked to the account`,
      });
    }

    // DELETE USER
    const deletedUser = await userHelper.deleteUserFromRequest(req);

    // DELETE USER POSTS
    const postsByUser = await postHelper.getPostsByUserFromRequest(req);
    postsByUser.forEach(async (post) => {
      req.postId = post._id;

      await imageHelper.deleteImagesFromRequest(req);
    });

    await postHelper.deletePostsFromRequest(req);

    if (!deletedUser) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        error: `An error occurred while deleting the account for user with id: ${req.body.userId},`,
      });
    }

    res.status(HttpStatus.OK).send({
      success: `The account for user ${deletedUser.firstName} ${deletedUser.lastName} has been successfully deleted`,
      deletedUserId: deletedUser._id,
      fromScreen,
    });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      error: `An error occured deleting the account with id: ${req.body.userId}`,
    });
  }
};
