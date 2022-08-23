const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
}, {
  timestamps: { createdAt: 'createdDate' },
  versionKey: false,
});

const User = mongoose.model('users', userSchema);

module.exports = {
  User,
};
