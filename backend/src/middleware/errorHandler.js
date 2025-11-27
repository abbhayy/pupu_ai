/**
 * Global error handler middleware
 */
module.exports = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error response
  const errorResponse = {
    success: false,
    error: err.message || 'Internal server error'
  };

  // Handle specific error types
  if (err.name === 'SequelizeValidationError') {
    errorResponse.error = 'Validation error';
    errorResponse.details = err.errors.map(e => e.message);
    return res.status(400).json(errorResponse);
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    errorResponse.error = 'Invalid reference in database';
    return res.status(400).json(errorResponse);
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    errorResponse.error = 'Duplicate entry';
    errorResponse.details = err.errors.map(e => e.message);
    return res.status(409).json(errorResponse);
  }

  // Default 500 error
  res.status(err.status || 500).json(errorResponse);
};
