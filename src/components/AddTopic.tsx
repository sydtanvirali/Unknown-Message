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
import { Loader2Icon } from "lucide-react";

export default function AddTopic() {
  const [addTopic, { isLoading }] = useAddTopicMutation();
  const [open, setOpen] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    try {
      const res = await addTopic({ title, description }).unwrap();

      if (res.success) {
        toast.success(res.message || "Topic added successfully");
      }
      // Reset form and close dialog
      (event.target as HTMLFormElement).reset();
      setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error(`Something went wrong.`);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Topic</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader className="pb-4">
            <DialogTitle>Add New Topic</DialogTitle>
            <DialogDescription>
              Create a new topic by entering a title and description. Click save
              when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label>Title</Label>
              <Input id="title" name="title" maxLength={50} required />
            </div>
            <div className="grid gap-3">
              <Label>Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Type here..."
                maxLength={300}
                required
              />
              <p className="text-muted-foreground text-sm">
                Description must be 300 characters or less.
              </p>
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button type="submit" className="w-30" disabled={isLoading}>
              {isLoading ? <Loader2Icon /> : "Save Topic"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
