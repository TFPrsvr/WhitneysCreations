import React, { createContext, useReducer, useContext } from 'react';

// --- Initial State
const initialState = {
  cartItems: [],
  taxRate: 0.08,
  shipping: 5.99,
};

// --- Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      return {
        ...state,
        cartItems: [...state.cartItems, action.payload],
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item.id !== action.payload),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        cartItems: [],
      };
    default:
      return state;
  }
};

// --- Create Context
const CartContext = createContext();

// --- Custom Hook
export const useCart = () => useContext(CartContext);

// --- Provider
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
const addToCart = (item) => dispatch({ type: 'ADD_TO_CART', payload: item });
  const removeFromCart = (id) => dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
const subtotal = state.cartItems.reduce((acc, item) => acc + item.price, 0);
  const tax = subtotal * state.taxRate;
  const total = subtotal + tax + state.shipping;
return (
    <CartContext.Provider value={{
      cartItems: state.cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      subtotal,
      tax,
      total,
      shipping: state.shipping
    }}>
      {children}
    </CartContext.Provider>
  );
};
