import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './slices/counterSlice'
import lengthReducer from './slices/lengthSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    length: lengthReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch