import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io("http://localhost:5000");

const OrderManager = ({ restaurantId }) => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // Join the private room for this restaurant
        socket.emit('join', restaurantId);

        // Listen for new orders coming from the backend
        socket.on('new_order', (data) => {
            alert("🔔 New Order Received!");
            fetchOrders(); // Refresh the list
        });

        fetchOrders();

        return () => socket.disconnect();
    }, [restaurantId]);

    const fetchOrders = async () => {
        const response = await fetch(`http://localhost:5000/api/restaurants/${restaurantId}/active-orders`);
        const data = await response.json();
        setOrders(data);
    };

    const updateStatus = async (orderId, newStatus) => {
        await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        fetchOrders(); // Update UI
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>Kitchen Display System</h1>
            <div style={{ display: 'flex', gap: '20px' }}>
                {/* Column: New Orders */}
                <div className="column">
                    <h2>Incoming</h2>
                    {orders.filter(o => o.status === 'PENDING').map(order => (
                        <div key={order.id} style={styles.card}>
                            <p>Order #{order.id.slice(0,5)}</p>
                            <button onClick={() => updateStatus(order.id, 'ACCEPTED')}>Accept Order</button>
                        </div>
                    ))}
                </div>

                {/* Column: Preparing */}
                <div className="column">
                    <h2>In Kitchen</h2>
                    {orders.filter(o => o.status === 'ACCEPTED').map(order => (
                        <div key={order.id} style={styles.card}>
                            <p>Items: {order.items.map(i => i.name).join(', ')}</p>
                            <button onClick={() => updateStatus(order.id, 'READY_FOR_PICKUP')}>Mark Ready</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const styles = {
    card: { border: '1px solid #ddd', padding: '15px', borderRadius: '8px', marginBottom: '10px', backgroundColor: '#f9f9f9' }
};

export default OrderManager;