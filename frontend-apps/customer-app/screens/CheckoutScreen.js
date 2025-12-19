import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { useCart } from '../context/CartContext';

const CheckoutScreen = ({ navigation }) => {
  const { cartItems, getCartTotal, restaurantId } = useCart();

  const handlePlaceOrder = async () => {
    const response = await fetch('http://YOUR_API/api/orders', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_JWT_TOKEN' 
      },
      body: JSON.stringify({
        restaurantId,
        items: cartItems,
        deliveryAddress: "123 Main St, New York", // Ideally use Google Autocomplete
        lat: 40.7128,
        lng: -74.0060
      })
    });

    if (response.ok) {
        const order = await response.json();
        Alert.alert("Success!", "Your order has been sent to the kitchen.");
        navigation.navigate('Tracking', { orderId: order.id });
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Order Summary</Text>
      {cartItems.map(item => (
        <Text key={item.id}>{item.name} x {item.quantity}</Text>
      ))}
      <Text style={{ fontSize: 20, marginTop: 20 }}>Total: ${getCartTotal().toFixed(2)}</Text>
      <Button title="Confirm & Pay" onPress={handlePlaceOrder} />
    </View>
  );
};