const express = require('express');
const router = express.Router();

const { getAllClients, createClient, updateClient, getClient, deleteClient } = require('../controllers/clientController');

// Get all clients and create client route
router
  .route('/')
  .get(getAllClients)
  .post(createClient);

// Get, update and delete a client route
router
  .route('/:id')
  .get(getClient)
  .patch(updateClient)
  .delete(deleteClient);


// export client router
module.exports = router;