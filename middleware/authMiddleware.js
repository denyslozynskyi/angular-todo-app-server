const jwt = require('jsonwebtoken');
const config = require('config');

// eslint-disable-next-line consistent-return
function authMiddleware(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'Please, provide authorization header' });
  }

  const token = authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Please, include token to request' });
  }

  try {
    const tokenPayload = jwt.verify(token, config.get('secretTokenKey'));
    req.user = {
      userId: tokenPayload.userId,
      name: tokenPayload.name,
      role: tokenPayload.role,
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
}

module.exports = {
  authMiddleware,
};
