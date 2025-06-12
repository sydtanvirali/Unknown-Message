"use client";
import ErrorPage from "@/components/Error";
import TopicSkeleton from "@/components/skeletons/TopicSkeletons";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSendMessageMutation } from "@/services/message";
import { useGetSuggestedMessagesMutation } from "@/services/suggestedMessages";
import { useGetTopicByIdQuery } from "@/services/topic";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function MessagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);

  const { data, isLoading, isSuccess } = useGetTopicByIdQuery(id);
  const [getSuggestedMessages, { isLoading: suggestedMessagesLoading }] =
    useGetSuggestedMessagesMutation();
  const [sendMessage] = useSendMessageMutation();

  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    if (isSuccess && data?.data?._id) {
      getSuggestedMessages({
        topic: data.data.title,
        description: data.data.description,
      })
        .unwrap()
        .then((res) => {
          if (res.success) {
            setSuggestedMessages(res.data);
          }
        })
        .catch((error) => {
          console.log("Failed to fetch suggestions:", error);
          toast.error("Failed to fetch AI suggestions.");
        });
    }
  }, [
    isSuccess,
    data?.data?._id,
    data?.data?.title,
    data?.data?.description,
    getSuggestedMessages,
  ]);

  const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const res = await sendMessage({
        topicId: id,
        content: messageInput,
      }).unwrap();

      if (res.success) {
        toast.success(res.message || "Message sent successfully!");
      } else {
        toast.error(res.message || "Message failed to send.");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Something wents wrong.");
    }
  };

  return (
    <div className="py-12 px-6 md:px-20">
      {isLoading ? (
        <TopicSkeleton />
      ) : isSuccess ? (
        <>
          <div className="flex flex-col gap-10 mb-6">
            <div className="mx-auto md:mx-20 flex flex-col items-center gap-2">
              <h1 className="text-3xl font-bold text-center">
                {data?.data.title}
              </h1>
              <p className="text-muted-foreground text-center">
                {data?.data.description}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4 justify-center items-center my-20 md:m-20">
            <h2 className="font-semibold">AI Suggestions</h2>
            <div className="flex-grow">
              {suggestedMessagesLoading ? (
                <Label className="rounded-full m-1 border border-accent p-3 cursor-pointer hover:bg-accent hover:text-primary transition-colors">
                  Loading suggestions...
                </Label>
              ) : (
                suggestedMessages.map((msg, index) => (
                  <Label
                    key={index}
                    className="rounded-full m-1 border border-accent p-3 cursor-pointer hover:bg-accent hover:text-primary transition-colors w-fit"
                    onClick={() => setMessageInput(msg)}
                  >
                    {msg}
                  </Label>
                ))
              )}
            </div>
          </div>

          <form onSubmit={handleSendMessage} className="grid gap-2 md:m-20">
            <Textarea
              className="h-30"
              placeholder="Type your message here."
              maxLength={300}
              name="message"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              required
            />
            <p className="text-muted-foreground text-sm">
              Message must be 300 characters or less.
            </p>
            <Button type="submit" className="w-full">
              Send message
            </Button>
          </form>
        </>
      ) : (
        <ErrorPage />
      )}
    </div>
  );
}
