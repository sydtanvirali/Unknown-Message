"use client";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  useGetAcceptingMessagesQuery,
  useSetAcceptingMessagesMutation,
} from "@/services/acceptingMessages";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { MessageCircle, MessageCircleOff } from "lucide-react";

export default function AcceptingMessage({ topicId }: { topicId: string }) {
  const [isAccepting, setIsAccepting] = useState(false);

  const { data, isLoading } = useGetAcceptingMessagesQuery(topicId);
  const [setAcceptingMessages, { isLoading: isUpdating }] =
    useSetAcceptingMessagesMutation();

  useEffect(() => {
    if (data?.data?.isAcceptingMessages !== undefined) {
      setIsAccepting(data.data.isAcceptingMessages);
    }
  }, [data?.data?.isAcceptingMessages]);

  const handleToggle = async (checked: boolean) => {
    try {
      const res = await setAcceptingMessages({
        topicId,
        acceptMessages: checked,
      }).unwrap();
      if (res.success) {
        toast.success(
          res?.message || "Message acceptance status updated successfully"
        );
        setIsAccepting(checked);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update message acceptance status");
      // Revert the switch if the update failed
      setIsAccepting(!checked);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {isAccepting ? (
          <MessageCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
        ) : (
          <MessageCircleOff className="w-5 h-5 text-red-600 dark:text-red-400" />
        )}
        <div className="flex flex-col">
          <Label
            htmlFor="isAccepting"
            className="font-semibold text-gray-900 dark:text-white cursor-pointer"
          >
            {isAccepting ? "Accepting Messages" : "Not Accepting Messages"}
          </Label>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {isAccepting
              ? "People can send you anonymous messages"
              : "New messages are currently disabled"}
          </span>
        </div>
      </div>
      <Switch
        id="isAccepting"
        disabled={isLoading || isUpdating}
        checked={isAccepting}
        onCheckedChange={handleToggle}
        className="data-[state=checked]:bg-green-600"
      />
    </div>
  );
}
