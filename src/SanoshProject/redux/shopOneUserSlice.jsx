import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: [],
};

const shopOneUserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = shopOneUserSlice.actions;

export default shopOneUserSlice.reducer;
