import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store/store";

export interface AdminState {
  isAdmin : boolean
}

const initialState : AdminState = {
  isAdmin : true, // TODO should be false by default
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

