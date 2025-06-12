"use client";
import { Skeleton } from "@/components/ui/skeleton";

export default function TopicSkeleton() {
  return (
    <div className="text-center max-w-4xl mx-auto space-y-4">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mb-4">
        <Skeleton className="w-8 h-8 rounded" />
      </div>
      <Skeleton className="h-8 w-80 mx-auto" />
      <div className="space-y-2 max-w-2xl mx-auto">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4 mx-auto" />
      </div>
    </div>
  );
}