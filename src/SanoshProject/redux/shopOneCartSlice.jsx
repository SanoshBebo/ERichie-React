// cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // Array to store cart items
  itemsInCart: 0,
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

    setNoOfItemsInCart: (state,action) =>{
      console.log(action.payload);
       
      state.itemsInCart = action.payload;
    },
    
    addNoOfItemsInCart: (state,action) =>{
      console.log(action.payload)
      state.itemsInCart += action.payload;
    },
    
    editNoOfItemsInCart: (state,action) =>{
      state.itemsInCart -= action.payload;
    },
    
    deleteItemInCart:(state,action)=>{
      state.itemsInCart -= action.payload;

    },

    cartUpdated: (state,action) => {
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
  setNoOfItemsInCart,
  addNoOfItemsInCart,
  editNoOfItemsInCart,
  deleteItemInCart,
} = shopOneCartSlice.actions;

export default shopOneCartSlice.reducer;
