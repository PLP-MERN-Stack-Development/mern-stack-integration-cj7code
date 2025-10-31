// server/middleware/errorHandler.js
// Centralized error handler — used by server.js

module.exports = (err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Server Error',
    // in dev: include stack
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
