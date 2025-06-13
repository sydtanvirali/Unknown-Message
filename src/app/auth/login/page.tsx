"use client";
import { signIn, useSession } from "next-auth/react";
import {
  GalleryVerticalEnd,
  Rocket,
  MessageSquare,
  Shield,
  Users,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleGoogleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn("google", { callbackUrl: "/" });
    setLoading(false);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (status === "authenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 md:py-16 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl">
              <GalleryVerticalEnd className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Unknown Message
            </h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                Empower others to share thoughts,{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  anonymously
                </span>
              </h2>

              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                A simple and secure platform where you can create discussion
                topics and receive honest, anonymous feedback from anyone with
                your link.
              </p>
            </div>

            {/* CTA */}
            <div className="pt-4">
              <Button
                size="lg"
                onClick={handleGoogleSignIn}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-4 rounded-lg transition-colors duration-200 flex items-center gap-3 text-lg"
              >
                {loading ? (
                  <Loader2 className="animate-spin size-4" />
                ) : (
                  <Rocket className="relative size-4" />
                )}
                <span className="text-nowrap">
                  {loading ? "Logging in..." : " Get Started with Google"}
                </span>
              </Button>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                Free to use • No credit card required
              </p>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="grid gap-4">
            <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex-shrink-0">
                <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Anonymous Messaging
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Receive honest feedback without revealing sender identity
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex-shrink-0">
                <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Secure & Private
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  No personal data collected from message senders
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex-shrink-0">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Easy Sharing
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Share your topic link anywhere - no signup required for
                  senders
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
