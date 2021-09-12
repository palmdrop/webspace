import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PageRoute } from "../../App";
import { RootState } from "../store/store";

export enum ColorThemes {
  horizon = 'horizon',
  swamp = 'swamp', 
  dirty = 'dirty',
};


export interface UIState {
  activeNavBarEntry : number | null,
  colorScheme : ColorThemes,
  nextPageRoute : PageRoute | null,
  activePiece : number | null
}

const initialState : UIState = {
  activeNavBarEntry : null,
  colorScheme : ColorThemes.horizon,
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
    setColorScheme : ( state, action : PayloadAction<ColorThemes> ) => {
      state.colorScheme = action.payload;
    },
    setNextPageRoute : ( state, action : PayloadAction<PageRoute | null> ) => {
      state.nextPageRoute = action.payload;
    },
    setActivePiece : ( state, action : PayloadAction<number | null> ) => {
      state.activePiece = action.payload;
    }
  }
});

export const { setActiveNavBarEntry, setColorScheme, setNextPageRoute, setActivePiece } = uiSlice.actions;

export const selectActiveNavBarEntry = ( state : RootState ) => state.ui.activeNavBarEntry;
export const selectColorScheme = ( state : RootState ) => state.ui.colorScheme;
export const selectNextPageRoute = ( state : RootState ) => state.ui.nextPageRoute;
export const selectActivePiece = ( state : RootState ) => state.ui.activePiece;

export default uiSlice.reducer;