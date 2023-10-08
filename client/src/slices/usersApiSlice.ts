import { USERS_URL } from '@/constants/constants'
import { apiSlice } from '@/slices/apiSlice'

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/auth`,
                method: 'POST',
                body: data,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: 'POST',
            }),
        }),
        getUsers: builder.query({
            query: () => ({
                url: `${USERS_URL}`,
            }),
            providesTags: ['User'],
            keepUnusedDataFor: 5,
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}`,
                method: 'POST',
                body: data,
            }),
        }),
    }),
})

export const { useLoginMutation, useLogoutMutation, useGetUsersQuery, useRegisterMutation } =
    usersApiSlice
