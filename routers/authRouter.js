const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  registerUser,
  loginUser,
  forgotPassword,
  getUser,
} = require('../services/authServices');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot_password', forgotPassword);
router.get('/user', authMiddleware, getUser);

module.exports = {
  authRouter: router,
};
