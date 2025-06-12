"use client";
import { signIn, useSession } from "next-auth/react";
import { GalleryVerticalEnd, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const { status } = useSession();

  const handleGoogleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn("google", { callbackUrl: "/" });
  };

  if (status === "authenticated") {
    // Redirect to home page if already authenticated
    window.location.href = "/";
    return null;
  }

  return (
    <div className="bg-background backdrop-blur flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <a href="#" className="flex items-center gap-2 self-center font-medium">
        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
          <GalleryVerticalEnd className="size-4" />
        </div>
        Unknown Message
      </a>

      <div className="text-center sm:mx-auto sm:w-10/12 lg:mr-auto lg:mt-0 lg:w-4/5">
        <h1 className="mt-8 text-3xl font-semibold md:text-5xl xl:text-5xl xl:[line-height:1.125]">
          Empower others to share thoughts,
          <br /> opinions, and experiences without revealing their identity.
        </h1>
        <p className="mx-auto mt-8 max-w-4xl text-wrap text-sm md:text-lg">
          A simple and secure web app where you can log in with Google, create
          discussion topics, and share them with anyone. People with your link
          can respond anonymously—whether it's feedback, opinions, experiences,
          or suggestions—without needing an account. Perfect for collecting
          honest thoughts, anywhere.
        </p>

        <div className="mt-8">
          <Button size="lg" onClick={handleGoogleSignIn}>
            <Rocket className="relative size-4" />
            <span className="text-nowrap">Login with Google</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
