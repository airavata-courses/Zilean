import { createSlice } from "@reduxjs/toolkit";

import { PURGE } from "redux-persist";

const initialState = {
  user_details: [],
  isQueued: false,
  queue_count: 0,
};

export const plotDataSlice = createSlice({
  name: "plotData",
  initialState,
  reducers: {
    incrementQueueCount: (state,action) => {
      state.queue_count += action.payload;
    },
    decrementQueueCount: (state,action) => {
      state.queue_count -= action.payload;
    },
    setIsQueued: (state, action) => {
      state.isQueued = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { incrementQueueCount, decrementQueueCount, setIsQueued } =
  plotDataSlice.actions;

export default plotDataSlice.reducer;
