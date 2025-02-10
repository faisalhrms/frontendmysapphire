import { combineReducers } from '@reduxjs/toolkit';
import { authApi } from '/src/modules/auth/redux/authApi';
import authReducer from '/src/modules/auth/redux/authSlice';
import themeReducer from '/src/redux/common/themeSlice';
import delModalReducer from '/src/redux/common/delModalSlice.js';
import pmsReducer from "@modules/project-management/redux/pmsSlice.js";
const rootReducer = combineReducers({
  theme: themeReducer,
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
  pms: pmsReducer,
  delModal: delModalReducer
});

export default rootReducer;

