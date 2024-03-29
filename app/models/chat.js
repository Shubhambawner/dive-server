const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const chatSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['uploading', 'unseen', 'seen'],
    default: 'uploading',
  },
  linkedMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
  },
  linkedPatient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
  },
  deleted: {
    type: Boolean,
    default: false,
    index: true,
  },
  tag: {
    type: String,
    enum: ['important', 'favourite', 'useful'],
  },
  seenAt: {
    type: Date
  }
}, { timestamps: true, strict: 'throw' });

chatSchema.plugin(mongoosePaginate);

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;


/**
 * const Chat = require('./chatModel');

const options = {
  page: 1,
  limit: 10,
  sort: { createdAt: 'desc' },
};

Chat.paginate({ senderId: userId1, receiverId: userId2 }, options)
  .then((result) => {
    console.log(result.docs);
    console.log(result.total);
    console.log(result.limit);
    console.log(result.page);
    console.log(result.pages);
  })
  .catch((err) => {
    console.error(err);
  });
 */
