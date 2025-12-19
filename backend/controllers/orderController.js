const { Order, MenuItem, Restaurant } = require('../models');
const { ORDER_STATUS } = require('../../common/constants');

// @desc    Place a new order (Combined Logic)
exports.placeOrder = async (req, res) => {
    try {
        const { restaurantId, items, deliveryAddress, lat, lng } = req.body;

        // 1. Calculate total server-side for security
        let calculatedTotal = 0;
        for (const item of items) {
            const dbItem = await MenuItem.findByPk(item.id);
            if (!dbItem) continue;
            calculatedTotal += parseFloat(dbItem.price) * item.quantity;
        }

        // 2. Create Order in DB
        const order = await Order.create({
            customerId: req.user.id,
            restaurantId,
            items, 
            totalAmount: calculatedTotal,
            deliveryAddress,
            deliveryLat: lat,
            deliveryLng: lng,
            status: ORDER_STATUS.PENDING
        });

        // 3. Notify the Restaurant via WebSockets
        if (req.io) {
            req.io.to(restaurantId).emit('new_order', {
                message: "New order received!",
                orderId: order.id
            });
        }

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update Order Status (used by Restaurant and Driver)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        // Include Restaurant model so we can get its name/address for drivers
        const order = await Order.findByPk(req.params.id, {
            include: [{ model: Restaurant, as: 'restaurant' }]
        });

        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.status = status;

        // If a driver picks up the order, assign them
        if (status === ORDER_STATUS.PICKED_UP) {
            order.driverId = req.user.id;
        }
        
        // Notify drivers if food is ready
        if (status === 'READY_FOR_PICKUP' && req.io) {
             req.io.to('available_drivers').emit('delivery_opportunity', {
                 orderId: order.id,
                 restaurantName: order.restaurant?.name || "Restaurant",
                 address: order.restaurant?.address || "Address not available"
            });
        }

        await order.save();

        // Notify the Customer about the status change
        if (req.io) {
            req.io.to(order.customerId).emit('order_update', {
                orderId: order.id,
                status: status
            });
        }

        res.json({ message: `Order status updated to ${status}`, order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
