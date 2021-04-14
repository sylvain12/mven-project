const express = require('express');
const {
  createProvider,
  getAllProvider,
  getProvider,
  updateProvider,
  deleteProvider } = require('../controllers/providerController');

const router = express.Router();

router
  .route('/')
  .get(getAllProvider)
  .post(createProvider);

router
  .route('/:id')
  .get(getProvider)
  .patch(updateProvider)
  .delete(deleteProvider);

module.exports = router;