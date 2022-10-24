const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
}, {
  timestamps: { createdAt: 'createdDate' },
  versionKey: false,
});

const Dashboard = mongoose.model('dashboards', userSchema);

module.exports = {
  Dashboard,
};
