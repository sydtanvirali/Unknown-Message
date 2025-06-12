import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const messageApi = createApi({
  reducerPath: "messageApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}` }),
  tagTypes: ["Message"],
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: (id) => `/message/${id}`,
      providesTags: ["Message"],
    }),
    sendMessage: builder.mutation({
      query: (data) => ({
        url: "/message",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Message"],
    }),
  }),
});

export const { useGetMessagesQuery, useSendMessageMutation } = messageApi;
