import { createSlice } from '@reduxjs/toolkit'

import { PURGE } from "redux-persist";

const initialState = {
  isAuthenticated: false,
  access_token: "access_token",
  refresh_token: "refresh_token",
  user_details: {username:""},
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state,action) => {
      state.access_token = action.payload;
    },

    setRefreshToken: (state,action) => {
        state.refresh_token = action.payload;
      },

    setUserDetails: (state,action) => {
        state.user_details = action.payload;
      },

    setIsAuthenticated: (state,action) => {
        state.isAuthenticated = action.payload;
      },

    setLogout:(state)=>{
        // console.log("Inside Logout slice");
        state.isAuthenticated=false;
        state.access_token=null;
        state.refresh_token=null;
        state.user_details={username: ''};  
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
export const { setAccessToken,
    setRefreshToken, 
    setUserDetails, 
    setIsAuthenticated,
    setLogout } = authSlice.actions;

export default authSlice.reducer;

