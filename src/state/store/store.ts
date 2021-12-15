import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import adminReducer from '../slices/adminSlice';
import uiReducer from '../slices/uiSlice';

export const store = configureStore( {
  reducer: {
    ui: uiReducer,
    admin: adminReducer
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