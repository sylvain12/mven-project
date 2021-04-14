const mongoose = require('mongoose');


const providerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A provider must have a name'],
    unique: true
  }
});

providerSchema.virtual('clients', {
  ref: 'Client',
  localField: '_id',
  foreignField: 'providers',
  justOne: false,
});


const Provider = mongoose.model('Provider', providerSchema);

module.exports = {
  Provider,
  providerSchema
};