const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getRequests,
  createRequest,
  getRequest,
  updateRequest,
  deleteRequest,
  updateStatus
} = require('../controllers/logisticsController');

// Get all logistics requests
router.get('/', protect, getRequests);

// Create a new logistics request
router.post('/', protect, createRequest);

// Get a single logistics request
router.get('/:id', protect, getRequest);

// Update a logistics request
router.put('/:id', protect, updateRequest);

// Delete a logistics request
router.delete('/:id', protect, deleteRequest);

// Update request status (admin only)
router.patch('/:id/status', protect, updateStatus);

module.exports = router; 