import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Status } from '@types';
import { getTimeline } from '@api/timelines';
import storage from '@utils/storage';
import { toast } from '@utils/toast';

export type TimelineState = {
  instances: {
    [key: string]: {
      public?: {
        newStatuses: Status[];
        statuses: Status[];
        empty: boolean;
      };
      home?: {
        newStatuses: Status[];
        statuses: Status[];
        empty: boolean;
      };
      local?: {
        newStatuses: Status[];
        statuses: Status[];
        empty: boolean;
      };
    };
  };
  loading: boolean;
};

export const fetchTimeline = createAsyncThunk(
  'timeline/fetch',
  async (timeline: Parameters<typeof getTimeline>[0] = 'public', store) => {
    const state: any = store.getState();
    const instance = storage.currentInstance;
    if (!instance)
      return {
        statuses: [],
      };
    const timelineState = state.timeline as TimelineState;
    const toots = timelineState.instances[instance]?.[timeline]?.statuses ?? [];
    let newToots: Status[];
    if (toots.length === 0) {
      newToots = await getTimeline(timeline);
    } else {
      newToots = await getTimeline(timeline, {
        max_id: toots[toots.length - 1].id,
      });
    }
    return {
      timeline,
      statuses: newToots,
    };
  }
);

const initialState: TimelineState = {
  instances: {},
  loading: false,
};

export const timelineSlice = createSlice({
  name: 'timeline',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchTimeline.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchTimeline.fulfilled, (state, action) => {
      const instance = storage.currentInstance;
      const { timeline, statuses } = action.payload;
      if (!instance || !timeline) return;
      if (!state.instances[instance]) state.instances[instance] = {};
      const oldStatuses = state.instances[instance][timeline]?.statuses ?? [];
      state.instances[instance][timeline] = {
        statuses: [...oldStatuses, ...statuses],
        newStatuses: [],
        empty: statuses.length === 0,
      };
      state.loading = false;
    });
    builder.addCase(fetchTimeline.rejected, (state) => {
      state.loading = false;
      toast('Failed to fetch timeline', {
        variant: 'danger',
        icon: 'x-circle',
      });
    });
  },
});

export default timelineSlice.reducer;
