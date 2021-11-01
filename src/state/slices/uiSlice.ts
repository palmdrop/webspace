import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PageRoute } from "../../App";
import { RootState } from "../store/store";

export enum ColorTheme {
  horizon = 'horizon',
  swamp = 'swamp', 
  dirty = 'dirty',
  vapor = 'vapor',
  haze = 'haze', 
  digital = 'digital'
};

export interface UIState {
  activeNavBarEntry : number | null,
  colorTheme : ColorTheme,
  nextPageRoute : PageRoute | null,
  activePiece : number | null
}

const initialState : UIState = {
  activeNavBarEntry : null,
  colorTheme : ColorTheme.horizon,
  nextPageRoute : null,
  activePiece : null,
};

export const uiSlice = createSlice( {
  name: 'ui',

  initialState,

  reducers: {
    setActiveNavBarEntry : ( state, action : PayloadAction<number | null> ) => {
      state.activeNavBarEntry = action.payload;
    },
    setColorTheme : ( state, action : PayloadAction<ColorTheme> ) => {
      state.colorTheme = action.payload;
    },
    setNextPageRoute : ( state, action : PayloadAction<PageRoute | null> ) => {
      state.nextPageRoute = action.payload;
    },
    setActivePiece : ( state, action : PayloadAction<number | null> ) => {
      state.activePiece = action.payload;
    }
  }
});

export const { setActiveNavBarEntry, setColorTheme, setNextPageRoute, setActivePiece } = uiSlice.actions;

export const selectActiveNavBarEntry = ( state : RootState ) => state.ui.activeNavBarEntry;
export const selectColorTheme = ( state : RootState ) => state.ui.colorTheme;
export const selectNextPageRoute = ( state : RootState ) => state.ui.nextPageRoute;
export const selectActivePiece = ( state : RootState ) => state.ui.activePiece;

export default uiSlice.reducer;