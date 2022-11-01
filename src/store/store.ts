import { configureStore } from '@reduxjs/toolkit';
import accountReducer from './account';
import authReducer from './auth';
import instanceReducer from './instance';
import timelineReducer from './timeline';
import socketReducer, { startSocket, stopSocket } from './socket';
import notificationReducer, {
  fetchNotifications,
  clearNotifications,
  notifyMiddleware,
} from './notification';

export const store = configureStore({
  reducer: {
    account: accountReducer,
    auth: authReducer,
    instance: instanceReducer,
    notification: notificationReducer,
    timeline: timelineReducer,
    socket: socketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(notifyMiddleware),
});

function handleNotifications(state: RootState) {
  if (state.auth.authenticated && state.notification.state === 'idle') {
    store.dispatch(fetchNotifications());
  }
  if (!state.auth.authenticated && state.notification.state !== 'idle') {
    store.dispatch(clearNotifications());
  }
}

function handleSocketConnection(state: RootState) {
  const socket = state.socket.user;
  if (state.auth.authenticated && !socket) {
    store.dispatch(startSocket());
  }
  if (!state.auth.authenticated && socket) {
    store.dispatch(stopSocket());
  }
}

handleNotifications(store.getState());

handleSocketConnection(store.getState());

export const isAuthenticated = () => !!store.getState().auth.authenticated;

export const accessToken = () => store.getState().auth.accessToken;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
