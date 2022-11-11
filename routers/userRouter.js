const express = require('express');
const {
  getUser,
  changePassword,
  changeUserInfo,
  deleteUser,
} = require('../services/userServices');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/getuser', authMiddleware, getUser);
router.put('/changepassword', authMiddleware, changePassword);
router.put('/changeinfo', authMiddleware, changeUserInfo);
router.delete('/delete', authMiddleware, deleteUser);

module.exports = {
  userRouter: router,
};
