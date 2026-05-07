const { verifyToken } = require('../utils/token');
const { sendError } = require('../utils/response');

const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return sendError(res, 'Authentication required', 401);
  }
  try {
    req.user = verifyToken(header.split(' ')[1]);
    next();
  } catch {
    return sendError(res, 'Invalid or expired token', 401);
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user) return sendError(res, 'Authentication required', 401);
  if (!roles.includes(req.user.role)) return sendError(res, 'Insufficient permissions', 403);
  next();
};

module.exports = { authenticate, authorize };
