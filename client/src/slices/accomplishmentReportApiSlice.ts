import { AR_URL } from '@/constants/constants'
import { apiSlice } from './apiSlice'

export const accomplishmentReportApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAccomplishmentReports: builder.query({
            query: (params: string) => ({
                url: `${AR_URL}${params ? `?${params}` : ''}`,
            }),
        }),
        getAccomplishmentReportsPerUser: builder.query({
            query: (id: string) => ({
                url: `${AR_URL}/per-user${id ? `?user=${id}` : ''}`,
            }),
        }),
        getAccomplishmentReportById: builder.query({
            query: (id: string) => ({
                url: `${AR_URL}/${id}`,
            }),
        }),
        storeAccomplishmentReport: builder.mutation({
            query: (body: FormData) => ({
                url: `${AR_URL}`,
                method: 'POST',
                body,
            }),
        }),
        notifyUser: builder.mutation({
            query: (data) => ({
                url: `${AR_URL}/notify/${data.userId}`,
                method: 'PUT',
                body: data,
            }),
        }),
        getPendingAR: builder.query({
            query: (params: string) => ({
                url: `${AR_URL}/pending${params ? `?${params}` : ''}`,
            }),
        }),
    }),
})

export const {
    useGetAccomplishmentReportsQuery,
    useGetAccomplishmentReportsPerUserQuery,
    useGetAccomplishmentReportByIdQuery,
    useStoreAccomplishmentReportMutation,
    useNotifyUserMutation,
    useGetPendingARQuery,
} = accomplishmentReportApiSlice
