const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL);

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.ENUM('customer', 'restaurant', 'driver'), defaultValue: 'customer' }
});

const Order = sequelize.define('Order', {
  items: { type: DataTypes.JSONB }, // Array of food items
  total: { type: DataTypes.FLOAT },
  status: { 
    type: DataTypes.STRING, 
    defaultValue: 'PENDING' // PENDING -> ACCEPTED -> PREPARING -> PICKED_UP -> DELIVERED
  },
  deliveryLat: { type: DataTypes.FLOAT },
  deliveryLng: { type: DataTypes.FLOAT }
});

// Relationships
User.hasMany(Order, { as: 'CustomerOrders', foreignKey: 'customerId' });
User.hasMany(Order, { as: 'DriverOrders', foreignKey: 'driverId' });
Order.belongsTo(User, { as: 'Restaurant', foreignKey: 'restaurantId' });

module.exports = { sequelize, User, Order };