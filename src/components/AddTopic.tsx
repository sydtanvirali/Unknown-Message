"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useAddTopicMutation } from "@/services/topic";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2Icon, Plus } from "lucide-react";

export default function AddTopic({ children }: { children?: React.ReactNode }) {
  const [addTopic, { isLoading }] = useAddTopicMutation();
  const [open, setOpen] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const res = await addTopic({ 
        title: title.trim(), 
        description: description.trim() 
      }).unwrap();

      if (res.success) {
        toast.success(res.message || "Topic created successfully");
        (event.target as HTMLFormElement).reset();
        setOpen(false);
      }
    } catch (error: any) {
      console.log(error);
      if (error?.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error("Something went wrong.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Topic
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl font-semibold">Create New Topic</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300">
              Create a topic to receive anonymous messages. Share the link with anyone to collect feedback, opinions, or suggestions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Topic Title
              </Label>
              <Input 
                id="title" 
                name="title" 
                placeholder="Enter a descriptive title..."
                maxLength={100} 
                required 
                className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Maximum 100 characters
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe what kind of feedback or messages you're looking for..."
                maxLength={300}
                required
                className="min-h-[100px] resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Maximum 300 characters
              </p>
            </div>
          </div>
          <DialogFooter className="pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isLoading}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2Icon className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Create Topic
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}