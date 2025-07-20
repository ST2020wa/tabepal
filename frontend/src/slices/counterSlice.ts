import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface CounterState {
  value: number
}

const initialState = { value: 0 } satisfies CounterState as CounterState

const counterSlice = createSlice({
  name: 'counter',// name of this slice 
  initialState,
  reducers: {// reducers are functions that modify the state
    increment(state) {
      state.value++
    },
    decrement(state) {
      state.value--
    },
    incrementByAmount(state, action: PayloadAction<number>) {
      state.value += action.payload
    },
  },
})

export const { increment, decrement, incrementByAmount } = counterSlice.actions// export the actions
export default counterSlice.reducer