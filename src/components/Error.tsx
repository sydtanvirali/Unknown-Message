"use client";
import { Button } from "@/components/ui/button"; // Adjust import path as needed
import { useRouter } from "next/navigation";

const ErrorPage = () => {
  const navigate = useRouter();

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-background text-foreground p-20">
      <h1 className="text-4xl md:text-6xl font-bold text-destructive mb-4">
        Oops!
      </h1>
      <p className="md:text-xl text-muted-foreground mb-6">
        Something went wrong. Please try again.
      </p>
      <Button onClick={() => navigate.push("/")}>Go to Home</Button>
    </div>
  );
};

export default ErrorPage;
