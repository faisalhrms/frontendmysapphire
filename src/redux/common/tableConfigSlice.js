import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

export const tableConfigSlice = createSlice({
    name: 'tableConfig',
    initialState,
    reducers: {
        setTableConfig: (state, action) => {
            const { apiKey, config } = action.payload;
            state[apiKey] = config;
        },
        updateColumnOrder: (state, action) => {
            const { apiKey, columnOrder } = action.payload;
            if (state[apiKey]) {
                state[apiKey].columnOrder = columnOrder;
            } else {
                state[apiKey] = { columnOrder };
            }
        }
    }
});

export const { setTableConfig, updateColumnOrder } = tableConfigSlice.actions;
export default tableConfigSlice.reducer;