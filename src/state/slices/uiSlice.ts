import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store/store";

export interface UIState {
  activeNavBarEntry : number | null
}

const initialState : UIState = {
  activeNavBarEntry : null
};

export const uiSlice = createSlice( {
  name: 'ui',

  initialState,

  reducers: {
    setActiveNavBarEntry : ( state, action : PayloadAction<number | null> ) => {
      state.activeNavBarEntry = action.payload;
    }
  }
});

export const { setActiveNavBarEntry } = uiSlice.actions;

export const selectActiveNavBarEntry = ( state : RootState ) => state.ui.activeNavBarEntry;

export default uiSlice.reducer;