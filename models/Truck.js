const mongoose = require('mongoose');

const truckSchema = mongoose.Schema({
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  type: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'IS',
  },
  dimensions: {
    type: Object,
    required: true,
  },
  payload: {
    type: Number,
    required: true,
  },
}, {
  timestamps: { createdAt: 'createdDate' },
  versionKey: false,
});

const Truck = mongoose.model('trucks', truckSchema);

module.exports = {
  Truck,
};
