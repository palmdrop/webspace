import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import adminReducer from '../slices/adminSlice';
import pagesReducer from '../slices/pagesSlice';
import uiReducer from '../slices/uiSlice';

export const store = configureStore( {
  reducer: {
    ui: uiReducer,
    admin: adminReducer,
    pages: pagesReducer
  }
} );

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;