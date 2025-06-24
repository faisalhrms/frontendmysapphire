import { loadFromLocalStorage, saveToLocalStorage } from "@helpers/helper.js";
import { createSlice } from "@reduxjs/toolkit";

const ROOT_KEY = 'pms';

const defaultVisibleColumns = {
    actions: true,
    priority: true,
    name: true,
    person: true,
    teams: true,
    started_at: true,
    aging: true,
    ended_at: true,
    completed_at: true,
    status: true,
    completion_timeline: true,
    time_line_group: true,
    launch: true,
    progress: true,
    external_users: true,
    created_by: true
};

const defaultColumnOrder = [
    'actions',
    'priority',
    'name',
    'person',
    'teams',
    'started_at',
    'aging',
    'ended_at',
    'completed_at',
    'status',
    'completion_timeline',
    'time_line_group',
    'launch',
    'progress',
    'external_users',
    'created_by'
];

const pmsSlice = createSlice({
    name: 'pms',
    initialState: {
        viewType: loadFromLocalStorage(ROOT_KEY, 'viewType', 'grid'),
        filters: loadFromLocalStorage(ROOT_KEY, 'filters', { workspaces: [], status: null, priority: null }),
        visibleColumns: loadFromLocalStorage(ROOT_KEY, 'visibleColumns', defaultVisibleColumns),
        columnOrder: loadFromLocalStorage(ROOT_KEY, 'columnOrder', defaultColumnOrder),
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
            state.filters = { workspaces: [], status: null, priority: null };
            saveToLocalStorage(ROOT_KEY, 'filters', state.filters);
        },
        setVisibleColumns: (state, action) => {
            state.visibleColumns = action.payload;
            saveToLocalStorage(ROOT_KEY, 'visibleColumns', state.visibleColumns);
        },
        resetVisibleColumns: (state) => {
            state.visibleColumns = defaultVisibleColumns;
            saveToLocalStorage(ROOT_KEY, 'visibleColumns', state.visibleColumns);
        },
        setColumnOrder: (state, action) => {
            state.columnOrder = action.payload;
            saveToLocalStorage(ROOT_KEY, 'columnOrder', state.columnOrder);
        },
    },
});

export const {
    setViewType,
    setFilters,
    resetFilters,
    setVisibleColumns,
    resetVisibleColumns,
    setColumnOrder,
} = pmsSlice.actions;
export default pmsSlice.reducer;