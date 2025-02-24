const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createOrder,
  getBuyerOrders,
  getFarmerOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/orderController');

// All routes are protected
router.use(protect);

router.post('/', createOrder);
router.get('/buyer', getBuyerOrders);
router.get('/farmer', getFarmerOrders);
router.get('/:id', getOrder);
router.put('/:id/status', updateOrderStatus);
router.put('/:id/cancel', cancelOrder);

module.exports = router; 