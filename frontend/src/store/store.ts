import { configureStore } from '@reduxjs/toolkit';
import solutionsReducer from './solutionsSlice';

const store = configureStore({
  reducer: {
    solutions: solutionsReducer,
  },
});

// Export store and types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
