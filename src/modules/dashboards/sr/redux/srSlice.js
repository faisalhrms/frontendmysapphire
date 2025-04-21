import { createSlice } from "@reduxjs/toolkit"
import { loadFromLocalStorage, saveToLocalStorage } from "@helpers/helper.js"

const ROOT_KEY = 'sr'

const defaultFilters = {
  company_id: null,
  store_region_id: null,
  city_id: null,
  location_id: null,
  department_id: null,
  sub_department_id: null,
  month: null,
  year_dashboard: null
}

const srSlice = createSlice({
  name: 'sr',
  initialState: {
    filters: loadFromLocalStorage(ROOT_KEY, 'filters', defaultFilters)
  },
  reducers: {
    setSrFilters: (state, action) => {
      state.filters = action.payload
      saveToLocalStorage(ROOT_KEY, 'filters', state.filters)
    },
    resetSrFilters: (state) => {
      state.filters = defaultFilters
      saveToLocalStorage(ROOT_KEY, 'filters', state.filters)
    }
  }
})

export const { setSrFilters, resetSrFilters } = srSlice.actions
export default srSlice.reducer