import { createContext, useContext, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

// Install uuid: npm install uuid

// Guest Action Types
const GUEST_ACTIONS = {
  SET_GUEST_ID: 'SET_GUEST_ID',
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_CART_ITEM: 'UPDATE_CART_ITEM',
  CLEAR_CART: 'CLEAR_CART',
  SAVE_GUEST_DATA: 'SAVE_GUEST_DATA',
  SET_CHECKOUT_INFO: 'SET_CHECKOUT_INFO',
  CLEAR_GUEST_SESSION: 'CLEAR_GUEST_SESSION'
};

// Initial State
const initialState = {
  guestId: null,
  cart: [],
  guestData: {
    email: '',
    firstName: '',
    lastName: '',
    phone: ''
  },
  checkoutInfo: {
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      sameAsShipping: true
    }
  },
  sessionStarted: null
};

// Guest Reducer
const guestReducer = (state, action) => {
  switch (action.type) {
    case GUEST_ACTIONS.SET_GUEST_ID:
      return {
        ...state,
        guestId: action.payload,
        sessionStarted: new Date().toISOString()
      };

    case GUEST_ACTIONS.ADD_TO_CART:
      const existingItemIndex = state.cart.findIndex(
        item => item.productId === action.payload.productId && 
                item.variantId === action.payload.variantId &&
                JSON.stringify(item.customization) === JSON.stringify(action.payload.customization)
      );

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const updatedCart = [...state.cart];
        updatedCart[existingItemIndex].quantity += action.payload.quantity;
        return {
          ...state,
          cart: updatedCart
        };
      } else {
        // Add new item to cart
        return {
          ...state,
          cart: [...state.cart, { ...action.payload, id: uuidv4() }]
        };
      }

    case GUEST_ACTIONS.REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload)
      };

    case GUEST_ACTIONS.UPDATE_CART_ITEM:
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, ...action.payload.updates }
            : item
        )
      };

    case GUEST_ACTIONS.CLEAR_CART:
      return {
        ...state,
        cart: []
      };

    case GUEST_ACTIONS.SAVE_GUEST_DATA:
      return {
        ...state,
        guestData: { ...state.guestData, ...action.payload }
      };

    case GUEST_ACTIONS.SET_CHECKOUT_INFO:
      return {
        ...state,
        checkoutInfo: { ...state.checkoutInfo, ...action.payload }
      };

    case GUEST_ACTIONS.CLEAR_GUEST_SESSION:
      return initialState;

    default:
      return state;
  }
};

// Create Context
const GuestContext = createContext();

