const express = require('express');
const router = express.Router();

const { getAllClients, createClient, updateClient, getClient, deleteClient } = require('../controllers/clientController');

router
  .route('/')
  .get(getAllClients)
  .post(createClient);

router
  .route('/:id')
  .get(getClient)
  .patch(updateClient)
  .delete(deleteClient);



module.exports = router;