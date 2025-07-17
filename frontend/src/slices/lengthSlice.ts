import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { t } from 'i18next'

interface LengthState {
    length: number
    status: string // 'pending' | 'resolved' | 'rejected'
    error: string | null
  }
  
  const initialState = { 
    length: 0, 
    status: 'pending', 
    error: null 
  } satisfies LengthState as LengthState

  export const fetchDataLength = createAsyncThunk(
    'length/fetchDataLength',
    async (userId: string) => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return []
        
        const response = await fetch(`http://localhost:4000/api/shoplists?userId=${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        if (!response.ok) throw new Error(t('shoplist.failedToFetch'))
        const data = await response.json()      
        return data
      } catch (error) {
        console.error("Error fetching data:", error)
        return []
      }
    }
  )

const lengthSlice = createSlice({
  name: 'length',// name of this slice 
  initialState,
  reducers: {// reducers are functions that modify the state
    setLength(state, action: PayloadAction<number>) {
        state.length = action.payload
      },
      resetLength(state) {
        state.length = 0
        state.status = 'pending'
        state.error = null
      }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDataLength.fulfilled, (state, action) => {
      state.length = action.payload.length
      
    })
  },
})

export const { setLength, resetLength } = lengthSlice.actions
export default lengthSlice.reducer