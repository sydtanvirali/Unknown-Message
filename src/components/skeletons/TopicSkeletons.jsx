"use client";
import { Skeleton } from "@/components/ui/skeleton";

export default function TopicSkeleton() {
  return (
    <div className="mx-auto md:mx-20 flex flex-col items-center gap-4">
      <Skeleton className="w-lg h-8"></Skeleton>
      <div className="space-y-2">
        <Skeleton className="w-5xl h-4"></Skeleton>
        <Skeleton className="w-5xl h-4"></Skeleton>
      </div>
    </div>
  );
}
