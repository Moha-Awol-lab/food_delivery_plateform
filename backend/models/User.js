const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const { USER_ROLES } = require('../../common/constants');

const User = sequelize.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false, validate: { isEmail: true } },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { 
        type: DataTypes.ENUM(USER_ROLES.CUSTOMER, USER_ROLES.DRIVER, USER_ROLES.RESTAURANT, USER_ROLES.ADMIN),
        defaultValue: USER_ROLES.CUSTOMER 
    },
    phoneNumber: { type: DataTypes.STRING },
    profileImage: { type: DataTypes.STRING }, // Cloudinary URL
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
});

module.exports = User;