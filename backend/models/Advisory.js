const mongoose = require('mongoose');

const advisorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['crop_management', 'pest_control', 'weather', 'market_insights', 'best_practices'],
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attachments: [{
    type: String // URLs to images or documents
  }],
  tags: [{
    type: String
  }],
  targetCrops: [{
    type: String
  }],
  season: {
    type: String,
    enum: ['spring', 'summer', 'fall', 'winter', 'all']
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Advisory', advisorySchema); 