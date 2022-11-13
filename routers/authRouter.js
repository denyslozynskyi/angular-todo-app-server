const express = require('express');
const {
  registerUser,
  loginUser,
  forgotPassword,
} = require('../services/authService');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgotpassword', forgotPassword);

module.exports = {
  authRouter: router,
};
