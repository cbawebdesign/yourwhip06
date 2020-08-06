// const mongoose = require('mongoose');

// const Schema = mongoose.Schema;

// const replySchema = new mongoose.Schema(
//   {
//     createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//     description: String,
//     // images: [String], // TODO: ENABLE UPLOADING IMAGES TO REPLIES
//     likes: [{ type: Schema.Types.ObjectId, ref: 'Like' }],
//     dateTime: {
//       type: Date,
//       required: true,
//       default: Date.now,
//     },
//   },
//   { collection: 'replies' }
// );

// const ModelClass = mongoose.model('Reply', replySchema, 'replies');

// module.exports = ModelClass;
