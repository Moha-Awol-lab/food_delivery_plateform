const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const MenuItem = sequelize.define('MenuItem', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    imageUrl: { type: DataTypes.STRING },
    isAvailable: { type: DataTypes.BOOLEAN, defaultValue: true },
    category: { type: DataTypes.STRING } // e.g., 'Appetizer', 'Main', 'Drink'
});

module.exports = MenuItem;