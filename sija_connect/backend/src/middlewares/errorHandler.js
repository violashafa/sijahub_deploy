const { errorResponse } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Terjadi kesalahan pada server';

  //  ID MongoDB tidak valid
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'ID tidak valid';
  }

  //  Validasi Mongoose
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map(error => error.message)
      .join(', ');
  }

  return errorResponse(res, message, statusCode);
};

module.exports = errorHandler;
