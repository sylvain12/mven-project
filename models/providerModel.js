const mongoose = require('mongoose');


const providerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A provider must have a name'],
    unique: true,
  }
});

const Provider = mongoose.model('Provider', providerSchema);

module.exports = {
  Provider,
  providerSchema
};