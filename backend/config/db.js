const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false, // Set to console.log to see SQL queries
    dialectOptions: {
        // Uncomment the following if using a hosted DB like Render or Heroku
        // ssl: {
        //     require: true,
        //     rejectUnauthorized: false
        // }
    }
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ PostgreSQL Database Connected...');
    } catch (err) {
        console.error('❌ Unable to connect to the database:', err);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };