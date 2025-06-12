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

  const result = mData?.data[0]?.messages;

  if (isError) <ErrorPage />;

  return (
    <div className="py-6 px-6 md:px-20">
      <div className="flex flex-col gap-10 mb-6">
        {isLoading ? (
          <TopicSkeleton />
        ) : (
          isSuccess && (
            <>
              <div className="mx-auto md:mx-20 flex flex-col items-center gap-2">
                <h1 className="text-3xl font-bold text-center">
                  {data?.data.title}
                </h1>
                <p className="text-muted-foreground text-center">
                  {data?.data.description}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <AcceptingMessage topicId={data?.data._id} />
                <div className="flex gap-2">
                  <ShareTopic topicId={data?.data._id} />
                  <DeleteTopic topicId={data?.data._id} />
                </div>
              </div>
            </>
          )
        )}
      </div>

      {mLoading ? (
        <MessageSkeleton />
      ) : isSuccess ? (
        mData?.data.length !== 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-8">
            {mSuccess &&
              result?.map((message: Message, index: number) => (
                <Popover key={index}>
                  <PopoverTrigger asChild>
                    <Card className="hover:shadow-lg transition-shadow h-full pb-0">
                      <CardContent className="line-clamp-3 h-full">
                        {message?.content}
                      </CardContent>
                      <div className="bg-accent rounded-b-xl">
                        <p className="text-muted-foreground text-sm text-right py-0.5 px-3">
                          {formatRelativeTime(message?.createdAt || "")}
                        </p>
                      </div>
                    </Card>
                  </PopoverTrigger>
                  <PopoverContent>{message?.content}</PopoverContent>
                </Popover>
              ))}
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <h1>No messages found</h1>
          </div>
        )
      ) : (
        <ErrorPage />
      )}
    </div>
  );
}
