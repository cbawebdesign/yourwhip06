const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const CONFIG = require('../constants');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error({ error: 'Invalide Email address' });
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
    },
    firstName: String,
    lastName: String,
    birthday: {
      type: String,
      default: null,
    },
    gender: String,
    location: String,
    profileImage: String,
    description: String,
    interests: [String],
    filters: {
      hiddenUsers: [String], // ARRAY OF USER IDS
      hiddenPosts: [String], // ARRAY OF POST IDS
      hiddenComments: [String], // ARRAY OF COMMENT IDS
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    reportedBy: [String], // ARRAY OF USER IDS
    reportedPosts: [String], // ARRAY OF POST IDS
    reportedComments: [String], // ARRAY OF COMMENT IDS
    settings: {
      enableSuggestions: {
        type: Boolean,
        default: false,
      },
      enableIntroAnimations: {
        type: Boolean,
        default: true,
      },
    },
    dateTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    walkthroughComplete: Boolean,
    passwordResetToken: String,
    passwordResetExpires: Date,
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    followers: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        activityId: String,
        dateTime: {
          type: Date,
          required: true,
          default: Date.now,
        },
      },
    ],
    removed: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { collection: 'users' }
);

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, CONFIG.JWT_KEY);

  user.tokens = user.tokens.concat([{ token }]);
  await user.save();

  return token;
};

userSchema.statics.findByCredentials = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await ModelClass.findOne({ email });

  if (!user) {
    return null;
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return null;
  }

  return user;
};

const ModelClass = mongoose.model('User', userSchema, 'users');

module.exports = ModelClass;
