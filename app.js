// THIRD PARTY PACKAGE
const express = require('express');
const morgan = require('morgan');

// API ROUTE
const clientRoute = require('./routes/clientRoutes');
const providerRoute = require('./routes/providerRoutes');

// EXPRESS APP
const app = express();

// GLOBAL MIDDLEWARE
if (process.env.NODE_ENV === 'development') app.use(morgan('tiny'));
app.use(express.json());

app.get('/', (req, res) => res.redirect('/api/v1/clients'));

app.use('/api/v1/clients', clientRoute);
app.use('/api/v1/providers', providerRoute);

module.exports = app;