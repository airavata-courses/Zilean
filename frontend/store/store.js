import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import { authApi } from '../slices/authApi';
import { plotDataApi } from '../slices/plotDataApi';
import {auditApi} from '../slices/auditApi';


import authReducer from '../slices/authSlice';
import plotDataReducer from '../slices/plotDataSlice';
import auditReducer from '../slices/auditSlice';



import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER
} from 'redux-persist'

const reducers = combineReducers({
  // Add the generated reducer as a specific top-level slice
  [authApi.reducerPath]: authApi.reducer,
  [plotDataApi.reducerPath]: plotDataApi.reducer,
  [auditApi.reducerPath]: auditApi.reducer,
  authReducer,
  plotDataReducer,
  auditReducer,
})


const persistConfig = {
    key: "root",
    version: 1,
    storage,
    blacklist: [
      authApi.reducerPath,
      plotDataApi.reducerPath,
      auditApi.reducerPath,
      authReducer,
      plotDataReducer,
      auditReducer,
    ],
  }

const persistedReducer = persistReducer(persistConfig, reducers);

export const makeStore = () =>
  configureStore({
    reducer: persistedReducer,
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    middleware: (getDefaultMiddleware) => 
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      })
        .concat(authApi.middleware)
        .concat(plotDataApi.middleware)
        .concat(auditApi.middleware)
    
  })
 
export const store = makeStore()


// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)
