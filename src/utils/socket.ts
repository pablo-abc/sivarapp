import type { Notification } from '@types';

export function onNotification(
  subscriber: (notification: Notification) => void
) {
  return function (event: MessageEvent<string>) {
    const data = JSON.parse(event.data);
    if (data.event !== 'notification') return;
    const notification: Notification = JSON.parse(data.payload);
    subscriber(notification);
  };
}
