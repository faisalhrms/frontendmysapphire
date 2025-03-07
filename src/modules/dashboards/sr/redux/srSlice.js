import { createSlice } from "@reduxjs/toolkit"
import { loadFromLocalStorage, saveToLocalStorage } from "@helpers/helper.js"

const ROOT_KEY = 'sr'

const srSlice = createSlice({
  name: 'sr',
  initialState: {
    filters: loadFromLocalStorage(ROOT_KEY, 'filters', {})
  },
  reducers: {
    setSrFilters: (state, action) => {
      state.filters = action.payload
      saveToLocalStorage(ROOT_KEY, 'filters', state.filters)
    },
    resetSrFilters: (state) => {
      state.filters = {}
      saveToLocalStorage(ROOT_KEY, 'filters', state.filters)
    }
  }
})

export const { setSrFilters, resetSrFilters } = srSlice.actions
export default srSlice.reducer
