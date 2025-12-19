import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);

  const addToCart = (item, resId) => {
    // If user adds food from a DIFFERENT restaurant, clear the previous cart
    if (restaurantId && restaurantId !== resId) {
      setCartItems([{ ...item, quantity: 1 }]);
    } else {
      const existing = cartItems.find(i => i.id === item.id);
      if (existing) {
        setCartItems(cartItems.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        ));
      } else {
        setCartItems([...cartItems, { ...item, quantity: 1 }]);
      }
    }
    setRestaurantId(resId);
  };

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, getCartTotal, restaurantId }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);