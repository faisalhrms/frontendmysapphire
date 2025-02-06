import { createSlice } from "@reduxjs/toolkit";
import { loadFromLocalStorage, saveToLocalStorage } from "@helpers/helper.js";

const ROOT_KEY = 'tasks';

const taskSlice = createSlice({
    name: 'tasks',
    initialState: {
        tasks: loadFromLocalStorage(ROOT_KEY, 'tasks', {}),  // Default to empty object
        taskCounts: loadFromLocalStorage(ROOT_KEY, 'taskCounts', {}),
        pagination: loadFromLocalStorage(ROOT_KEY, 'pagination', { limit: 5, offset: 0 }),
    },
    reducers: {
        setTasks: (state, action) => {
            state.tasks = action.payload || {};  // Ensure tasks is always an object
            saveToLocalStorage(ROOT_KEY, 'tasks', state.tasks);
        },
        setTaskCounts: (state, action) => {
            state.taskCounts = action.payload || {};  // Ensure taskCounts is always an object
            saveToLocalStorage(ROOT_KEY, 'taskCounts', state.taskCounts);
        },
        setPagination: (state, action) => {
            state.pagination = action.payload;
            saveToLocalStorage(ROOT_KEY, 'pagination', state.pagination);
        },
        addMoreTasks: (state, action) => {
            const { status, tasks } = action.payload;
            state.tasks[status] = [...(state.tasks[status] || []), ...tasks];  // Default to an empty array if undefined
            saveToLocalStorage(ROOT_KEY, 'tasks', state.tasks);
        },
        resetTasks: (state) => {
            state.tasks = {};
            state.taskCounts = {};
            state.pagination = { limit: 5, offset: 0 };
            saveToLocalStorage(ROOT_KEY, 'tasks', state.tasks);
            saveToLocalStorage(ROOT_KEY, 'taskCounts', state.taskCounts);
            saveToLocalStorage(ROOT_KEY, 'pagination', state.pagination);
        },
    },
});

export const { setTasks, setTaskCounts, setPagination, addMoreTasks, updateTaskStatus, resetTasks } = taskSlice.actions;
export default taskSlice.reducer;
