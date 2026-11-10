function errorHandler(err, req, res, next) {
  console.error('[Error]', err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {}),
    },
  });
}

function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: {
      message: `Cannot ${req.method} ${req.originalUrl}`,
    },
  });
}

module.exports = {
  errorHandler,
  notFoundHandler,
};
