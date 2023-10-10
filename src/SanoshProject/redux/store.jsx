// src/redux/store.js

import { configureStore } from "@reduxjs/toolkit";
import shopOneProductReducer from "./shopOneProductSlice";
import shopOneCartReducer from "./shopOneCartSlice";
import shopOneUserReducer from "./shopOneUserSlice";
import shopThreeProductReducer from "./shopThreeProductSlice";

const store = configureStore({
  reducer: {
    shoponeproduct: shopOneProductReducer,
    shoponecart: shopOneCartReducer,
    shoponeuser: shopOneUserReducer,
    shopthreeproduct: shopThreeProductReducer,
  },
});

export default store;
