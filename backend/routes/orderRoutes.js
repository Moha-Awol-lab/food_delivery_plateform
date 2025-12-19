const express = require('express');
const router = express.Router();
const { placeOrder, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleCheck');
const { USER_ROLES } = require('../../common/constants');

// Any logged in user can place an order
router.post('/', protect, placeOrder);

// Only Restaurants and Drivers can update status
router.patch('/:id/status', 
    protect, 
    authorize(USER_ROLES.RESTAURANT, USER_ROLES.DRIVER), 
    updateOrderStatus
);

// Get my orders (Customer history)
router.get('/my-orders', protect, async (req, res) => {
    const orders = await Order.findAll({ where: { customerId: req.user.id } });
    res.json(orders);
});

module.exports = router;