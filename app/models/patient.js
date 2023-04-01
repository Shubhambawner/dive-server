const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const patientSchema = new mongoose.Schema({
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
  //todo add patient schema from frontend
  data: {
    type: Object,
    required: true,
  },
  status: {
    type: String,
    enum: ['uploading', 'unseen', 'seen'],
    default: 'uploading',
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

patientSchema.plugin(mongoosePaginate);

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;


/**
 * const Patient = require('./patientModel');

const options = {
  page: 1,
  limit: 10,
  sort: { createdAt: 'desc' },
};

Patient.paginate({ senderId: userId1, receiverId: userId2 }, options)
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
