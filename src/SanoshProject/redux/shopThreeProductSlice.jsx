// src/redux/productSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shopthreeproducts: [],
};

const shopThreeProductSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setShopThreeProducts: (state, action) => {
      state.shopthreeproducts = action.payload;
    },
    addShopThreeProducts: (state, action) => {
      state.shopthreeproducts.push(action.payload);
    },
    updateShopThreeProducts: (state, action) => {
      // Find the index of the product to update
      const index = state.shopthreeproducts.findIndex(
        (product) => product.shopthreeproducts === action.payload.productid
      );
      if (index !== -1) {
        // Update the product at the found index
        state.shopthreeproducts[index] = action.payload;
      }
    },
    deleteShopThreeProducts: (state, action) => {
      // Filter out the product to delete
      state.shopthreeproducts = state.shopthreeproducts.filter(
        (product) => product.productid !== action.payload
      );
    },
  },
});

export const { setShopThreeProducts, addShopThreeProducts, updateShopThreeProducts, deleteShopThreeProducts } =
  shopThreeProductSlice.actions;
export default shopThreeProductSlice.reducer;
