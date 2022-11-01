import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { connectSocket } from '@api/socket';
import { onNotification } from '@utils/socket';
import { addNotification } from './notification';

import '@components/sv-notification';

type SocketState = {
  user?: WebSocket;
  public?: WebSocket;
  local?: WebSocket;
};

export const startSocket = createAsyncThunk(
  'socket/start',
  async (_, { dispatch, getState }) => {
    const state: any = getState();
    state.socket.user?.close(1000, 'Replaced');
    const socket = connectSocket();
    socket.addEventListener(
      'message',
      onNotification((notification) => {
        dispatch(addNotification(notification));
      })
    );
    return socket;
  }
);

export const stopSocket = createAsyncThunk('socket/stop', async (_, store) => {
  const state: any = store.getState();
  const socket: WebSocket | undefined = state.socket.user;
  socket?.close(1000, 'Signed out');
});

const initialState: SocketState = {};

export const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(startSocket.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(stopSocket.fulfilled, (state) => {
      state.user = undefined;
    });
  },
});

export default socketSlice.reducer;
