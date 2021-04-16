const mongoose = require('mongoose');


const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A client must have a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'A client must have an email'],
    lowercase: true,
    trim: true,
    unique: true
  },
  phone: {
    type: String,
    unique: true,
  },
  // providers: [
  //   {
  //     type: mongoose.Schema.ObjectId,
  //     ref: 'Provider',
  //   }
  // ]
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;