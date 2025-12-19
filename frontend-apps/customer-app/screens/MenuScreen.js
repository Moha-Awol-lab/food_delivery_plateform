import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useCart } from '../context/CartContext';

const MenuScreen = ({ route, navigation }) => {
  const { restaurantId } = route.params;
  const [menu, setMenu] = useState([]);
  const { addToCart, cartItems, getCartTotal } = useCart();

  useEffect(() => {
    fetch(`http://YOUR_API/api/restaurants/${restaurantId}/menu`)
      .then(res => res.json())
      .then(setMenu);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={menu}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <View>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text>${item.price}</Text>
            </View>
            <TouchableOpacity 
              style={styles.addButton} 
              onPress={() => addToCart(item, restaurantId)}
            >
              <Text style={{color: 'white'}}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {cartItems.length > 0 && (
        <TouchableOpacity 
          style={styles.checkoutBar}
          onPress={() => navigation.navigate('Checkout')}
        >
          <Text style={styles.checkoutText}>
            View Basket • ${getCartTotal().toFixed(2)}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 0.5 },
  itemName: { fontSize: 16, fontWeight: 'bold' },
  addButton: { backgroundColor: '#e67e22', padding: 10, borderRadius: 5 },
  checkoutBar: { backgroundColor: '#27ae60', padding: 20, alignItems: 'center' },
  checkoutText: { color: 'white', fontWeight: 'bold', fontSize: 18 }
});