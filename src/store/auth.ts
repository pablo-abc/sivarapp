import { authenticateUser, authorizeUser, unauthenticateUser } from '@api/auth';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { toast } from '@utils/toast';

export type AuthState = {
  accessToken?: string;
  authorizationCode?: string;
  authenticated: boolean;
  clientId?: string;
  clientSecret?: string;
  redirectUri?: string;
};

export const authorize = createAsyncThunk('auth/authorize', async () => {
  return authorizeUser();
});

export const authenticate = createAsyncThunk(
  'auth/authenticate',
  async (args: {
    code: string;
    clientId: string;
    clientSecret: string;
    redirectUri: string;
  }) => {
    return authenticateUser(args);
  }
);

export const unauthenticate = createAsyncThunk(
  'auth/unauthenticate',
  async () => {
    return unauthenticateUser();
  }
);

const initialState: AuthState = {
  accessToken: localStorage.getItem('accessToken') || undefined,
  authenticated: !!localStorage.getItem('accessToken'),
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
    });
    builder.addCase(
      authorize.fulfilled,
      (
        _,
        action: PayloadAction<{
          clientId: string;
          clientSecret: string;
          redirectUri: string;
        }>
      ) => {
        return {
          ...action.payload,
          authenticated: false,
        };
      }
    );

    builder.addCase(unauthenticate.fulfilled, (state) => {
      state.authenticated = false;
      state.accessToken = undefined;
    });
  },
});

export default authSlice.reducer;
