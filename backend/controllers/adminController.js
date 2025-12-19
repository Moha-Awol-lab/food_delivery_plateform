const Order = require('../models/Order');
const { sequelize } = require('../config/db');

exports.getPlatformAnalytics = async (req, res) => {
    try {
        // 1. Calculate Total Revenue and Platform Fee (10% commission)
        const stats = await Order.findAll({
            attributes: [
                [sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalRevenue'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'totalOrders']
            ],
            where: { paymentStatus: 'PAID' }
        });

        const revenue = stats[0].dataValues.totalRevenue || 0;
        const platformEarnings = revenue * 0.10; // Your 10% cut

        // 2. Get Order Status Breakdown
        const statusBreakdown = await Order.findAll({
            attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
            group: ['status']
        });

        res.json({
            totalRevenue: revenue,
            platformProfit: platformEarnings,
            orderCount: stats[0].dataValues.totalOrders,
            breakdown: statusBreakdown
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};