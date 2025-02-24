const LogisticsRequest = require('../models/LogisticsRequest');

// Get all logistics requests with filtering and pagination
exports.getRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { type, status } = req.query;

    let query = {};
    if (type) query.type = type;
    if (status) query.status = status;

    // If user is not admin, only show their requests
    if (!req.user.isAdmin) {
      query.requester = req.user.id;
    }

    const requests = await LogisticsRequest.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('requester', 'name phone email')
      .populate('assignedDriver', 'name phone')
      .populate('items.product', 'name');

    const total = await LogisticsRequest.countDocuments(query);

    res.json({
      requests,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new logistics request
exports.createRequest = async (req, res) => {
  try {
    const {
      type,
      pickupLocation,
      deliveryLocation,
      scheduledDate,
      items,
      vehicleType,
      specialInstructions,
      price
    } = req.body;

    const request = new LogisticsRequest({
      requester: req.user.id,
      type,
      pickupLocation,
      deliveryLocation,
      scheduledDate,
      items,
      vehicleType,
      specialInstructions,
      price
    });

    await request.save();
    await request.populate([
      { path: 'requester', select: 'name phone email' },
      { path: 'items.product', select: 'name' }
    ]);

    res.status(201).json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single logistics request
exports.getRequest = async (req, res) => {
  try {
    const request = await LogisticsRequest.findById(req.params.id)
      .populate('requester', 'name phone email')
      .populate('assignedDriver', 'name phone')
      .populate('items.product', 'name');

    if (!request) {
      return res.status(404).json({ message: 'Logistics request not found' });
    }

    // Check if user has permission to view this request
    if (!req.user.isAdmin && request.requester.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a logistics request
exports.updateRequest = async (req, res) => {
  try {
    const request = await LogisticsRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Logistics request not found' });
    }

    // Only allow updates if request is pending
    if (request.status !== 'pending' && !req.user.isAdmin) {
      return res.status(400).json({ message: 'Cannot update request after it has been accepted' });
    }

    // Check if user has permission to update this request
    if (!req.user.isAdmin && request.requester.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updates = req.body;
    Object.keys(updates).forEach(key => {
      if (key !== '_id' && key !== 'requester') {
        request[key] = updates[key];
      }
    });

    await request.save();
    await request.populate([
      { path: 'requester', select: 'name phone email' },
      { path: 'assignedDriver', select: 'name phone' },
      { path: 'items.product', select: 'name' }
    ]);

    res.json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a logistics request
exports.deleteRequest = async (req, res) => {
  try {
    const request = await LogisticsRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Logistics request not found' });
    }

    // Only allow deletion if request is pending
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot delete request after it has been accepted' });
    }

    // Check if user has permission to delete this request
    if (!req.user.isAdmin && request.requester.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await request.remove();
    res.json({ message: 'Logistics request deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update request status (admin only)
exports.updateStatus = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { status, assignedDriver } = req.body;
    const request = await LogisticsRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Logistics request not found' });
    }

    request.status = status;
    if (assignedDriver) {
      request.assignedDriver = assignedDriver;
    }

    await request.save();
    await request.populate([
      { path: 'requester', select: 'name phone email' },
      { path: 'assignedDriver', select: 'name phone' },
      { path: 'items.product', select: 'name' }
    ]);

    res.json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 