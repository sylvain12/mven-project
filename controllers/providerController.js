
// DEPENDENCIES ==========================

// Provider model
const { Provider } = require('../models/providerModel');
const Client = require('../models/clientModel');
const { getAllClients } = require('../controllers/clientController');


// HANDLERS ==============================


// Get all providers
exports.getAllProvider = async (req, res) => {
  try {
    const providers = await Provider.find();
    res.status(200).json({
      status: 'success', data: {
        providers
      }
    });
  } catch (error) {
    res.status(404).json({ status: 'fail', message: error });
  }

};

// Create a provider
exports.createProvider = async (req, res) => {
  try {
    const provider = await Provider.create(req.body);
    res.status(201).json({ status: 'success', data: { provider } });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error });
  }
};

exports.getProvider = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id).select('-__v');
    console.log(provider.clients);
    res.status(200).json({ status: 'success', data: { provider } });
  } catch (error) {
    res.status(404).json({ status: 'fail', message: error });
  }
};

exports.updateProvider = async (req, res) => {
  try {
    const provider = await Provider.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true });
    res.status(200).json({ status: 'success', data: { provider } });
  } catch (error) {
    res.status(404).json({ status: 'fail', message: error });
  }
};

exports.deleteProvider = async (req, res) => {
  try {
    await Provider.findByIdAndDelete(req.params.id);
    return res.status(202).json({ status: 'success', data: null });
  } catch (error) {
    return res.status(404).json({ status: 'fail', message: error });
  }
};