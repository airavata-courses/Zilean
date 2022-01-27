
import { createSlice } from '@reduxjs/toolkit'

import { PURGE } from "redux-persist";

const initialState = {
  user_details: [],
}

export const plotDataSlice = createSlice({
  name: 'plotData',
  initialState,
  reducers: {
    setUserDetails: (state,action) => {
        state.userDetails = action.payload;
      },
  },


})

// Action creators are generated for each case reducer function
export const { setUserDetails } = plotDataSlice.actions;

export default plotDataSlice.reducer;



