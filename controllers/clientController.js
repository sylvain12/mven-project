
const Client = require('../models/clientModel');
const { Provider } = require('../models/providerModel');

exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.find().populate('providers').select('-__v');
    res
      .status(200)
      .json({
        status: 'success',
        results: clients.length,
        data: {
          clients
        }
      });
  } catch (error) {
    res.status(404).json({ status: 'fail', message: error });
  }

};

exports.createClient = async (req, res) => {
  try {
    const client = await (await Client.create(req.body)).populate('providers').execPopulate();
    res.status(201).json({ status: 'success', data: { client } });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error });
  }
};


exports.getClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).populate({
      path: 'providers',
      select: '-__v'
    }).select('-__v');
    return res.status(200).json({ status: 'success', data: { client } });
  } catch (error) {
    return res.status(400).json({ status: 'fail', message: error });
  }

};

exports.updateClient = async (req, res) => {
  try {
    const client = await (await Client
      .findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true }))
      .populate('providers')
      .execPopulate();

    return res.status(200).json({ status: 'success', data: { client } });
  } catch (error) {
    return res.status(400).json({ status: 'fail', message: error });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    return res.status(202).json({ status: 'success', data: null });
  } catch (error) {
    return res.status(404).json({ status: 'fail', message: error });
  }
};