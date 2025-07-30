import { createSlice } from '@reduxjs/toolkit';
import { loadFromLocalStorage, saveToLocalStorage } from '@helpers/helper.js';

const ROOT_KEY = 'tableConfig';

const defaultTableConfig = {
    visibleColumns: {},
    columnOrder: [],
    columnWidths: {}
};

const tableConfigSlice = createSlice({
    name: 'tableConfig',
    initialState: loadFromLocalStorage(ROOT_KEY, 'tables', {}), // Stores multiple tables by key
    reducers: {
        setTableConfig: (state, action) => {
            const { apiKey, config } = action.payload;
            state[apiKey] = { ...defaultTableConfig, ...config };
            saveToLocalStorage(ROOT_KEY, 'tables', state);
        },
        updateColumnOrder: (state, action) => {
            const { apiKey, columnOrder } = action.payload;
            if (!state[apiKey]) state[apiKey] = { ...defaultTableConfig };
            state[apiKey].columnOrder = columnOrder;
            saveToLocalStorage(ROOT_KEY, 'tables', state);
        },
        updateColumnWidths: (state, action) => {
            const { apiKey, columnWidths } = action.payload;
            if (!state[apiKey]) state[apiKey] = { ...defaultTableConfig };
            state[apiKey].columnWidths = columnWidths;
            saveToLocalStorage(ROOT_KEY, 'tables', state);
        },
        updateVisibleColumns: (state, action) => {
            const { apiKey, visibleColumns } = action.payload;
            if (!state[apiKey]) state[apiKey] = { ...defaultTableConfig };
            state[apiKey].visibleColumns = visibleColumns;
            saveToLocalStorage(ROOT_KEY, 'tables', state);
        },
        resetTableConfig: (state, action) => {
            const { apiKey } = action.payload;
            state[apiKey] = { ...defaultTableConfig };
            saveToLocalStorage(ROOT_KEY, 'tables', state);
        }
    }
});

export const {
    setTableConfig,
    updateColumnOrder,
    updateColumnWidths,
    updateVisibleColumns,
    resetTableConfig
} = tableConfigSlice.actions;

export default tableConfigSlice.reducer;