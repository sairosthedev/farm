const Post = require('../models/Post');

// Get all posts with pagination
exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const tag = req.query.tag;

    let query = {};
    if (category) query.category = category;
    if (tag) query.tags = tag;

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('author', 'name avatar')
      .populate('comments.user', 'name avatar');

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { content, images, tags, category } = req.body;
    const post = new Post({
      author: req.user.id,
      content,
      images,
      tags,
      category
    });

    await post.save();
    await post.populate('author', 'name avatar');
    
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single post
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name avatar')
      .populate('comments.user', 'name avatar')
      .populate('likes', 'name avatar');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a post
exports.updatePost = async (req, res) => {
  try {
    const { content, images, tags, category } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    post.content = content || post.content;
    post.images = images || post.images;
    post.tags = tags || post.tags;
    post.category = category || post.category;

    await post.save();
    await post.populate('author', 'name avatar');

    res.json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await post.remove();
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like/Unlike a post
exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const likeIndex = post.likes.indexOf(req.user.id);
    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();
    res.json({ likes: post.likes });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add a comment
exports.addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = {
      user: req.user.id,
      content: req.body.content
    };

    post.comments.push(comment);
    await post.save();
    await post.populate('comments.user', 'name avatar');

    res.json(post.comments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 