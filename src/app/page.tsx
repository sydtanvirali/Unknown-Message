"use client";
import { signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  console.log(session);
  if (status === "authenticated") {
    return (
      <div>
        <h1>Welcome, {session.user?.name}</h1>
        <p>Email: {session.user?.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }
  return (
    <div>
      <h1>Home Unprotected</h1>
    </div>
  );
}
