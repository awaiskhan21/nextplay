"use client";
import { signIn, signOut, useSession } from "next-auth/react";

import { MusicIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

function Appbar() {
  const session = useSession();
  return (
    <div className="flex flex-col bg-gray-950 text-gray-100 ">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b border-gray-800 py-10">
        <Link className="flex items-center justify-center" href="#">
          <MusicIcon className="h-6 w-6 text-purple-400" />
          <span className="ml-2 text-lg font-bold">NextPlay</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          {session.data?.user ? (
            <Button
              className="bg-purple-600 text-white hover:bg-purple-700 px-8 py-2 text-lg"
              onClick={() => signOut()}
            >
              Logout
            </Button>
          ) : (
            <Button
              className="bg-purple-600 text-white hover:bg-purple-700 px-8 py-2 text-lg"
              onClick={() => signIn()}
            >
              Sign In
            </Button>
          )}
        </nav>
      </header>
    </div>
  );
}

export default Appbar;
