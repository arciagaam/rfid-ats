import { AR_URL } from "@/constants/constants";
import { apiSlice } from "./apiSlice";

export const accomplishmentReportApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAccomplishmentReports: builder.query({
            query: (params: string) => ({
                url: `${AR_URL}${params ? (`?${params}`) : ''}`
            }),
        }),
        getAccomplishmentReportsPerUser: builder.query({
            query: () => ({
                url: `${AR_URL}/per-user`
            })
        }),
        getAccomplishmentReportById: builder.query({
            query: (id: string) => ({
                url: `${AR_URL}/${id}`
            })
        }),
        storeAccomplishmentReport: builder.mutation({
            query: (body: FormData) => ({
                url: `${AR_URL}`,
                method: 'POST',
                body,
            }),
        }),
    })
})

export const {
    useGetAccomplishmentReportsQuery,
    useGetAccomplishmentReportsPerUserQuery,
    useGetAccomplishmentReportByIdQuery,
    useStoreAccomplishmentReportMutation
} = accomplishmentReportApiSlice;