"use client";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  useGetAcceptingMessagesQuery,
  useSetAcceptingMessagesMutation,
} from "@/services/acceptingMessages";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function AcceptingMessage({ topicId }: { topicId: string }) {
  const [isAccepting, setIsAccepting] = useState(false);

  const { data, isLoading } = useGetAcceptingMessagesQuery(topicId);
  const [setAcceptingMessages] = useSetAcceptingMessagesMutation();

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
      }
      setIsAccepting(checked);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update message acceptance status");
    }
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <Switch
        id="isAccepting"
        disabled={isLoading}
        checked={isAccepting}
        onCheckedChange={handleToggle}
      />
      <Label htmlFor="isAccepting" className="font-bold">
        Accepting Messages
      </Label>
    </div>
  );
}
