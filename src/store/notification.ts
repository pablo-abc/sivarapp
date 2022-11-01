import { type NotificationsParams, getNotifications } from '@api/account';
import { html } from 'lit';
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
  type Middleware,
} from '@reduxjs/toolkit';
import type { Notification } from '@types';
import { toast } from '@utils/toast';

import '@components/sv-notification';

type NotificationState = {
  state: 'loading' | 'fetched' | 'idle' | 'error';
  unreadCount: number;
  notifications: Notification[];
};

const initialState: NotificationState = {
  state: 'idle',
  unreadCount: 0,
  notifications: [],
};

function notifyMention(notification: Notification) {
  toast(
    html`<sv-notification .notification=${notification}></sv-notification>`
  );
}

export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async (params?: NotificationsParams) => {
    return getNotifications(params);
  }
);
export const notifyMiddleware: Middleware<any> =
  () => (next) => async (action) => {
    await next(action);
    if (action.type !== addNotification.type) return;
    const notification: Notification = action.payload;
    if (notification.type === 'mention') notifyMention(notification);
  };

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification(
      state: NotificationState,
      action: PayloadAction<Notification>
    ) {
      const notification = action.payload;
      state.unreadCount = state.unreadCount + 1;
      state.notifications = [notification, ...state.notifications];
    },
    setNotifications(
      state: NotificationState,
      action: PayloadAction<Notification[]>
    ) {
      state.notifications = action.payload;
    },
    clearNotifications(state: NotificationState) {
      state.notifications = [];
      state.state = 'idle';
      state.unreadCount = 0;
    },
    decrementUnread(state: NotificationState) {
      if (state.unreadCount > 0) state.unreadCount = state.unreadCount - 1;
    },
    markAllAsRead(state: NotificationState) {
      state.unreadCount = 0;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchNotifications.pending, (state) => {
      state.state = 'loading';
    });
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.state = 'fetched';
      state.notifications = action.payload;
    });
  },
});

export default notificationSlice.reducer;

export const {
  addNotification,
  markAllAsRead,
  setNotifications,
  clearNotifications,
  decrementUnread,
} = notificationSlice.actions;
