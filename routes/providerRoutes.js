const express = require('express');
const {
  createProvider,
  getAllProvider,
  getProvider,
  updateProvider,
  deleteProvider } = require('../controllers/providerController');

// create express router
const router = express.Router();

// Get providers and create provider route
router
  .route('/')
  .get(getAllProvider)
  .post(createProvider);

// Get, update, delete provider route
router
  .route('/:id')
  .get(getProvider)
  .patch(updateProvider)
  .delete(deleteProvider);

// export provider router
module.exports = router;
