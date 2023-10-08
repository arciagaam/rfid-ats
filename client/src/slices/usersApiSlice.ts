import { BASE_URL, USERS_URL } from '@/constants/constants'
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
        getUser: builder.query({
            query: () => ({
                url: `${BASE_URL}/1`
            })
        })
    }),
})

export const { useLoginMutation, useLogoutMutation, useGetUsersQuery, useGetUserQuery } = usersApiSlice
