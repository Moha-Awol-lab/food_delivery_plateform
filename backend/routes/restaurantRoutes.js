const express = require('express');
const router = express.Router();
const { 
    getRestaurants, 
    getRestaurantMenu, 
    createRestaurant, 
    addMenuItem 
} = require('../controllers/restaurantController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleCheck');
const { USER_ROLES } = require('../../common/constants');

// Public Routes
router.get('/', getRestaurants);
router.get('/:id/menu', getRestaurantMenu);

// Protected Owner Routes
router.post('/', protect, authorize(USER_ROLES.RESTAURANT), createRestaurant);
router.post('/item', protect, authorize(USER_ROLES.RESTAURANT), addMenuItem);

module.exports = router;