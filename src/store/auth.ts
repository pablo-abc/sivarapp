import { authenticateUser, authorizeUser, unauthenticateUser } from '@api/auth';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Application } from '@types';
import { toast } from '@utils/toast';
import storage from '@utils/storage';
import { Router } from '@vaadin/router';
import {
  startNotifications,
  stopNotifications,
  fetchNotifications,
  clearNotifications,
} from './notification';

export type AuthState = {
  accessToken?: string;
  authorizationCode?: string;
  authenticated: boolean;
  instanceName?: string;
  application?: Application;
};

export const authorize = createAsyncThunk(
  'auth/authorize',
  async (instanceName: string) => {
    return authorizeUser(instanceName);
  }
);

export const authenticate = createAsyncThunk(
  'auth/authenticate',
  async (code: string, { dispatch }) => {
    const authInfo = await authenticateUser(code);
    dispatch(startNotifications());
    dispatch(fetchNotifications());
    return authInfo;
  }
);

export const unauthenticate = createAsyncThunk(
  'auth/unauthenticate',
  async (_, { dispatch }) => {
    await unauthenticateUser();
    dispatch(stopNotifications());
    dispatch(clearNotifications());
  }
);

const initialState: AuthState = {
  accessToken: storage.accessToken,
  authenticated: !!storage.accessToken,
  instanceName: storage.currentInstance,
  application: storage.currentApp,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(authenticate.rejected, () => {
      toast('Failed to sign in', {
        variant: 'danger',
        icon: 'x-circle',
      });
      Router.go('/');
    });
    builder.addCase(
      authenticate.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.authenticated = true;
        state.accessToken = action.payload;
        state.authorizationCode = undefined;
      }
    );

    builder.addCase(authorize.rejected, () => {
      toast('Failed to sign in', {
        variant: 'danger',
        icon: 'x-circle',
      });
      Router.go('/');
    });
    builder.addCase(
      authorize.fulfilled,
      (state, action: PayloadAction<Application>) => {
        state.application = action.payload;
        state.authenticated = false;
      }
    );

    builder.addCase(unauthenticate.fulfilled, (state) => {
      state.authenticated = false;
      state.accessToken = undefined;
    });
  },
});

export default authSlice.reducer;
