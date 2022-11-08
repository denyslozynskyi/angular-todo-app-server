const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  board: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'dashboards',
  },
  comments: {
    type: [String],
    default: [],
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
}, {
  timestamps: { createdAt: 'createdDate' },
  versionKey: false,
});

const Task = mongoose.model('tasks', userSchema);

module.exports = {
  Task,
};
