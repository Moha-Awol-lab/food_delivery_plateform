// Function to toggle a restaurant "Live" or "Offline"
exports.toggleStatus = async (req, res) => {
  const { restaurantId, isOpen } = req.body;
  const restaurant = await Restaurant.findByPk(restaurantId);
  
  restaurant.is_open = isOpen;
  await restaurant.save();

  res.json({ message: isOpen ? "You are now taking orders!" : "Kitchen closed." });
};

// Function for the Chef to mark food as ready
exports.markOrderReady = async (req, res) => {
  const { orderId } = req.params;
  const order = await Order.findByPk(orderId);
  
  order.status = 'READY_FOR_PICKUP';
  await order.save();

  // Trigger: Tell all nearby drivers an order is waiting
  req.io.emit('broadcast_pickup_opportunity', { orderId, location: restaurant.location });
  
  res.json({ message: "Order ready. Notifying drivers..." });
};

const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const cloudinary = require('../config/cloudinary');

// @desc    Get all restaurants (for Customer)
exports.getRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.findAll({ where: { isAvailable: true } });
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single restaurant menu
exports.getRestaurantMenu = async (req, res) => {
    try {
        const menu = await MenuItem.findAll({ 
            where: { restaurantId: req.params.id, isAvailable: true } 
        });
        res.json(menu);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a Restaurant (Owner Only)
exports.createRestaurant = async (req, res) => {
    try {
        const { name, cuisineType, address, lat, lng } = req.body;
        const restaurant = await Restaurant.create({
            name, cuisineType, address, lat, lng,
            ownerId: req.user.id // From Auth Middleware
        });
        res.status(201).json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add Menu Item with Image Upload
exports.addMenuItem = async (req, res) => {
    try {
        const { name, description, price, restaurantId, imageStr } = req.body;
        
        // Upload image to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(imageStr, {
            upload_preset: 'food_items'
        });

        const newItem = await MenuItem.create({
            name, description, price, restaurantId,
            imageUrl: uploadResponse.secure_url
        });

        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};