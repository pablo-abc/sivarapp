import {
  createSlice,
  type PayloadAction,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import type { Instance } from '@types';
import { getInstance } from '@api/instance';

type InstanceState = {
  state: 'loading' | 'error' | 'fetched' | 'idle';
  instances: {
    [key: string]:
      | {
          uri: string;
          title: string;
        }
      | undefined;
  };
};

export const fetchInstance = createAsyncThunk('instance/fetch', () => {
  return getInstance();
});

const initialState: InstanceState = {
  state: 'idle',
  instances: {},
};

export const instanceSlice = createSlice({
  name: 'instance',
  initialState,
  reducers: {
    setInstance(state, action: PayloadAction<Instance>) {
      const instance = action.payload.uri;
      state.state = 'fetched';
      state.instances[instance] = {
        uri: instance,
        title: action.payload.title,
      };
    },
    clearInstance(state, action: PayloadAction<string>) {
      state.state = 'idle';
      state.instances[action.payload] = undefined;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchInstance.pending, (state) => {
      state.state = 'loading';
    });
    builder.addCase(
      fetchInstance.fulfilled,
      (state, action: PayloadAction<Instance>) => {
        const instance = action.payload;
        state.state = 'fetched';
        state.instances[instance.uri] = {
          uri: instance.uri,
          title: instance.title,
        };
      }
    );
  },
});

export default instanceSlice.reducer;

export const { setInstance, clearInstance } = instanceSlice.actions;
