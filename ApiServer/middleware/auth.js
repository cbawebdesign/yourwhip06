const jwt = require('jsonwebtoken');

const User = require('../models/User');

const CONFIG = require('../constants');

const auth = async (req, res, next) => {
  try {
    const token = await req.header('Authorization').replace('Bearer ', '');
    const data = jwt.verify(token, CONFIG.JWT_KEY);

    const user = await User.findOne({
      _id: data._id,
      'tokens.token': token,
    }).exec();

    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    res.status(422).send({
      error: 'You are not authorized to access this resource',
      type: 'INVALID_TOKEN',
    });
  }
};

module.exports = auth;
