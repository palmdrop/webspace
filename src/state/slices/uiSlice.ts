import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PageRoute } from "../../App";
import { RootState } from "../store/store";

export enum ColorScheme {
  horizon = 'horizon',
  swamp = 'swamp', 
};

export interface UIState {
  activeNavBarEntry : number | null,
  colorScheme : ColorScheme,
  nextPageRoute : PageRoute | null
}

const initialState : UIState = {
  activeNavBarEntry : null,
  colorScheme : ColorScheme.horizon,
  nextPageRoute : null
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
    },
    setNextPageRoute : ( state, action : PayloadAction<PageRoute | null> ) => {
      state.nextPageRoute = action.payload;
    }
  }
});

export const { setActiveNavBarEntry, setColorScheme, setNextPageRoute } = uiSlice.actions;

export const selectActiveNavBarEntry = ( state : RootState ) => state.ui.activeNavBarEntry;
export const selectColorScheme = ( state : RootState ) => state.ui.colorScheme;
export const selectNextPageRoute = ( state : RootState ) => state.ui.nextPageRoute;

export default uiSlice.reducer;