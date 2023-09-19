import { configureStore } from "@reduxjs/toolkit";

import uiReducer from "./uiSlice";
import sessionReducer from "./sessionSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    session: sessionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
