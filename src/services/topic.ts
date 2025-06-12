import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const topicApi = createApi({
  reducerPath: "topicApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}` }),
  tagTypes: ["Topic"],
  endpoints: (builder) => ({
    getTopics: builder.query({
      query: () => "/topic",
      providesTags: ["Topic"],
    }),
    getTopicById: builder.query({
      query: (id) => `/topic/${id}`,
      providesTags: ["Topic"],
    }),
    addTopic: builder.mutation({
      query: (data) => ({
        url: "/topic",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Topic"],
    }),
    deleteTopic: builder.mutation({
      query: (id) => ({
        url: `/topic/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Topic"],
    }),
  }),
});

export const {
  useGetTopicsQuery,
  useGetTopicByIdQuery,
  useAddTopicMutation,
  useDeleteTopicMutation,
} = topicApi;
