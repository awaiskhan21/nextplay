"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import {
  ChevronsDown,
  ChevronsUp,
  PlayCircle,
  Plus,
  Share2,
} from "lucide-react";
import { useEffect, useState } from "react";

const getYouTubeId = (url: string) => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

type Video = {
  id: string;
  type: string;
  url: String;
  extractedId: String;
  smallImg: String;
  bigImg: String;
  active: Boolean;
  userId: String;
  title: string;
  upvoteCount: number;
  haveUpvoted: boolean;
};

const REFRESH_INTERVAL_MS = 10 * 1000;
export function DashboardComponent() {
  const [url, setUrl] = useState("");
  const [queue, setQueue] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const refreshStreams = async () => {
    const res = await axios.get("api/streams/my");
    setQueue(
      res.data.streams.sort((a: any, b: any) =>
        a.upvotes < b.upvotes ? 1 : -1
      )
    );
  };

  //fetching data
  useEffect(() => {
    refreshStreams();
    setInterval(() => {
      // refreshStreams();
    }, REFRESH_INTERVAL_MS);
  }, []);

  useEffect(() => {
    if (queue.length > 0 && !currentVideo) {
      setCurrentVideo(queue[0]);
      setQueue(queue.slice(1));
    }
  }, [queue, currentVideo]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    const videoId = getYouTubeId(e.target.value);
    setPreviewId(videoId);
  };

  const handleAddToQueue = async () => {
    setLoading(true);
    const videoId = getYouTubeId(url);
    console.log("vid" + videoId);
    if (videoId) {
      try {
        // In a real app, you'd fetch video details from YouTube API
        console.log("url" + url);
        const response: { data: Video } = await axios.post("/api/streams", {
          creatorId: "ed46c805-58c8-4ca5-bd96-a5c3862054a6",
          url,
          videoId: videoId,
        });
        setQueue([...queue, response?.data]);
        setUrl("");
        setPreviewId(null);
      } catch (error) {
        console.error("Error fetching video details:", error);
      }
    }
    setLoading(false);
  };

  const handleVote = async (id: string, isUpvote: boolean) => {
    setQueue(
      queue
        .map((video) =>
          video.id === id
            ? {
                ...video,
                upvotes: isUpvote ? video.upvotes + 1 : video.upvotes - 1,
                haveUpvoted: !video.haveUpvoted,
              }
            : video
        )
        .sort((a, b) => b.upvotes - a.upvotes)
    );
    await axios.post(`/api/streams/${isUpvote ? "upvote" : "downvote"}`, {
      streamId: id,
    });
  };

  const handleShare = () => {
    if (currentVideo) {
      const shareUrl = `https://youtube.com/watch?v=${currentVideo.id}`;
      navigator.clipboard.writeText(shareUrl).then(
        () => {
          toast({
            title: "Link Copied!",
            description: "The video link has been copied to your clipboard.",
          });
        },
        (err) => {
          console.error("Could not copy text: ", err);
        }
      );
    }
  };

  const handlePlayNext = () => {
    if (queue.length > 0) {
      setCurrentVideo(queue[0]);
      setQueue(queue.slice(1));
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-purple-400">
            NextPlay Dashboard
          </h1>
          <Button
            onClick={handleShare}
            variant="outline"
            className="bg-gray-800 hover:bg-gray-700 text-purple-400 border-gray-700"
          >
            <Share2 className="mr-2 h-4 w-4" /> Share Current Song
          </Button>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Right Side (URL Input, Preview, and Current Video) - Appears first on mobile */}
          <div className="lg:w-2/3 space-y-8 order-1 lg:order-2">
            {/* URL Input and Preview */}
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6 space-y-4">
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder="Enter YouTube URL"
                    value={url}
                    onChange={handleUrlChange}
                    className="flex-grow bg-gray-800 border-gray-700 text-white focus:ring-purple-500 focus:border-purple-500"
                  />
                  <Button
                    disabled={loading}
                    onClick={handleAddToQueue}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {loading ? (
                      "Loading..."
                    ) : (
                      <>
                        {" "}
                        <Plus className="mr-2 h-4 w-4" /> Add to Queue{" "}
                      </>
                    )}
                  </Button>
                </div>
                {previewId && (
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${previewId}`}
                      className="w-full h-full"
                      allowFullScreen
                      title="Video preview"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Current Video */}
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold text-purple-400">
                    Now Playing
                  </h2>
                  <Button
                    onClick={handlePlayNext}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <PlayCircle className="mr-2 h-4 w-4" /> Play Next
                  </Button>
                </div>
                {currentVideo ? (
                  <div className="space-y-4">
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <iframe
                        src={`https://www.youtube.com/embed/${currentVideo.id}`}
                        className="w-full h-full"
                        allowFullScreen
                        title={currentVideo.title}
                      />
                    </div>
                    <h3 className="font-medium text-lg text-purple-300">
                      {currentVideo.title}
                    </h3>
                  </div>
                ) : (
                  <p className="text-gray-400">No video currently playing</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Queue (Left Side) - Appears second on mobile */}
          <Card className="bg-gray-900 border-gray-800 lg:w-3/4 order-2 lg:order-1">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-purple-400">
                Queue
              </h2>
              {queue.length > 0 ? (
                <ul className="space-y-4">
                  {queue.map((video, index) => (
                    <li
                      key={video.id}
                      className="flex items-center space-x-4 bg-gray-800 p-3 rounded-lg"
                    >
                      <img
                        src={`${video.smallImg}`}
                        alt={video.title}
                        className="w-24 h-18 object-cover rounded"
                      />
                      <div className="flex-grow">
                        <h3 className="font-medium text-purple-300">
                          {video.title}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleVote(
                              video.id,
                              video.haveUpvoted ? false : true
                            )
                          }
                          className="flex items-center space-x-1 bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                        >
                          {video.haveUpvoted ? (
                            <ChevronsDown className="h-4 w-4" />
                          ) : (
                            <ChevronsUp className="h-4 w-4" />
                          )}
                          <span>{video.upvoteCount}</span>
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">Queue is empty</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
