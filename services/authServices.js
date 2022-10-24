/* eslint-disable no-underscore-dangle */
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const { User } = require('../models/User');

async function registerUser(req, res) {
  try {
    const {
      name, email, password,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please, specify registartion information' });
    }

    const candidate = await User.findOne({ email });

    if (candidate) {
      return res.status(400).json({ message: `You are already registered as ${candidate.role}` });
    }

    const user = new User({
      name,
      email,
      password: await bcryptjs.hash(password, 10),
    });

    return user.save().then(() => res.status(200).json({ message: 'Success' }));
  } catch (e) {
    return console.log(e);
  }
}

async function loginUser(req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user && await bcryptjs.compare(req.body.password, user.password)) {
      const payload = { name: user.name, userId: user._id, role: user.role };
      const jwtToken = jwt.sign(payload, config.get('secretTokenKey'));
      return res.status(200).json({ jwt_token: jwtToken, role: user.role, name: user.name });
    }

    return res.status(400).json({ message: 'Not authorized' });
  } catch (e) {
    return console.log(e);
  }
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please, specify password field' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const password = await bcryptjs.hash('qwerty', 10);

    return User.findByIdAndUpdate({ _id: user._id }, { $set: { password } })
      .then(() => {
        res.status(200).json({ message: 'New password sent to your email address' });
      });
  } catch (e) {
    return console.log(e);
  }
}

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
};
