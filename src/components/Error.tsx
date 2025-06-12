"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

const ErrorPage = () => {
  const router = useRouter();

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full mb-6">
          <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Oops!
        </h1>
        
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Something went wrong
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          We encountered an unexpected error. This could be a temporary issue with our servers or your connection.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={handleRefresh}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
          
          <Button 
            onClick={() => router.push("/")}
            variant="outline"
            className="font-medium px-6 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Button>
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-8">
          If the problem persists, please try refreshing the page or contact support.
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;