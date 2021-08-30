import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store/store";

export enum ColorScheme {
  horizon = 'horizon',
  swamp = 'swamp', 
};

export interface UIState {
  activeNavBarEntry : number | null,
  colorScheme : ColorScheme,
}

const initialState : UIState = {
  activeNavBarEntry : null,
  colorScheme : ColorScheme.horizon
};

export const uiSlice = createSlice( {
  name: 'ui',

  initialState,

  reducers: {
    setActiveNavBarEntry : ( state, action : PayloadAction<number | null> ) => {
      state.activeNavBarEntry = action.payload;
    },
    setColorScheme : ( state, action : PayloadAction<ColorScheme> ) => {
      state.colorScheme = action.payload;
    }
  }
});

export const { setActiveNavBarEntry, setColorScheme } = uiSlice.actions;

export const selectActiveNavBarEntry = ( state : RootState ) => state.ui.activeNavBarEntry;
export const selectColorScheme = ( state : RootState ) => state.ui.colorScheme;

export default uiSlice.reducer;