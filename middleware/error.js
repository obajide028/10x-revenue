/**
 *  @author @obajide028 Odesanya Babajide
 *  @version 1.0
 */
const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to Console for dev
  console.log(err);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  // Course not found
  if (err.message === "No Course With The Provided ID") {
    error = new ErrorResponse(err.message, 404);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message,
  });
};

module.exports = errorHandler;
