const express = require('express');
const { getUserInfo, deleteUser, changePassword } = require('../services/userServices');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getUserInfo);
router.delete('/', authMiddleware, deleteUser);
router.patch('/:password', authMiddleware, changePassword);

module.exports = {
  userRouter: router,
};
