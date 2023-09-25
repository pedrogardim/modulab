import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface SessionState {
  modules: any[];
  connections: any[];
}

const initialState: SessionState = {
  modules: [],
  connections: [],
};

export const saveSession = createAsyncThunk(
  "session/saveSession",
  async (_, { getState }) => {
    //TODO: test
    const { modules, connections } = getState().session;
    if (!modules) return;
    localStorage.setItem(
      "musalabsSession",
      JSON.stringify({
        modules: [...modules],
        connections: [...connections],
      })
    );
  }
);

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    addModuleToStore: (state, action) => {
      const { module } = action.payload;
      state.modules.push(module);
    },
    removeModuleFromStore: (state, action) => {
      const id = action.payload;
      state.modules = state.modules.filter((module) => module.id !== id);
      state.connections = state.connections.filter(
        (e) => e.module !== id && e.target.module !== id
      );
    },
    updateModulePosition: (state, action) => {
      const { moduleIndex, x, y } = action.payload;
      state.modules[moduleIndex] = {
        ...state.modules[moduleIndex],
        x: 32 * Math.round(x / 32),
        y: 32 * Math.round(y / 32),
      };
    },
    updateModuleParams: (state, action) => {
      const { moduleIndex, newModuleParams } = action.payload;
      state.modules[moduleIndex].p = {
        ...state.modules[moduleIndex].p,
        ...newModuleParams,
      };
    },
    addConnectionToStore: (state, action) => {
      const connection = action.payload;
      state.connections.push(connection);
    },
    removeConnectionFromStore: (state, action) => {
      const connectionIndex = action.payload;
      state.connections = state.connections.filter(
        (_, i) => i !== connectionIndex
      );
    },
  },
});

export const {
  addModuleToStore,
  removeModuleFromStore,
  updateModulePosition,
  updateModuleParams,
  addConnectionToStore,
  removeConnectionFromStore,
} = sessionSlice.actions;

export default sessionSlice.reducer;
