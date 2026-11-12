const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: { message: 'Authentication required. No Bearer token provided.' },
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: { message: 'Invalid or expired token.' },
    });
  }
}

// Middleware ตรวจสอบ Role ของผู้ใช้งาน
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Authentication required.' },
      });
    }

    const userRole = (req.user.role || '').toLowerCase();
    const roles = allowedRoles.map((r) => r.toLowerCase());

    // ถ้าเป็น admin หรือมี role ตรงกับที่อนุญาต
    if (userRole === 'admin' || roles.includes(userRole)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      error: { message: `Forbidden: Access restricted to [${allowedRoles.join(', ')}] role(s).` },
    });
  };
}

module.exports = {
  authenticate,
  authorize,
};
