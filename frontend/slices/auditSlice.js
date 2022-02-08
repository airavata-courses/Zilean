import { createSlice } from '@reduxjs/toolkit'

import { PURGE } from "redux-persist";

const initialState = {
  next_cursor: "",

}

export const auditSlice = createSlice({
  name: 'audit',
  initialState,
  reducers: {
    setNextCursor: (state,action) => {
      state.access_token = action.payload;
    },


    /*
    Was not able to figure out where to put it and its ise case. Thats why I will set every authetication value to null when logOut is clicked
    extraReducers: (builder) => {
        // https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist
        this case is needed on logout to purge persisted storage or you get phantom calls in the cache? idk
        builder.addCase(PURGE, (state) => {
          setLogout.removeAll(state);
        })
        */

  },


})

// Action creators are generated for each case reducer function
export const { setNextCursor } = auditSlice.actions;

export default auditSlice.reducer;

