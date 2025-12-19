import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetch('/api/admin/analytics', {
            headers: { 'Authorization': 'Bearer ADMIN_TOKEN' }
        })
        .then(res => res.json())
        .then(setStats);
    }, []);

    if (!stats) return <p>Loading Analytics...</p>;

    return (
        <div style={{ padding: '40px' }}>
            <h1>Platform Overview</h1>
            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={styles.statBox}>
                    <h3>Total Gross Volume</h3>
                    <p style={styles.money}>${stats.totalRevenue.toFixed(2)}</p>
                </div>
                <div style={styles.statBox}>
                    <h3>Platform Earnings (10%)</h3>
                    <p style={styles.profit}>${stats.platformProfit.toFixed(2)}</p>
                </div>
                <div style={styles.statBox}>
                    <h3>Total Orders</h3>
                    <p>{stats.orderCount}</p>
                </div>
            </div>

            <h2>Order Status Heatmap</h2>
            <ul>
                {stats.breakdown.map(item => (
                    <li key={item.status}>{item.status}: {item.count}</li>
                ))}
            </ul>
        </div>
    );
};

const styles = {
    statBox: { padding: '20px', border: '1px solid #eee', borderRadius: '10px', flex: 1, textAlign: 'center' },
    money: { fontSize: '24px', fontWeight: 'bold' },
    profit: { fontSize: '24px', fontWeight: 'bold', color: 'green' }
};