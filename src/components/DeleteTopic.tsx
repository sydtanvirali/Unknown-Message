"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteTopicMutation } from "@/services/topic";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

export default function DeleteTopic({ topicId }: { topicId: string }) {
  const [deleteTopic] = useDeleteTopicMutation();
  const router = useRouter();
  const handleDelete = async () => {
    try {
      const res = await deleteTopic(topicId).unwrap();
      console.log(res);
      if (res.success) {
        toast.success(res.message || "Topic Deleted successfully");
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete topic");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            topic and all associated messages.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
