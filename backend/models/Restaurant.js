const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Restaurant = sequelize.define('Restaurant', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    cuisineType: { type: DataTypes.STRING }, // e.g., 'Italian', 'Burgers'
    address: { type: DataTypes.STRING, allowNull: false },
    lat: { type: DataTypes.FLOAT },
    lng: { type: DataTypes.FLOAT },
    imageUrl: { type: DataTypes.STRING },
    rating: { type: DataTypes.FLOAT, defaultValue: 0 },
    isAvailable: { type: DataTypes.BOOLEAN, defaultValue: true }
});

module.exports = Restaurant;