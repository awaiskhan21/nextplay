"use client";
import { signIn, signOut, useSession } from "next-auth/react";

function Appbar() {
  const session = useSession();
  console.log(JSON.stringify(session?.data?.user));
  return (
    <div className="flex justify-between">
      <div>NextPlay </div>
      <div>
        {session.data?.user ? (
          <button className="bg-blue-500" onClick={() => signOut()}>
            Logout
          </button>
        ) : (
          <button className="bg-blue-500" onClick={() => signIn()}>
            Sign In
          </button>
        )}
      </div>
    </div>
  );
}

export default Appbar;
