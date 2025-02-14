import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import { authApi } from '/src/modules/auth/redux/authApi';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['delModal/showModal'],
          ignoredActionPaths: ['payload.refetch'],
          ignoredPaths: ['delModal.refetch'],
        },
      }).concat(authApi.middleware),
});

export default store;