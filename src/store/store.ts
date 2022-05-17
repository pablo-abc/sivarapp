import { configureStore } from '@reduxjs/toolkit';
import accountReducer from './account';
import authReducer from './auth';
import instanceReducer from './instance';
import notificationReducer, {
  addNotification,
  fetchNotifications,
  clearNotifications,
  notifyMiddleware,
} from './notification';
import { connectNotifications } from '@api/account';
import { onNotification } from '@utils/socket';

export const store = configureStore({
  reducer: {
    account: accountReducer,
    auth: authReducer,
    instance: instanceReducer,
    notification: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(notifyMiddleware),
});

let notificationSocket: WebSocket | undefined;

function handleNotifications(state: RootState) {
  if (state.auth.authenticated && !notificationSocket) {
    notificationSocket = connectNotifications();
    notificationSocket.onmessage = onNotification((notification) => {
      store.dispatch(addNotification(notification));
    });
  }
  if (!state.auth.authenticated && notificationSocket) {
    notificationSocket.close(1000, 'Signed Out');
    notificationSocket = undefined;
  }
  if (state.auth.authenticated && state.notification.state === 'idle') {
    store.dispatch(fetchNotifications());
  }
  if (!state.auth.authenticated && state.notification.state !== 'idle') {
    store.dispatch(clearNotifications());
  }
}

handleNotifications(store.getState());

export const isAuthenticated = () => !!store.getState().auth.authenticated;

export const accessToken = () => store.getState().auth.accessToken;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
