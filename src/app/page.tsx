"use client";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetTopicsQuery } from "@/services/topic";
import Topic from "@/types/Topic";
import ErrorPage from "@/components/Error";
import AddTopic from "@/components/AddTopic";
import Link from "next/link";
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";
import StatusBadge from "@/components/StatusBadge";
import { formatRelativeTime } from "@/lib/date-utils";

export default function App() {
  const { status } = useSession();
  const { data, isLoading, isSuccess } = useGetTopicsQuery({});
  const result = data?.data[0]?.topics;

  if (status !== "authenticated") <ErrorPage />;

  return (
    <div className="py-6 px-6 md:px-20">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <AddTopic />
      </div>
      {isLoading ? (
        <DashboardSkeleton />
      ) : isSuccess ? (
        data?.data.length !== 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {result?.map((topic: Topic, index: number) => {
              return (
                <Link href={`/topic/${topic._id}`} key={index}>
                  <Card className="hover:shadow-lg transition-shadow h-full pb-0">
                    <CardHeader>
                      <div className="flex gap-4 justify-between items-start">
                        <CardTitle>{topic.title}</CardTitle>
                        <StatusBadge
                          topicId={topic._id?.toString() as string}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="text-muted-foreground line-clamp-2 h-full">
                      {topic.description}
                    </CardContent>
                    <div className="bg-accent rounded-b-xl">
                      <p className="text-muted-foreground text-sm text-right py-0.5 px-3">
                        {formatRelativeTime(topic?.createdAt || "")}
                      </p>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <h1>No topics found.</h1>
          </div>
        )
      ) : (
        <ErrorPage />
      )}
    </div>
  );
}
