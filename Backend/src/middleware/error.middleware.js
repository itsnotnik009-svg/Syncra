const { env } = require('../config/env');

const errorHandler = (err, req, res, _next) => {
  console.error('Error:', err.message);

  if (err.code === 'P2002') {
    return res.status(409).json({ success: false, message: `Duplicate ${err.meta?.target || 'field'}`, data: null });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ success: false, message: 'Record not found', data: null });
  }

  const status = err.statusCode || 500;
  return res.status(status).json({
    success: false,
    message: err.message || 'Internal server error',
    data: null,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { errorHandler };
