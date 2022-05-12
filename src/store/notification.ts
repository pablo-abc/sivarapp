import { html } from 'lit';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Notification } from '@types';
import { toast } from '@utils/toast';

import '@shoelace-style/shoelace/dist/components/button/button.js';

type NotificationState = {
  unreadCount: number;
  notifications: Notification[];
};

const initialState: NotificationState = {
  unreadCount: 0,
  notifications: [],
};

function notifyMention(notification: Notification) {
  const status = notification.status;
  if (status.visibility === 'direct') {
    toast(html`
      <strong>Direct message</strong> <br />
      @${status.account.acct} sent you a direct message.<br />
      <sl-button href=${`/statuses/${status.id}`} size="small">
        See message
      </sl-button>
    `);
  } else {
    toast(html`
      <strong>Mention</strong><br />
      @${status.account.acct} mentioned you on a toot.<br />
      <sl-button href=${`/statuses/${status.id}`} size="small">
        See toot
      </sl-button>
    `);
  }
}

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
      if (notification.type === 'mention') notifyMention(notification);
    },
    setNotifications(
      state: NotificationState,
      action: PayloadAction<Notification[]>
    ) {
      state.notifications = action.payload;
    },
    markAsRead(state: NotificationState) {
      state.unreadCount = 0;
    },
  },
});

export default notificationSlice.reducer;

export const { addNotification, markAsRead } = notificationSlice.actions;
