// src/redux/productSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shoponeproducts: [],
};

const shopOneProductSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setShopOneProducts: (state, action) => {
      state.shoponeproducts = action.payload;
    },
    addShopOneProducts: (state, action) => {
      state.shoponeproducts.push(action.payload);
    },
    updateShopOneProducts: (state, action) => {
      // Find the index of the product to update
      const index = state.shoponeproducts.findIndex(
        (product) => product.productid === action.payload.productid
      );
      if (index !== -1) {
        // Update the product at the found index
        state.shoponeproducts[index] = action.payload;
      }
    },
    deleteShopOneProducts: (state, action) => {
      // Filter out the product to delete
      state.shoponeproducts = state.shoponeproducts.filter(
        (product) => product.productid !== action.payload
      );
    },
  },
});

export const { setShopOneProducts, addShopOneProducts, updateShopOneProducts, deleteShopOneProducts } =
  shopOneProductSlice.actions;
export default shopOneProductSlice.reducer;
