import { loadFromLocalStorage, saveToLocalStorage } from "@helpers/helper.js";
import { createSlice } from "@reduxjs/toolkit";

const ROOT_KEY = 'pms';

const pmsSlice = createSlice({
    name: 'pms',
    initialState: {
        viewType: loadFromLocalStorage(ROOT_KEY, 'viewType', 'grid'),
        filters: loadFromLocalStorage(ROOT_KEY, 'filters', { workspace: null, status: null, priority: null }),
    },
    reducers: {
        setViewType: (state, action) => {
            state.viewType = action.payload;
            saveToLocalStorage(ROOT_KEY, 'viewType', state.viewType);
        },
        setFilters: (state, action) => {
            state.filters = action.payload;
            saveToLocalStorage(ROOT_KEY, 'filters', state.filters);
        },
        resetFilters: (state) => {
            state.filters = { workspace: null, status: null, priority: null };
            saveToLocalStorage(ROOT_KEY, 'filters', state.filters);
        },
    },
});

export const { setViewType, setFilters, resetFilters } = pmsSlice.actions;
export default pmsSlice.reducer;