"use client";
import { useGetTopicByIdQuery } from "@/services/topic";
import { useGetMessagesQuery } from "@/services/message";
import { Card, CardContent } from "@/components/ui/card";
import Message from "@/types/Message";
import DeleteTopic from "@/components/DeleteTopic";
import AcceptingMessage from "@/components/AcceptingMessage";
import ShareTopic from "@/components/ShareTopic";
import TopicSkeleton from "@/components/skeletons/TopicSkeletons";
import ErrorPage from "@/components/Error";
import MessageSkeleton from "@/components/skeletons/MessageSkeleton";
import { formatRelativeTime } from "@/lib/date-utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MessageSquare, Calendar, Share, Trash2 } from "lucide-react";
import React from "react";

export default function MessagesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const { data, isLoading, isSuccess, isError } = useGetTopicByIdQuery(id);
  const {
    data: mData,
    isLoading: mLoading,
    isSuccess: mSuccess,
  } = useGetMessagesQuery(id);

  const result = mData?.data[0]?.messages || [];

  if (isError) return <ErrorPage />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8 space-y-6">
          {isLoading ? (
            <TopicSkeleton />
          ) : (
            isSuccess && (
              <>
                {/* Topic Info */}
                <div className="text-center max-w-4xl mx-auto space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                    <MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                    {data?.data.title}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    {data?.data.description}
                  </p>
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <AcceptingMessage topicId={data?.data._id} />
                  <div className="flex gap-3">
                    <ShareTopic topicId={data?.data._id}>
                      <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200">
                        <Share className="w-4 h-4" />
                        Share
                      </button>
                    </ShareTopic>
                    <DeleteTopic topicId={data?.data._id}>
                      <button className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200">
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </DeleteTopic>
                  </div>
                </div>
              </>
            )
          )}
        </div>

        {/* Messages Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Messages
            </h2>
            {result.length > 0 && (
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                {result.length} message{result.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {mLoading ? (
            <MessageSkeleton />
          ) : isSuccess ? (
            result.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mSuccess &&
                  result.map((message: Message, index: number) => (
                    <Popover key={index}>
                      <PopoverTrigger asChild>
                        <Card className="h-full transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden group">
                          <CardContent className="p-6">
                            <p className="text-gray-700 dark:text-gray-300 line-clamp-4 leading-relaxed mb-4 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                              {message?.content}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <Calendar className="w-3 h-3" />
                              <span>{formatRelativeTime(message?.createdAt || "")}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-4">
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            Full Message
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {message?.content}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                            <Calendar className="w-3 h-3" />
                            <span>Received {formatRelativeTime(message?.createdAt || "")}</span>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  ))}
              </div>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="text-center max-w-md">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-6">
                    <MessageSquare className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No messages yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Share your topic link to start receiving anonymous messages.
                  </p>
                  <ShareTopic topicId={data?.data._id}>
                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200">
                      <Share className="w-4 h-4" />
                      Share Topic
                    </button>
                  </ShareTopic>
                </div>
              </div>
            )
          ) : (
            <ErrorPage />
          )}
        </div>
      </div>
    </div>
  );
}