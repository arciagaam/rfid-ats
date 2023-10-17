import { RFID_URL } from "@/constants/constants";
import { apiSlice } from "./apiSlice";

export const rfidApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getRfids: builder.query({
            query: () => ({
                url: `${RFID_URL}`,
            }),
        }),
        windowState: builder.mutation({
            query: (data: object) => ({
                url: `${RFID_URL}/window`,
                method: 'POST',
                body: data
            }),
        })
    } )
});

export const {
    useGetRfidsQuery,
    useWindowStateMutation
} = rfidApiSlice;