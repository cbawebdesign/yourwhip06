const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
  const token = await jwt.sign(
    { _id: user._id },
    process.env.JWT_KEY || 'LeaverDeaAsSleaf'
  );

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
