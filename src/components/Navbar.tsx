"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  GalleryVerticalEnd,
  CircleUser,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";

export default function Navbar(props: {
  name: string;
  image: string;
  email: string;
}) {
  return (
    <nav className="w-full py-4 px-8 flex items-center justify-between border-2 border-accent">
      <Link href="/">
        <div className="flex gap-2 items-center">
          <GalleryVerticalEnd className="size-6" />
          <div className="hidden text-2xl font-bold font-mono md:block">
            Unknown Message
          </div>
        </div>
      </Link>
      <div className="flex gap-2 items-center">
        <h1 className="hidden md:block font-bold">{props?.name}</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage src={props?.image} alt="Image" />
              <AvatarFallback>
                <CircleUser />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-fit p-4 my-5 mx-2" align="start">
            <DropdownMenuGroup>
              <DropdownMenuItem className="flex gap-4">
                <Avatar>
                  <AvatarImage src={props?.image} alt="Image" />
                  <AvatarFallback>
                    <CircleUser />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="font-bold">{props?.name}</h1>
                  <p className="text-muted-foreground">{props?.email}</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link className="font-bold" href="/">
                <DropdownMenuItem>
                  <LayoutDashboard />
                  <h1>Dashboard</h1>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                className="font-bold"
                onSelect={() => signOut()}
              >
                <LogOut />
                <h1>Sign out</h1>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
