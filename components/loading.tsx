"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingComponent() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-10 w-48 bg-gray-800" />
          <Skeleton className="h-6 w-24 bg-gray-800" />
          <Skeleton className="h-10 w-28 bg-gray-800" />
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* URL Input, Preview, and Current Video */}
          <div className="lg:w-2/3 space-y-8 order-1 lg:order-2">
            {/* URL Input and Preview */}
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6 space-y-4">
                <div className="flex space-x-2">
                  <Skeleton className="h-10 flex-grow bg-gray-800" />
                  <Skeleton className="h-10 w-32 bg-gray-800" />
                </div>
                <Skeleton className="aspect-video w-full bg-gray-800" />
              </CardContent>
            </Card>

            {/* Current Video */}
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <Skeleton className="h-8 w-36 bg-gray-800" />
                  <Skeleton className="h-10 w-28 bg-gray-800" />
                </div>
                <div className="space-y-4">
                  <Skeleton className="aspect-video w-full bg-gray-800" />
                  <Skeleton className="h-6 w-3/4 bg-gray-800" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Queue */}
          <Card className="bg-gray-900 border-gray-800 lg:w-3/4 order-2 lg:order-1">
            <CardContent className="p-6">
              <Skeleton className="h-8 w-24 mb-4 bg-gray-800" />
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 bg-gray-800 p-3 rounded-lg"
                  >
                    <Skeleton className="w-24 h-18 rounded bg-gray-700" />
                    <div className="flex-grow">
                      <Skeleton className="h-5 w-3/4 bg-gray-700" />
                    </div>
                    <Skeleton className="h-8 w-16 bg-gray-700" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
