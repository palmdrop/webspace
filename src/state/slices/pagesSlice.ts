import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store/store';

export interface PagesState {
  scrollPositions : { [location : string] : { x : number, y : number } }
}

const initialState : PagesState = {
  scrollPositions: {}
};

export const pagesSlice = createSlice( {
  name: 'pages',

  initialState,

  reducers: {
    pageDidScroll: ( state, action : PayloadAction<{ location : string, x : number, y : number }> ) => {
      console.log( action.payload );
      state.scrollPositions[ action.payload.location ] = {
        x: action.payload.x,
        y: action.payload.y,
      };
    }
  }
} );

export const { pageDidScroll } = pagesSlice.actions;

export const selectScrollPosition = ( state : RootState, location : string ) => {
  return state.pages.scrollPositions[ location ] ?? { x: 0, y: 0 };
};

export default pagesSlice.reducer;