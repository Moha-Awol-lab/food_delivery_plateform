const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const { ORDER_STATUS } = require('../../common/constants');

const Order = sequelize.define('Order', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    items: { type: DataTypes.JSONB, allowNull: false }, // Store snapshot of items: [{id, name, qty, price}]
    totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    deliveryAddress: { type: DataTypes.STRING, allowNull: false },
    status: { 
        type: DataTypes.ENUM(Object.values(ORDER_STATUS)), 
        defaultValue: ORDER_STATUS.PENDING 
    },
    paymentStatus: { type: DataTypes.STRING, defaultValue: 'UNPAID' },
    deliveryLat: { type: DataTypes.FLOAT },
    deliveryLng: { type: DataTypes.FLOAT }
});

module.exports = Order;