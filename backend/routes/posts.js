const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
  toggleLike,
  addComment
} = require('../controllers/postController');

// Get all posts
router.get('/', protect, getPosts);

// Create a new post
router.post('/', protect, createPost);

// Get a single post
router.get('/:id', protect, getPost);

// Update a post
router.put('/:id', protect, updatePost);

// Delete a post
router.delete('/:id', protect, deletePost);

// Like/Unlike a post
router.post('/:id/like', protect, toggleLike);

// Add a comment
router.post('/:id/comments', protect, addComment);

module.exports = router; 