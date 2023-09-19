import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UiState {
  mousePosition: [number, number];
  soundStarted: boolean;
  moduleSelectorOpen: boolean;
  connectionMatrixOpen: boolean;
  deleteMode: boolean;
  rerenderToggle: boolean;
  isRecording: boolean;
  drawingLine: null | any;
}

const initialState: UiState = {
  mousePosition: [0, 0],
  soundStarted: false,
  moduleSelectorOpen: false,
  connectionMatrixOpen: false,
  deleteMode: false,
  rerenderToggle: false,
  isRecording: false,
  drawingLine: null,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    updateMousePosition: (state, action) => {
      state.mousePosition = action.payload;
    },
    toggleConnectionMatrix: (state) => {
      state.connectionMatrixOpen = !state.connectionMatrixOpen;
      console.log(state.connectionMatrixOpen);
    },
    toggleModuleSelector: (state) => {
      state.moduleSelectorOpen = !state.moduleSelectorOpen;
    },
    toggleIsRecording: (state) => {
      state.isRecording = !state.isRecording;
    },
    setDrawingLine: (state, action) => {
      state.drawingLine = action.payload;
    },
  },
});

export const {
  updateMousePosition,
  toggleConnectionMatrix,
  toggleModuleSelector,
  toggleIsRecording,
  setDrawingLine,
} = uiSlice.actions;

export default uiSlice.reducer;
