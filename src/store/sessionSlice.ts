import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface SessionState {
  value: number;
}

const initialState: SessionState = {
  value: 0,
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = sessionSlice.actions;

export default sessionSlice.reducer;
