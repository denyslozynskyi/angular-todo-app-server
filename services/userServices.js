/* eslint-disable no-underscore-dangle */
const bcryptjs = require('bcryptjs');
const { User } = require('../models/User');

async function getUserInfo(req, res) {
  const { userId } = req.user;

  const user = await User.findOne({ userId });

  if (!user) {
    return res.status(400).json({ message: 'No user with this id' });
  }

  return res.json({
    user: {
      name: user.name,
      _id: user._id,
      role: user.role,
      email: user.email,
      created_date: user.createdDate,
    },
  });
}

async function deleteUser(req, res) {
  const user = await User.findOne({ _id: req.user.userId });

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  return User.findByIdAndDelete({ _id: req.user.userId })
    .then(() => {
      res.status(200).json({ message: 'Profile deleted successfully' });
    });
}

async function changePassword(req, res) {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findOne({ _id: req.user.userId });
  const hashedPassword = await bcryptjs.hash(newPassword, 10);

  if (oldPassword === newPassword) {
    return res.status(400).json({ message: 'New password can not by equal to old password' });
  }

  if (await bcryptjs.compare(String(oldPassword), String(user.password))) {
    return User.findByIdAndUpdate({ _id: req.user.userId }, { $set: { password: hashedPassword } })
      .then(() => {
        res.status(200).json({ message: 'Password changed successfully' });
      });
  }

  return res.status(400).json({ message: 'Please, specify old password field' });
}

module.exports = {
  getUserInfo,
  deleteUser,
  changePassword,
};
