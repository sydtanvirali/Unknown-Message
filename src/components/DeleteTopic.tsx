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
import { Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function DeleteTopic({
  topicId,
  children,
}: {
  topicId: string;
  children?: React.ReactNode;
}) {
  const [deleteTopic, { isLoading }] = useDeleteTopicMutation();
  const router = useRouter();
  const handleDelete = async () => {
    try {
      const res = await deleteTopic(topicId).unwrap();
      if (res.success) {
        toast.success(res.message || "Topic deleted successfully");
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
        {children || (
          <Button
            variant="destructive"
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <AlertDialogTitle className="text-xl">
              Delete Topic
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Are you absolutely sure you want to delete this topic? This action
            cannot be undone and will permanently delete:
            <ul className="mt-3 space-y-1 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                The topic and its description
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                All associated anonymous messages
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                The shareable link (it will no longer work)
              </li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="font-medium">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white font-medium"
          >
            {isLoading ? "Deleting..." : "Delete Topic"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
