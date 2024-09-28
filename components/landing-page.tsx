"use client";
import { Button } from "@/components/ui/button";
import { HeartIcon, PlayCircleIcon, UsersIcon } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function LandingPageComponent() {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.data?.user) router.push("/dashboard");
  }, [session]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-gray-100">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex items-center justify-center">
          <div className="container px-4 md:px-6 max-w-3xl">
            <div className="flex flex-col items-center space-y-8 text-center">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Let Your Fans Choose the Beat
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-400 text-xl md:text-2xl">
                NextPlay: Where creators and fans collaborate on the perfect
                stream soundtrack.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  className="bg-purple-600 text-white hover:bg-purple-700 px-8 py-2 text-lg"
                  onClick={() => signIn()}
                >
                  Get Started
                </Button>
                <Button
                  variant="outline"
                  className="text-purple-400 border-purple-400 hover:bg-purple-400/10 px-8 py-2 text-lg"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
          <div className="container px-4 md:px-6 mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-12">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center text-center">
                <PlayCircleIcon className="h-16 w-16 mb-6 text-purple-400" />
                <h3 className="text-2xl font-bold mb-4">
                  Fan-Driven Playlists
                </h3>
                <p className="text-gray-400 text-lg">
                  Let your audience curate your stream's soundtrack.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <UsersIcon className="h-16 w-16 mb-6 text-purple-400" />
                <h3 className="text-2xl font-bold mb-4">
                  Interactive Streaming
                </h3>
                <p className="text-gray-400 text-lg">
                  Engage with your audience through music choices.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <HeartIcon className="h-16 w-16 mb-6 text-purple-400" />
                <h3 className="text-2xl font-bold mb-4">
                  Personalized Experience
                </h3>
                <p className="text-gray-400 text-lg">
                  Create a unique atmosphere for your community.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 flex items-center justify-center">
          <div className="container px-4 md:px-6 max-w-3xl">
            <div className="flex flex-col items-center space-y-8 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Revolutionize Your Streams?
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-400 text-xl">
                Join NextPlay today and create unforgettable streaming
                experiences.
              </p>
              <div className="w-full max-w-md space-y-4">
                <Button
                  type="submit"
                  className="bg-purple-600 text-white hover:bg-purple-700 text-lg py-6 px-8"
                  onClick={() => signIn()}
                >
                  Sign Up
                </Button>
                <p className="text-sm text-gray-500">
                  By signing up, you agree to our{" "}
                  <Link
                    className="underline underline-offset-2 hover:text-purple-400"
                    href="#"
                  >
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-6 px-4 md:px-6 border-t border-gray-800">
        <div className="container mx-auto max-w-5xl flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            © 2024 NextPlay. All rights reserved.
          </p>
          <nav className="flex gap-4 sm:gap-6 mt-4 sm:mt-0">
            <Link className="text-sm hover:text-purple-400" href="#">
              Terms of Service
            </Link>
            <Link className="text-sm hover:text-purple-400" href="#">
              Privacy Policy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
