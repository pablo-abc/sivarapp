import { authenticateUser, authorizeUser, unauthenticateUser } from '@api/auth';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Application } from '@types';
import { toast } from '@utils/toast';
import storage, { type RegisteredAccounts } from '@utils/storage';
import { Router } from '@vaadin/router';
import {
  startNotifications,
  stopNotifications,
  fetchNotifications,
  clearNotifications,
} from './notification';
import { getMe } from '@api/account';

export type AuthState = {
  accessToken?: string;
  authorizationCode?: string;
  authenticated: boolean;
  instanceName?: string;
  username?: string;
  application?: Application;
  accounts: RegisteredAccounts;
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
    const accessToken = await authenticateUser(code);
    const user = await getMe();
    const url = new URL(user.url);
    dispatch(startNotifications());
    dispatch(fetchNotifications());
    storage.accounts = {
      ...storage.accounts,
      [url.hostname]: {
        accessToken,
        username: user.username,
      },
    };
    return {
      accessToken,
      username: user.username,
      instanceName: url.hostname,
    };
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

export const switchInstance = createAsyncThunk(
  'auth/switchInstance',
  async (instance: string, { dispatch, getState }) => {
    const state: any = getState();
    const accounts: RegisteredAccounts = state.auth.accounts;
    const currentAccount = accounts[instance];
    if (!currentAccount) {
      throw new Error('Failed to switch');
    }
    dispatch(stopNotifications());
    dispatch(clearNotifications());
    storage.currentInstance = instance;
    storage.accessToken = currentAccount.accessToken;
    setTimeout(() => {
      dispatch(startNotifications());
      dispatch(fetchNotifications());
    }, 500);
    return currentAccount;
  }
);

const initialState: AuthState = {
  accessToken: storage.accessToken,
  authenticated: !!storage.accessToken,
  instanceName: storage.currentInstance,
  application: storage.currentApp,
  accounts: storage.accounts,
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
    builder.addCase(authenticate.fulfilled, (state, action) => {
      state.authenticated = true;
      state.accessToken = action.payload.accessToken;
      state.username = action.payload.username;
      state.instanceName = action.payload.instanceName;
      state.authorizationCode = undefined;
    });

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

    builder.addCase(switchInstance.rejected, () => {});
    builder.addCase(switchInstance.fulfilled, (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.username = action.payload.username;
    });
  },
});

export default authSlice.reducer;
