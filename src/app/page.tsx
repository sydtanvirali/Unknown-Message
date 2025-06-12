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
import { MessageSquare, Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function App() {
  const { status } = useSession();
  const { data, isLoading, isSuccess, isError } = useGetTopicsQuery({});
  const result = data?.data[0]?.topics;

  if (status !== "authenticated") return <ErrorPage />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Manage your topics and view anonymous messages
              </p>
            </div>
            <AddTopic />
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <DashboardSkeleton />
        ) : isError ? (
          <ErrorPage />
        ) : isSuccess ? (
          data?.data.length !== 0 && result?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {result?.map((topic: Topic, index: number) => (
                <Link href={`/topic/${topic._id}`} key={index} className="group">
                  <Card className="h-full transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {topic.title}
                        </CardTitle>
                        <StatusBadge topicId={topic._id?.toString() as string} />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4 leading-relaxed">
                        {topic.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatRelativeTime(topic?.createdAt || "")}</span>
                        </div>
                        <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                          <MessageSquare className="w-3 h-3" />
                          <span className="font-medium">View</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="text-center max-w-md">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-6">
                  <MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No topics yet
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Create your first topic to start receiving anonymous messages from others.
                </p>
                <AddTopic>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Create Your First Topic
                  </Button>
                </AddTopic>
              </div>
            </div>
          )
        ) : (
          <ErrorPage />
        )}
      </div>
    </div>
  );
}