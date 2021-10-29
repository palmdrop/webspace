import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store/store";

export interface AdminState {
  isAdmin : boolean
}

const isDevelopment : boolean = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

const initialState : AdminState = {
  isAdmin : isDevelopment
}

export const adminSlice = createSlice( {
  name: 'admin',

  initialState,

  reducers: {
    setIsAdmin : ( state, action : PayloadAction<boolean> ) => {
      state.isAdmin = action.payload;
    }
  }
});

export const { setIsAdmin } = adminSlice.actions;

export const selectIsAdmin = ( state : RootState ) => state.admin.isAdmin;

export default adminSlice.reducer;

