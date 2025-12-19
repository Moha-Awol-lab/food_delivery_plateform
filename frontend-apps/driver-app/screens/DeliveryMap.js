import React, { useEffect } from 'react';
import * as Location from 'expo-location';
import io from 'socket.io-client';

const socket = io("http://YOUR_API_URL");

const DeliveryMap = ({ route }) => {
    const { orderId } = route.params;

    useEffect(() => {
        let locationSubscription;

        const startTracking = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;

            // Watch position changes
            locationSubscription = await Location.watchPositionAsync(
                { accuracy: Location.Accuracy.High, distanceInterval: 10 },
                (location) => {
                    const { latitude, longitude } = location.coords;
                    
                    // Emit to backend -> Backend sends to Customer
                    socket.emit('update_location', {
                        orderId,
                        lat: latitude,
                        lng: longitude
                    });
                }
            );
        };

        startTracking();
        return () => locationSubscription?.remove();
    }, [orderId]);

    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Tracking Active: Your location is being shared with the customer.</Text>
            {/* You would integrate a MapView here showing directions */}
        </View>
    );
};