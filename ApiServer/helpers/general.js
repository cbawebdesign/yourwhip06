const Like = require('../models/Like');
const Activity = require('../models/Activity');
const Code = require('../models/RecoveryCode');

exports.buildCodeFromRequest = async (req) => {
  const { user } = req;

  const code = Math.floor(100000 + Math.random() * 900000);
  const recoveryCode = new Code({
    createdBy: user,
    code,
  });

  await recoveryCode.save();

  return recoveryCode;
};

exports.findOneCodeFromRequest = async (req) => {
  const { code } = req.params;
  const { user } = req;

  try {
    const result = await Code.findOne({ createdBy: user, code });

    return result;
  } catch (error) {
    console.log('32', error);
  }

  return recoveryCode;
};
