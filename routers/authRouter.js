const express = require('express');
const {
  registerUser,
  loginUser,
  forgotPassword,
} = require('../services/authServices');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/forgotpassword', forgotPassword);

module.exports = {
  authRouter: router,
};
