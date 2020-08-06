const mongoose = require('mongoose');

const codeSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    code: { type: String, required: true },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
      expires: 43200,
    },
  },
  { collection: 'codes' }
);

const ModelClass = mongoose.model('code', codeSchema);

module.exports = ModelClass;
