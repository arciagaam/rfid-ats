import { USERS_URL } from '@/constants/constants'
import { apiSlice } from '@/slices/apiSlice'

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data: object) => ({
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
            query: (params:string) => ({
                url: `${USERS_URL}${params ? (`?${params}`) : ''}`,
            }),
            providesTags: ['User'],
            keepUnusedDataFor: 5,
        }),
        register: builder.mutation({
            query: (data: object) => ({
                url: `${USERS_URL}`,
                method: 'POST',
                body: data,
            }),
        }),
        getUser: builder.query({
            query: (data: string | number) => ({
                url: `${USERS_URL}/${data}`,
            }),
        }),
        getUserLogs: builder.query({
            query: (data: string) => ({
                url: `${USERS_URL}/logs/${data}`,
            }),
        }),
        updateUserByID: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/${data.userId}`,
                method: 'PUT',
                body: data,
            }),
        }),
        deleteUser: builder.mutation({
            query: (userId: string | number) => ({
                url: `${USERS_URL}/${userId}`,
                method: 'DELETE',
            }),
        }),
    }),
})


export const {
    useLoginMutation,
    useLogoutMutation,
    useGetUsersQuery,
    useRegisterMutation,
    useGetUserQuery,
    useGetUserLogsQuery,
    useUpdateUserByIDMutation,
    useDeleteUserMutation,
} = usersApiSlice
