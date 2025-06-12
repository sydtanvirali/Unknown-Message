import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const acceptingMessagesApi = createApi({
  reducerPath: "acceptingMessagesApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}` }),
  tagTypes: ["acceptingMessages"],
  endpoints: (builder) => ({
    getAcceptingMessages: builder.query({
      query: (id) => `/accept-messages/${id}`,
      providesTags: ["acceptingMessages"],
    }),
    setAcceptingMessages: builder.mutation({
      query: (data) => ({
        url: "/accept-messages",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["acceptingMessages"],
    }),
  }),
});

export const { useGetAcceptingMessagesQuery, useSetAcceptingMessagesMutation } =
  acceptingMessagesApi;
