module.exports = {
    ORDER_STATUS: {
        PENDING: 'PENDING',        // Customer just ordered
        ACCEPTED: 'ACCEPTED',      // Restaurant accepted
        PREPARING: 'PREPARING',    // Food is being cooked
        READY: 'READY_FOR_PICKUP', // Food is waiting for driver
        PICKED_UP: 'PICKED_UP',    // Driver has the food
        DELIVERED: 'DELIVERED',    // Food reached customer
        CANCELLED: 'CANCELLED'
    },
    USER_ROLES: {
        CUSTOMER: 'customer',
        DRIVER: 'driver',
        RESTAURANT: 'restaurant_owner',
        ADMIN: 'admin'
    }
};