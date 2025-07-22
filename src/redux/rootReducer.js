import { combineReducers } from '@reduxjs/toolkit';
import { authApi } from '@modules/auth/redux/authApi';
import authReducer from '@modules/auth/redux/authSlice';
import themeReducer from '@redux/common/themeSlice';
import tableConfigReducer from '@redux/common/tableConfigSlice';
import delModalReducer from '@redux/common/delModalSlice.js';
import pmsReducer from "@modules/project-management/redux/pmsSlice.js";
import srReducer from "@modules/dashboards/sr/redux/srSlice.js"

const rootReducer = combineReducers({
  theme: themeReducer,
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
  pms: pmsReducer,
  tableConfig: tableConfigReducer,
  sr: srReducer,
  delModal: delModalReducer
});

export default rootReducer;

