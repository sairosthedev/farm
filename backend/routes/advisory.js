const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getAdvisories,
  createAdvisory,
  getAdvisory,
  updateAdvisory,
  deleteAdvisory,
  toggleLike
} = require('../controllers/advisoryController');

// Get all advisories
router.get('/', protect, getAdvisories);

// Create a new advisory
router.post('/', protect, createAdvisory);

// Get a single advisory
router.get('/:id', protect, getAdvisory);

// Update an advisory
router.put('/:id', protect, updateAdvisory);

// Delete an advisory
router.delete('/:id', protect, deleteAdvisory);

// Like/Unlike an advisory
router.post('/:id/like', protect, toggleLike);

module.exports = router; 