const Advisory = require('../models/Advisory');

// Get all advisories with filtering and pagination
exports.getAdvisories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { category, season, crop } = req.query;

    let query = {};
    if (category) query.category = category;
    if (season) query.season = season;
    if (crop) query.targetCrops = crop;

    const advisories = await Advisory.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('author', 'name avatar expertise');

    const total = await Advisory.countDocuments(query);

    res.json({
      advisories,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new advisory
exports.createAdvisory = async (req, res) => {
  try {
    const { title, content, category, attachments, tags, targetCrops, season } = req.body;
    
    const advisory = new Advisory({
      title,
      content,
      category,
      author: req.user.id,
      attachments,
      tags,
      targetCrops,
      season
    });

    await advisory.save();
    await advisory.populate('author', 'name avatar expertise');
    
    res.status(201).json(advisory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single advisory
exports.getAdvisory = async (req, res) => {
  try {
    const advisory = await Advisory.findById(req.params.id)
      .populate('author', 'name avatar expertise')
      .populate('likes', 'name avatar');

    if (!advisory) {
      return res.status(404).json({ message: 'Advisory not found' });
    }

    // Increment views
    advisory.views += 1;
    await advisory.save();

    res.json(advisory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an advisory
exports.updateAdvisory = async (req, res) => {
  try {
    const { title, content, category, attachments, tags, targetCrops, season } = req.body;
    const advisory = await Advisory.findById(req.params.id);

    if (!advisory) {
      return res.status(404).json({ message: 'Advisory not found' });
    }

    if (advisory.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    advisory.title = title || advisory.title;
    advisory.content = content || advisory.content;
    advisory.category = category || advisory.category;
    advisory.attachments = attachments || advisory.attachments;
    advisory.tags = tags || advisory.tags;
    advisory.targetCrops = targetCrops || advisory.targetCrops;
    advisory.season = season || advisory.season;

    await advisory.save();
    await advisory.populate('author', 'name avatar expertise');

    res.json(advisory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an advisory
exports.deleteAdvisory = async (req, res) => {
  try {
    const advisory = await Advisory.findById(req.params.id);

    if (!advisory) {
      return res.status(404).json({ message: 'Advisory not found' });
    }

    if (advisory.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await advisory.remove();
    res.json({ message: 'Advisory deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle like on an advisory
exports.toggleLike = async (req, res) => {
  try {
    const advisory = await Advisory.findById(req.params.id);

    if (!advisory) {
      return res.status(404).json({ message: 'Advisory not found' });
    }

    const likeIndex = advisory.likes.indexOf(req.user.id);
    if (likeIndex > -1) {
      advisory.likes.splice(likeIndex, 1);
    } else {
      advisory.likes.push(req.user.id);
    }

    await advisory.save();
    res.json({ likes: advisory.likes });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 