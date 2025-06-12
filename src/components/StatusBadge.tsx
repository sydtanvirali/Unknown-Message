"use client";
import { useGetAcceptingMessagesQuery } from "@/services/acceptingMessages";
import { Badge } from "@/components/ui/badge";

export default function StatusBadge({ topicId }: { topicId: string }) {
  const { data } = useGetAcceptingMessagesQuery(topicId);

  return data?.data.isAcceptingMessages ? (
    <Badge className="bg-green-500 rounded-full size-fit font-bold">
      Active
    </Badge>
  ) : (
    <Badge className="bg-red-500 rounded-full size-fit font-bold">
      Inactive
    </Badge>
  );
}
