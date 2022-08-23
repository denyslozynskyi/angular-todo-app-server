const mongoose = require('mongoose');

const loadSchema = mongoose.Schema({
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  status: {
    type: String,
    default: 'new',
  },
  state: {
    type: String,
    default: null,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
  },
  payload: {
    type: Number,
    required: true,
  },
  pickup_address: {
    type: String,
    required: true,
  },
  delivery_address: {
    type: String,
    required: true,
  },
  dimensions: {
    type: Object,
    required: true,
  },
  logs: {
    type: Array,
    default: [],
  },
}, {
  timestamps: { createdAt: 'createdDate' },
  versionKey: false,
});

const Load = mongoose.model('loads', loadSchema);

module.exports = {
  Load,
};
