import { configureStore } from '@reduxjs/toolkit';
import accountReducer from './account';
import authReducer from './auth';
import instanceReducer from './instance';

export const store = configureStore({
  reducer: {
    account: accountReducer,
    auth: authReducer,
    instance: instanceReducer,
  },
});

export const isAuthenticated = () => !!store.getState().auth.authenticated;

export const accessToken = () => store.getState().auth.accessToken;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
