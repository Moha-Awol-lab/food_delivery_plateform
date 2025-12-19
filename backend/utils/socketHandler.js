const socketHandler = (io) => {
    io.on('connection', (socket) => {
        console.log('New connection:', socket.id);

        // User joins a room based on their ID (for private notifications)
        socket.on('join', (userId) => {
            socket.join(userId);
            console.log(`User ${userId} joined their private room`);
        });

        // Driver joins a Geo-Room (e.g., city_newyork) to receive nearby orders
        socket.on('join_city', (city) => {
            socket.join(city);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
};

module.exports = socketHandler;