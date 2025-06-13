"use client";
import ErrorPage from "@/components/Error";
import TopicSkeleton from "@/components/skeletons/TopicSkeletons";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSendMessageMutation } from "@/services/message";
import { useGetSuggestedMessagesMutation } from "@/services/suggestedMessages";
import { useGetTopicByIdPublicQuery } from "@/services/topic";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { MessageCircle, Send, Sparkles, CheckCircle } from "lucide-react";

export default function MessagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);

  const { data, isLoading, isSuccess, isError } =
    useGetTopicByIdPublicQuery(id);
  const [getSuggestedMessages, { isLoading: suggestedMessagesLoading }] =
    useGetSuggestedMessagesMutation();
  const [sendMessage, { isLoading: sendingMessage }] = useSendMessageMutation();

  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [messageSent, setMessageSent] = useState(false);

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
    if (!messageInput.trim()) {
      toast.error("Please enter a message");
      return;
    }

    try {
      const res = await sendMessage({
        topicId: id,
        content: messageInput.trim(),
      }).unwrap();

      if (res.success) {
        toast.success(res.message || "Message sent successfully!");
        setMessageInput("");
        setMessageSent(true);
      } else {
        toast.error(res.message || "Message failed to send.");
      }
    } catch (error: any) {
      console.error("Failed to send message:", error);
      toast.error("Something went wrong.");
    }
  };

  if (isError) {
    return <ErrorPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        {isLoading ? (
          <div className="space-y-8">
            <TopicSkeleton />
            <div className="grid gap-4">
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
          </div>
        ) : isSuccess ? (
          <>
            {/* Header Section */}
            <div className="text-center mb-12 space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                <MessageCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                {data?.data.title}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                {data?.data.description}
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Anonymous messaging enabled
              </div>
            </div>

            {messageSent ? (
              /* Success State */
              <Card className="max-w-md mx-auto text-center border-green-200 dark:border-green-800">
                <CardContent className="pt-8 pb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Your anonymous message has been delivered successfully.
                  </p>
                  <Button
                    onClick={() => setMessageSent(false)}
                    variant="outline"
                    className="w-full"
                  >
                    Send Another Message
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-8">
                {/* AI Suggestions */}
                {suggestedMessages.length > 0 && (
                  <Card className="border-purple-200 dark:border-purple-800">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                        <Sparkles className="w-5 h-5" />
                        AI Suggestions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {suggestedMessagesLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                          <span className="ml-3 text-gray-600 dark:text-gray-300">
                            Generating suggestions...
                          </span>
                        </div>
                      ) : (
                        <div className="grid gap-3">
                          {suggestedMessages.map((msg, index) => (
                            <button
                              key={index}
                              onClick={() => setMessageInput(msg)}
                              className="text-left p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 group"
                            >
                              <p className="text-gray-700 dark:text-gray-300 group-hover:text-purple-700 dark:group-hover:text-purple-300">
                                {msg}
                              </p>
                            </button>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Message Form */}
                <Card className="border-blue-200 dark:border-blue-800">
                  <CardHeader>
                    <CardTitle className="text-blue-700 dark:text-blue-300">
                      Send Your Message
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSendMessage} className="space-y-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="message"
                          className="text-sm font-medium"
                        >
                          Your anonymous message
                        </Label>
                        <Textarea
                          id="message"
                          placeholder="Share your thoughts, feedback, or questions anonymously..."
                          maxLength={300}
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          required
                          className="min-h-[120px] resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500 dark:text-gray-400">
                            Message must be between 10-300 characters
                          </span>
                          <span
                            className={`font-medium ${
                              messageInput.length > 300
                                ? "text-red-500"
                                : messageInput.length > 250
                                ? "text-yellow-500"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            {messageInput.length}/300
                          </span>
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                        disabled={
                          sendingMessage ||
                          messageInput.length < 10 ||
                          messageInput.length > 300
                        }
                      >
                        {sendingMessage ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Privacy Notice */}
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    🔒 Your message is completely anonymous. No personal
                    information is collected or stored.
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          <ErrorPage />
        )}
      </div>
    </div>
  );
}
