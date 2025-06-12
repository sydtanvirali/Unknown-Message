"use client";
import { useGetAcceptingMessagesQuery } from "@/services/acceptingMessages";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

export default function StatusBadge({ topicId }: { topicId: string }) {
  const { data, isLoading } = useGetAcceptingMessagesQuery(topicId);

  if (isLoading) {
    return (
      <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
    );
  }

  return data?.data?.isAcceptingMessages ? (
    <Badge className="bg-green-100 hover:bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800 rounded-full font-medium flex items-center gap-1">
      <CheckCircle className="w-3 h-3" />
      Active
    </Badge>
  ) : (
    <Badge className="bg-red-100 hover:bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800 rounded-full font-medium flex items-center gap-1">
      <XCircle className="w-3 h-3" />
      Inactive
    </Badge>
  );
}