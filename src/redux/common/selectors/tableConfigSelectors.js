// tableConfigSelectors.js
import { createSelector } from '@reduxjs/toolkit';

// Basic selector that returns the table config for a specific apiKey
const selectTableConfigByKey = (state, apiKey) => state.tableConfig[apiKey];

// Memoized selector for column order
export const makeSelectColumnOrder = () => createSelector(
    [selectTableConfigByKey],
    (tableConfig) => tableConfig?.columnOrder || null
);

// Memoized selector for the entire table config
export const makeSelectTableConfig = () => createSelector(
    [selectTableConfigByKey],
    (tableConfig) => tableConfig || {}
);