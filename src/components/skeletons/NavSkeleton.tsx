"use client";
import { Skeleton } from "@/components/ui/skeleton";

export function NavSkeleton() {
  return (
    <nav className="w-full py-4 px-8 flex items-center justify-between border-2 border-accent">
      <div className="flex gap-2 items-center">
        <Skeleton className="h-6 w-6 rounded" />
        <Skeleton className="hidden h-6 w-40 md:block" />
      </div>

      <div className="flex gap-2 items-center">
        <Skeleton className="hidden h-6 w-24 md:block" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </nav>
  );
}
