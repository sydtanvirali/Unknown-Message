"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef, useState } from "react";
import { Copy, Check, Share, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function ShareTopic({
  topicId,
  children,
}: {
  topicId: string;
  children?: React.ReactNode;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const shareUrl = `${baseUrl}/send-message/${topicId}`;

  const handleCopy = async () => {
    const link = inputRef.current?.value;
    if (link) {
      try {
        await navigator.clipboard.writeText(link);
        setCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.log(error);
        toast.error("Failed to copy link");
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Send me an anonymous message",
          text: "Share your thoughts with me anonymously",
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled sharing or error occurred
        console.log(error);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2">
            <Share className="w-4 h-4" />
            Share
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex gap-2">
            <Share className="w-5 h-5 text-blue-600" />
            Share Your Topic
          </DialogTitle>
          <DialogDescription className="text-left">
            Share this link with anyone to receive anonymous messages. They
            don&#39;t need to create an account.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="link" className="text-sm font-medium">
              Topic Link
            </Label>
            <div className="flex gap-2">
              <Input
                id="link"
                ref={inputRef}
                defaultValue={shareUrl}
                readOnly
                className="flex-1 bg-gray-50 dark:bg-gray-800"
              />
              <Button
                type="button"
                size="sm"
                onClick={handleCopy}
                className="px-3"
                variant="outline"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <ExternalLink className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  How it works
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                  Anyone with this link can send you anonymous messages without
                  creating an account. Perfect for collecting honest feedback!
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
            >
              Close
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleShare}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
          >
            {"share" in navigator ? (
              <>
                <Share className="w-4 h-4 mr-2" />
                Share Link
              </>
            ) : (
              <>
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </>
                )}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
