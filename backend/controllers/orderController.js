const { Order, MenuItem, Restaurant } = require('../models');

exports.createOrder = async (req, res) => {
  try {
    const { restaurantId, items, address, lat, long } = req.body;

    // 1. Calculate Total Price from DB (never trust price from frontend)
    let total = 0;
    for (const item of items) {
      const dbItem = await MenuItem.findByPk(item.id);
      total += dbItem.price * item.quantity;
    }

    // 2. Create the Order entry
    const newOrder = await Order.create({
      customerId: req.user.id, // From Auth middleware
      restaurantId,
      totalPrice: total,
      deliveryAddress: address,
      customerLat: lat,
      customerLong: long,
      status: 'pending'
    });

    // 3. TODO: Trigger WebSocket to notify Restaurant
    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    res.status(500).json({ message: "Order placement failed", error });
  }
};
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const { ORDER_STATUS } = require('../../common/constants');

// @desc    Place a new order
// @route   POST /api/orders
exports.placeOrder = async (req, res) => {
    try {
        const { restaurantId, items, deliveryAddress, lat, lng } = req.body;

        // 1. Calculate total server-side for security
        let calculatedTotal = 0;
        for (const item of items) {
            const dbItem = await MenuItem.findByPk(item.id);
            calculatedTotal += parseFloat(dbItem.price) * item.quantity;
        }

        // 2. Create Order in DB
        const order = await Order.create({
            customerId: req.user.id,
            restaurantId,
            items, // Snapshot of items at time of purchase
            totalAmount: calculatedTotal,
            deliveryAddress,
            deliveryLat: lat,
            deliveryLng: lng,
            status: ORDER_STATUS.PENDING
        });

        // 3. Notify the Restaurant via WebSockets
        // We use req.io which we will attach in server.js
        req.io.to(restaurantId).emit('new_order', {
            message: "New order received!",
            orderId: order.id
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update Order Status (used by Restaurant and Driver)
// @route   PATCH /api/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByPk(req.params.id);

        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.status = status;

        // If a driver picks up the order, assign them
        if (status === ORDER_STATUS.PICKED_UP) {
            order.driverId = req.user.id;
        }
        
        if (status === 'READY_FOR_PICKUP') {
    // Notify all drivers in the 'drivers' socket room
         req.io.to('available_drivers').emit('delivery_opportunity', {
         orderId: order.id,
         restaurantName: restaurant.name,
         address: restaurant.address
    });
}

        await order.save();

        // Notify the Customer about the status change
        req.io.to(order.customerId).emit('order_update', {
            orderId: order.id,
            status: status
        });

        res.json({ message: `Order status updated to ${status}`, order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};