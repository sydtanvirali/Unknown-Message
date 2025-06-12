"use client";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import { NavSkeleton } from "./skeletons/NavSkeleton";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session, status } = useSession();
  return (
    <>
      {status === "loading" ? (
        <NavSkeleton />
      ) : (
        status === "authenticated" && (
          <Navbar
            name={session?.user?.name as string}
            image={session?.user?.image as string}
            email={session?.user?.email as string}
          />
        )
      )}

      {children}
    </>
  );
}
