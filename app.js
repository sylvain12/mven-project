// THIRD PARTY PACKAGE
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

// API ROUTE
const clientRoute = require('./routes/clientRoutes');
const providerRoute = require('./routes/providerRoutes');

// EXPRESS APP
const app = express();

// GLOBAL MIDDLEWARE
app.use(cors());
if (process.env.NODE_ENV === 'development') app.use(morgan('tiny'));
app.use(express.json());

// Redirect the home to clients routes
app.get('/', (req, res) => res.redirect('/api/v1/clients'));

app.use('/api/v1/clients', clientRoute);
app.use('/api/v1/providers', providerRoute);

// Handle error for all unknown routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

// Express application
module.exports = app;