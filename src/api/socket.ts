import storage from '@utils/storage';

export type Stream = 'user' | 'public' | 'public:local';

export function connectSocket(stream: Stream = 'user') {
  const currentInstance = storage.currentInstance;
  const accessToken = storage.accessToken;
  if (!currentInstance || !accessToken)
    throw new Error('Cannot call without being logged in to an instance');
  const socket = new WebSocket(
    `wss://${currentInstance}/api/v1/streaming?stream=${stream}&access_token=${accessToken}`
  );
  return socket;
}
