import { combineReducers } from '@reduxjs/toolkit';
import { authApi } from '/src/modules/auth/redux/authApi';
import authReducer from '/src/modules/auth/redux/authSlice';
import themeReducer from '/src/redux/common/themeSlice';
const rootReducer = combineReducers({
  theme: themeReducer,
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
});

export default rootReducer;

