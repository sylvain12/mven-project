const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.keyValue.name;
  const message = `Duplicate field value "${value}" Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = [Object.values(err.errors).map(el => el.message)];
  console.log(errors);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    // status: err.status,
    error: err,
    // message: err.message,
    // stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // programming or other error error: don't leak error detial
  } else {
    // Log error
    console.error('ERROR', err);

    // Send generate message
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    });
  }

};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  let error = { ...err };

  if (process.env.NODE_ENV === 'development') {
    // if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    sendErrorDev(error, res);

  } else if (process.env.NODE_ENV === 'production') {

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidatorError') error = handleValidationErrorDB(error);
    sendErrorProd(error, res);
  }
};