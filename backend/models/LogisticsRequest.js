const mongoose = require('mongoose');

const logisticsRequestSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['pickup', 'delivery', 'storage'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  pickupLocation: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  deliveryLocation: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: Number,
    unit: String
  }],
  vehicleType: {
    type: String,
    enum: ['small', 'medium', 'large', 'refrigerated'],
    required: true
  },
  specialInstructions: String,
  price: {
    type: Number,
    required: true
  },
  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LogisticsRequest', logisticsRequestSchema); 