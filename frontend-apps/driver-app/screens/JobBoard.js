import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import io from 'socket.io-client';

const socket = io("http://YOUR_API_URL");

const JobBoard = ({ navigation }) => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        // Join the 'available_drivers' room to hear about new ready orders
        socket.emit('join_room', 'available_drivers');

        socket.on('delivery_opportunity', (newJob) => {
            setJobs(prevJobs => [newJob, ...prevJobs]);
        });

        return () => socket.disconnect();
    }, []);

    const acceptJob = async (orderId) => {
        const res = await fetch(`http://YOUR_API_URL/api/orders/${orderId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer DRIVER_TOKEN' },
            body: JSON.stringify({ status: 'PICKED_UP' })
        });

        if (res.ok) {
            navigation.navigate('DeliveryMap', { orderId });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Available Deliveries</Text>
            <FlatList
                data={jobs}
                keyExtractor={item => item.orderId}
                renderItem={({ item }) => (
                    <View style={styles.jobCard}>
                        <Text style={styles.resName}>{item.restaurantName}</Text>
                        <Text>{item.address}</Text>
                        <TouchableOpacity style={styles.btn} onPress={() => acceptJob(item.orderId)}>
                            <Text style={{color: '#fff'}}>Accept Delivery</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};