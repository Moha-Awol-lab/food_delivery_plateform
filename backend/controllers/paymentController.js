const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');

// @desc    Handle Stripe Webhook events
// @route   POST /api/payments/webhook
exports.handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        // Verify the event came from Stripe
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        // Update the order in our database
        const order = await Order.findOne({ where: { id: session.client_reference_id } });
        if (order) {
            order.paymentStatus = 'PAID';
            await order.save();
            
            // Notify the restaurant that payment is confirmed
            req.io.to(order.restaurantId).emit('payment_confirmed', { orderId: order.id });
        }
    }

    res.json({ received: true });
};