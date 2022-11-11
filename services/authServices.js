/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const { User } = require('../models/User');
const { mailer } = require('../mailer/mailer');

async function registerUser(req, res) {
  try {
    const {
      name, email, password,
    } = req.body;

    if (!name || !email || !password) {
      throw (new Error('Please, specify registartion information'));
    }

    const candidate = await User.findOne({ email });

    if (candidate) {
      throw (new Error(`You are already registered as ${candidate.name}`));
    }

    const user = new User({
      name,
      email,
      password: await bcryptjs.hash(password, 10),
    });

    return user.save().then(() => res.status(200).json({ message: 'Success' }));
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

async function loginUser(req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      throw (new Error('You are not registered!'));
    }

    if (user && await bcryptjs.compare(req.body.password, user.password)) {
      const payload = { name: user.name, userId: user._id, role: user.role };
      const jwtToken = jwt.sign(payload, config.get('secretTokenKey'));
      return res.status(200).json({ jwt_token: jwtToken, role: user.role, name: user.name });
    }

    throw (new Error('Wrong password!'));
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      throw (new Error('Please, specify request body fields'));
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw (new Error('User not found!'));
    }

    const password = await bcryptjs.hash(config.get('newPassword'), 10);
    const message = {
      to: email,
      subject: 'Password change',
      text: `You password changed succesfully.\nNew password: ${config.get('newPassword')}\nBack to app: shorturl.at/mAEI5`,
    };

    return User.findByIdAndUpdate({ _id: user._id }, { $set: { password } })
      .then(() => {
        mailer(message);
        res.status(200).json({ message: 'New password sent to your email address' });
      });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
};
