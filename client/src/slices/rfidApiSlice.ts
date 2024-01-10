import { RFID_URL } from '@/constants/constants'
import { apiSlice } from './apiSlice'

export const rfidApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getRfids: builder.query({
            query: () => ({
                url: `${RFID_URL}`,
            }),
            providesTags: ['Rfid'],
            keepUnusedDataFor: 5,
        }),
        windowState: builder.mutation({
            query: (data: object) => ({
                url: `${RFID_URL}/window`,
                method: 'POST',
                body: data,
            }),
        }),
        assignRfidToUser: builder.mutation({
            query: (data: object) => ({
                url: `${RFID_URL}/assign`,
                method: 'PUT',
                body: data,
            }),
        }),
        deleteRfid: builder.mutation({
            query: (rfidId: string) => ({
                url: `${RFID_URL}/${rfidId}`,
                method: 'DELETE',
            }),
        }),
    }),
})

export const {
    useGetRfidsQuery,
    useWindowStateMutation,
    useAssignRfidToUserMutation,
    useDeleteRfidMutation,
} = rfidApiSlice
