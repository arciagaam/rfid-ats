import { RFID_URL } from "@/constants/constants";
import { apiSlice } from "./apiSlice";

export const rfidApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getRfids: builder.query({
            query: () => ({
                url: `${RFID_URL}`,
            }),
        })
    } )
});

export const {
    useGetRfidsQuery
} = rfidApiSlice;