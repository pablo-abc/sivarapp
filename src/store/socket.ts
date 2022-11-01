import { createAsyncThunk } from '@reduxjs/toolkit';
import { connectSocket, type Stream } from '@api/socket';
import { onNotification } from '@utils/socket';
import { addNotification } from './notification';

import '@components/sv-notification';

type Sockets = {
  user?: WebSocket;
  public?: WebSocket;
  local?: WebSocket;
};

export const sockets: Sockets = {};

export const startSocket = createAsyncThunk(
  'socket/start',
  async (stream: Stream | undefined = 'user', { dispatch }) => {
    sockets.user?.close(1000, 'Replaced');
    const socket = connectSocket(stream);
    if (stream === 'user') {
      socket.addEventListener(
        'message',
        onNotification((notification) => {
          dispatch(addNotification(notification));
        })
      );
    }
    sockets.user = socket;
  }
);

export const stopSocket = createAsyncThunk('socket/stop', async () => {
  const socket: WebSocket | undefined = sockets.user;
  socket?.close(1000, 'Signed out');
  sockets.user = undefined;
});
