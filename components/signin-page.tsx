"use client";

import { Button } from "@/components/ui/button";
import { MusicIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export function SigninPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-gray-100">
      <header className="w-full px-4 lg:px-6 h-16 flex items-center justify-center border-b border-gray-800">
        <Link className="flex items-center justify-center" href="/">
          <MusicIcon className="h-6 w-6 text-purple-400" />
          <span className="ml-2 text-lg font-bold">NextPlay</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Sign in to NextPlay</h1>
            <p className="mt-2 text-gray-400">
              Start collaborating with your fans on the perfect stream
              soundtrack
            </p>
          </div>
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full bg-white text-gray-900 hover:bg-gray-100 py-6 text-lg font-semibold"
              onClick={async () => {
                try {
                  await signIn("google", { callbackUrl: "/dashboard" });
                } catch (error) {
                  console.error("Sign-in error:", error);
                }
              }}
            >
              <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </Button>
          </div>
          <p className="text-center text-sm text-gray-400">
            By signing in, you agree to our{" "}
            <Link
              href="/terms"
              className="text-purple-400 hover:text-purple-300"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-purple-400 hover:text-purple-300"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </main>
      <footer className="w-full py-4 px-4 md:px-6 border-t border-gray-800">
        <div className="container mx-auto max-w-5xl flex justify-center items-center">
          <p className="text-sm text-gray-500">
            © 2024 NextPlay. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
