// cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // Array to store cart items
  isCartUpdated: false,
};

const shopOneCartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (state, action) => {
      const existingItem = state.items.find(
        (item) => item.productid === action.payload.productid
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeItemFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => item.productid !== action.payload
      );
    },
    updateCartItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.productid === id);

      if (existingItem) {
        existingItem.quantity = quantity;
      }
    },
    setCartItems: (state, action) => {
      state.items = action.payload;
    },
    cartUpdated: (state) => {
      state.isCartUpdated = true;
    },
  },
});

export const {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  setCartItems,
  cartUpdated,
} = shopOneCartSlice.actions;

export default shopOneCartSlice.reducer;
