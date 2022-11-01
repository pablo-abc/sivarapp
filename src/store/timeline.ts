import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import type { Status } from '@types';
import { getTimeline } from '@api/timelines';
import storage from '@utils/storage';
import { toast } from '@utils/toast';

type Timeline = 'public' | 'home' | 'local';

export type TimelineState = {
  instances: {
    [key: string]: {
      [key in Timeline]: {
        statuses: Status[];
        empty: boolean;
        stale: boolean;
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

export const fetchNewStatuses = createAsyncThunk(
  'timeline/fetchNewStatuses',
  async (timeline: Timeline = 'public', store) => {
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
        since_id: toots[0].id,
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

function initTimelines(state: TimelineState, instance: string) {
  if (!state.instances[instance])
    state.instances[instance] = {
      public: {
        statuses: [],
        empty: false,
        stale: false,
      },
      local: {
        statuses: [],
        empty: false,
        stale: false,
      },
      home: {
        statuses: [],
        empty: false,
        stale: false,
      },
    };
}

export const timelineSlice = createSlice({
  name: 'timeline',
  initialState,
  reducers: {
    addNewStatus(
      state: TimelineState,
      action: PayloadAction<{ timeline: Timeline; status: Status }>
    ) {
      const instance = storage.currentInstance;
      const { timeline, status } = action.payload;
      if (!instance) return;
      initTimelines(state, instance);
      state.instances[instance][timeline].statuses.unshift(status);
    },
    resetTimeline(
      state: TimelineState,
      action: PayloadAction<'public' | 'home' | 'local'>
    ) {
      const instance = storage.currentInstance;
      if (!instance || !state.instances[instance]) return;
      state.instances[instance]![action.payload] = {
        statuses: [],
        empty: false,
        stale: false,
      };
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchTimeline.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchNewStatuses.fulfilled, (state, action) => {
      const instance = storage.currentInstance;
      const { timeline, statuses } = action.payload;
      if (!instance || !timeline) return;
      initTimelines(state, instance);
      state.instances[instance][timeline].statuses.unshift(...statuses);
      state.loading = false;
    });
    builder.addCase(fetchTimeline.fulfilled, (state, action) => {
      const instance = storage.currentInstance;
      const { timeline, statuses } = action.payload;
      if (!instance || !timeline) return;
      initTimelines(state, instance);
      state.instances[instance][timeline].statuses.push(...statuses);
      state.instances[instance][timeline].empty = statuses.length === 0;
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

export const { resetTimeline, addNewStatus } = timelineSlice.actions;
