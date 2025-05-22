import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: JSON.parse(localStorage.getItem('user')) || null,
        tokens: JSON.parse(localStorage.getItem('tokens')) || null,
        permissions: []
    },
    reducers: {
        setCredentials: (state, { payload }) => {
            state.tokens = payload.data.tokens;
            state.user = payload.data.user;
            localStorage.setItem('tokens', JSON.stringify(state.tokens));
            localStorage.setItem('user', JSON.stringify(state.user));
        },
        setPermissions: (state, { payload }) => {
            state.permissions = payload && Array.isArray(payload) ? payload : [];
        },
        logout: (state) => {
            state.tokens = null;
            state.user = null;
            state.permissions = [];
            localStorage.removeItem('tokens');
            localStorage.removeItem('user');
        },
        updateUser: (state, { payload }) => {
            if (state.user) {
                state.user = { ...state.user, ...payload };
                localStorage.setItem('user', JSON.stringify(state.user));
            }
        },
    },
});

export const { setCredentials, setPermissions, logout ,updateUser} = authSlice.actions;
export default authSlice.reducer;
