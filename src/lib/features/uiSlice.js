import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedHomeTab: "all",
  selectedDashboardTab: "all",
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    switchHomeTab: (state, action) => {
      console.log("Switching home tab:", action.payload);
      state.selectedHomeTab = action.payload;
    },
    switchDashboardTab: (state, action) => {
      console.log("Switching dashboard tab:", action.payload);
      state.selectedDashboardTab = action.payload;
    },
  },
});

// Export action creators
export const { switchHomeTab, switchDashboardTab } = uiSlice.actions;

export default uiSlice.reducer;