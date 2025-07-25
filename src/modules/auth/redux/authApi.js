import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl,
        prepareHeaders: (headers, { getState }) => {
            // Get the token from the auth state
            const token = getState().auth.tokens?.access_token;

            // If we have a token, add it to the headers
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login/',
                method: 'POST',
                body: credentials,
            }),
        }),
        resetPassword: builder.mutation({
            query: ({ password }) => ({
                url: `/auth/change-password/`,  // updated URL without userId
                method: 'POST',
                body: { password },
            }),
        }),
    }),
});

export const { useLoginMutation ,useResetPasswordMutation } = authApi;
export const { middleware } = authApi;