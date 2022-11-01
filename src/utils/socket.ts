import type { Notification, Status } from '@types';

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

export function onUpdate(subscriber: (status: Status) => void) {
  return function (event: MessageEvent<string>) {
    const data = JSON.parse(event.data);
    if (data.event !== 'update') return;
    const status: Status = JSON.parse(data.payload);
    subscriber(status);
  };
}
