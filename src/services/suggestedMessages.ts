import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const suggestedMessageApi = createApi({
  reducerPath: "suggestedMessageApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}` }),
  tagTypes: ["Message"],
  endpoints: (builder) => ({
    getSuggestedMessages: builder.mutation({
      query: (data) => ({
        url: "/suggest-messages",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Message"],
    }),
  }),
});

export const { useGetSuggestedMessagesMutation } = suggestedMessageApi;
