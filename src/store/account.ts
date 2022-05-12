import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import type { Account } from '@types';
import { getMe } from '@api/account';

type AccountState = {
  state: 'loading' | 'fetched' | 'error' | 'idle';
  accounts: {
    [key: string]: Account | undefined;
  };
};

export const fetchMe = createAsyncThunk('account/fetchMe', async () => {
  return getMe();
});

const initialState: AccountState = {
  state: 'idle',
  accounts: {},
};

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setAccount(state: AccountState, action: PayloadAction<Account>) {
      const account = action.payload;
      const instance = new URL(account.url).hostname;
      state.state = 'fetched';
      state.accounts[instance] = account;
    },
    clearAccount(state: AccountState, action: PayloadAction<string>) {
      state.state = 'idle';
      state.accounts[action.payload] = undefined;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchMe.pending, (state) => {
      state.state = 'loading';
    });
    builder.addCase(
      fetchMe.fulfilled,
      (state, action: PayloadAction<Account>) => {
        const account = action.payload;
        const instance = new URL(account.url).hostname;
        state.state = 'fetched';
        state.accounts[instance] = account;
      }
    );
  },
});

export default accountSlice.reducer;

export const { setAccount, clearAccount } = accountSlice.actions;
