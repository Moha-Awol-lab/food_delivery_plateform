const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { connectDB, sequelize } = require('./config/db');
const socketHandler = require('./utils/socketHandler');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

// Middleware
app.use(cors());
app.use(express.json());

// Attach io to req so controllers can use it
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/restaurants', require('./routes/restaurantRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Init WebSockets
socketHandler(io);

// Connect DB and Start Server
const startServer = async () => {
    await connectDB();
    
    // Sync Database (force: false ensures we don't delete data on every restart)
    await sequelize.sync({ force: false });
    
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

startServer();