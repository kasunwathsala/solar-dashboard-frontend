import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedDashboardTab: "all",
  selectedAnomaliesTab: "7days",
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    switchDashboardTab: (state, action) => {
      console.log(action);
      state.selectedDashboardTab = action.payload;
    },
    switchAnomaliesTab: (state, action) => {
      console.log(action);
      state.selectedAnomaliesTab = action.payload;
    },
  },
});

export const { switchDashboardTab, switchAnomaliesTab } = uiSlice.actions;

export default uiSlice.reducer;