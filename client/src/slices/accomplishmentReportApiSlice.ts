import { AR_URL } from "@/constants/constants";
import { apiSlice } from "./apiSlice";

export const accomplishmentReportApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAccomplishmentReports: builder.query({
            query: (params: string) => ({
                url: `${AR_URL}${params ? (`?${params}`) : ''}`
            }),
        }),
        storeAccomplishmentReport: builder.mutation({
            query: (data: object) => ({
                url: `${AR_URL}`,
                method: 'POST',
                body: data
            }),
        }),
    })
})

export const {
    useGetAccomplishmentReportsQuery,
    useStoreAccomplishmentReportMutation
} = accomplishmentReportApiSlice;