// Guest Provider Component
export const GuestProvider = ({ children }) => {
  const [state, dispatch] = useReducer(guestReducer, initialState);

  // Initialize guest session on mount
  useEffect(() => {
    let guestId = localStorage.getItem('guestId');
    
    if (!guestId) {
      guestId = `guest_${uuidv4()}`;
      localStorage.setItem('guestId', guestId);
    }

    dispatch({
      type: GUEST_ACTIONS.SET_GUEST_ID,
      payload: guestId
    });

    // Load saved guest data
    loadGuestData(guestId);
  }, []);

  // Save guest data to localStorage whenever state changes
  useEffect(() => {
    if (state.guestId) {
      const guestData = {
        cart: state.cart,
        guestData: state.guestData,
        checkoutInfo: state.checkoutInfo,
        sessionStarted: state.sessionStarted
      };
      localStorage.setItem(`guest_data_${state.guestId}`, JSON.stringify(guestData));
    }
  }, [state.cart, state.guestData, state.checkoutInfo, state.guestId]);

  // Load guest data from localStorage
  const loadGuestData = (guestId) => {
    try {
      const savedData = localStorage.getItem(`guest_data_${guestId}`);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        // Check if session is still valid (24 hours)
        const sessionAge = Date.now() - new Date(parsedData.sessionStarted).getTime();
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours

        if (sessionAge < maxAge) {
          if (parsedData.cart) {
            parsedData.cart.forEach(item => {
              dispatch({
                type: GUEST_ACTIONS.ADD_TO_CART,
                payload: item
              });
            });
          }
          
          if (parsedData.guestData) {
            dispatch({
              type: GUEST_ACTIONS.SAVE_GUEST_DATA,
              payload: parsedData.guestData
            });
          }
          
          if (parsedData.checkoutInfo) {
            dispatch({
              type: GUEST_ACTIONS.SET_CHECKOUT_INFO,
              payload: parsedData.checkoutInfo
            });
          }
        } else {
          // Session expired, clear data
          clearGuestSession();
        }
      }
    } catch (error) {
      console.error('Error loading guest data:', error);
    }
  };

  // Add item to cart
  const addToCart = (item) => {
    dispatch({
      type: GUEST_ACTIONS.ADD_TO_CART,
      payload: {
        ...item,
        addedAt: new Date().toISOString()
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    dispatch({
      type: GUEST_ACTIONS.REMOVE_FROM_CART,
      payload: itemId
    });
  };

  // Update cart item
  const updateCartItem = (itemId, updates) => {
    dispatch({
      type: GUEST_ACTIONS.UPDATE_CART_ITEM,
      payload: { id: itemId, updates }
    });
  };

  // Clear entire cart
  const clearCart = () => {
    dispatch({ type: GUEST_ACTIONS.CLEAR_CART });
  };

  // Save guest information
  const saveGuestData = (data) => {
    dispatch({
      type: GUEST_ACTIONS.SAVE_GUEST_DATA,
      payload: data
    });
  };

  // Set checkout information
  const setCheckoutInfo = (info) => {
    dispatch({
      type: GUEST_ACTIONS.SET_CHECKOUT_INFO,
      payload: info
    });
  };

  // Clear guest session
  const clearGuestSession = () => {
    if (state.guestId) {
      localStorage.removeItem(`guest_data_${state.guestId}`);
      localStorage.removeItem('guestId');
    }
    dispatch({ type: GUEST_ACTIONS.CLEAR_GUEST_SESSION });
  };

  // Get cart total
  const getCartTotal = () => {
    return state.cart.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  // Get cart item count
  const getCartItemCount = () => {
    return state.cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Check if item is in cart
  const isInCart = (productId, variantId, customization = {}) => {
    return state.cart.some(item =>
      item.productId === productId &&
      item.variantId === variantId &&
      JSON.stringify(item.customization) === JSON.stringify(customization)
    );
  };

  // Convert guest cart to user cart (when guest signs up/logs in)
  const convertToUserCart = () => {
    return state.cart.map(item => ({
      ...item,
      convertedFromGuest: true,
      originalGuestId: state.guestId
    }));
  };

  // Get guest checkout data for order processing
  const getCheckoutData = () => {
    return {
      guestId: state.guestId,
      guestData: state.guestData,
      checkoutInfo: state.checkoutInfo,
      cart: state.cart,
      totals: {
        subtotal: getCartTotal(),
        itemCount: getCartItemCount()
      }
    };
  };

  const value = {
    // State
    guestId: state.guestId,
    cart: state.cart,
    guestData: state.guestData,
    checkoutInfo: state.checkoutInfo,
    sessionStarted: state.sessionStarted,

    // Actions
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    saveGuestData,
    setCheckoutInfo,
    clearGuestSession,

    // Utilities
    getCartTotal,
    getCartItemCount,
    isInCart,
    convertToUserCart,
    getCheckoutData
  };

  return (
    <GuestContext.Provider value={value}>
      {children}
    </GuestContext.Provider>
  );
};

GuestProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// Custom hook to use guest context
export const useGuest = () => {
  const context = useContext(GuestContext);
  if (!context) {
    throw new Error('useGuest must be used within a GuestProvider');
  }
  return context;
};

export default GuestContext;