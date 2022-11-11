/* eslint-disable consistent-return */
const bcryptjs = require('bcryptjs');
const { User } = require('../models/User');

async function getUser(req, res) {
  try {
    const { userId } = req.user;
    const user = await User.findOne({ _id: userId });

    res.json({ user });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

async function changePassword(req, res) {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findOne({ _id: req.user.userId });
    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    if (!oldPassword || !newPassword) {
      throw (new Error('Please, specify requst body parameters'));
    }

    if (oldPassword === newPassword) {
      throw (new Error('New password can not by equal to old password'));
    }

    if (await bcryptjs.compare(String(oldPassword), String(user.password))) {
      return User.findByIdAndUpdate(
        { _id: req.user.userId },
        { $set: { password: hashedPassword } },
      ).then(() => {
        res.status(200).json({ message: 'Password changed successfully!' });
      });
    }

    throw (new Error('Wrong old password!'));
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

async function changeUserInfo(req, res) {
  try {
    const { userId } = req.user;
    const user = await User.findOne({ _id: req.user.userId });
    const { name, email } = req.body;

    if (!user) {
      throw (new Error('No user with this id!'));
    }

    if (!name || !email) {
      throw (new Error('Please, specify request body parameters!'));
    }

    return User.findByIdAndUpdate({ _id: userId }, { $set: { name, email } })
      .then(() => {
        res.json({ message: 'Updated succesfully' });
      });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

async function deleteUser(req, res) {
  try {
    const user = await User.findOne({ _id: req.user.userId });

    if (!user) {
      throw (new Error('User not found'));
    }

    User.findByIdAndDelete({ _id: req.user.userId })
      .then(() => {
        res.status(200).json({ message: 'Profile deleted successfully' });
      });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

module.exports = {
  getUser,
  changePassword,
  changeUserInfo,
  deleteUser,
};
