"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from "axios";
import {
  ChevronsDown,
  ChevronsUp,
  PlayCircle,
  Plus,
  Share2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//@ts-expect-error
import YouTubePlayer from "youtube-player";
const getYouTubeId = (url: string) => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

type Video = {
  id: string;
  type: string;
  url: string;
  extractedId: string;
  smallImg: string;
  bigImg: string;
  active: boolean;
  userId: string;
  title: string;
  upvoteCount: number;
  haveUpvoted: boolean;
};
const REFRESH_INTERVAL_MS = 10 * 1000;
export function DashboardComponent({
  creatorId,
  isCreator = false,
}: {
  creatorId: string;
  isCreator: boolean;
}) {
  const [url, setUrl] = useState("");
  const [queue, setQueue] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [nextLoading, setNextLoading] = useState<boolean>(false);
  const videoPlayerRef = useRef();
  const refreshStreams = async () => {
    const res = await axios.get(`/api/streams/?creatorId=${creatorId}`);

    setQueue(
      res.data.streams.sort((a: any, b: any) =>
        a.upvoteCount < b.upvoteCount ? 1 : -1
      )
    );
    setCurrentVideo((video) => {
      if (video?.id === res.data.activeStream?.stream?.id) {
        return video;
      } else {
        return res.data.activeStream.stream;
      }
    });
  };

  //fetching data
  useEffect(() => {
    refreshStreams();
    setInterval(() => {
      // refreshStreams();
    }, REFRESH_INTERVAL_MS);
  }, []);

  //update queue
  useEffect(() => {
    if (queue.length > 0 && !currentVideo) {
      setCurrentVideo(queue[0]);
      setQueue(queue.slice(1));
    }
  }, [queue, currentVideo]);

  const handlePlayNext = async () => {
    if (queue.length > 0) {
      const res = await axios.get("/api/streams/next");
      setNextLoading(true);
      setCurrentVideo(res.data.stream);
      setQueue((q) => q.filter((x) => x.id !== res.data.stream.id));
      setNextLoading(false);
    }
  };

  //auto play next
  useEffect(() => {
    if (!videoPlayerRef.current) {
      console.log("is it here!!!!!!!!!!!!!!!!!!!!!");
      return;
    }
    const player = YouTubePlayer(videoPlayerRef.current);

    // 'loadVideoById' is queued until the player is ready to receive API calls.
    player.loadVideoById(currentVideo?.extractedId);

    player.playVideo();

    function handleEvent(event: any) {
      // console.log(event.data);
      if (event.data === 0) {
        handlePlayNext();
      }
    }
    player.on("stateChange", handleEvent);
    return () => {
      player.destroy();
    };
  }, [currentVideo, videoPlayerRef]);

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
        const response: { data: Video } = await axios.post("/api/streams", {
          creatorId: creatorId,
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
                upvotes: isUpvote
                  ? video.upvoteCount + 1
                  : video.upvoteCount - 1,
                haveUpvoted: !video.haveUpvoted,
              }
            : video
        )
        .sort((a, b) => b.upvoteCount - a.upvoteCount)
    );
    await axios.post(`/api/streams/${isUpvote ? "upvote" : "downvote"}`, {
      streamId: id,
    });
  };

  const handleShare = () => {
    const shareableLink = `${window.location.hostname}/creator/${creatorId}`;

    navigator.clipboard
      .writeText(shareableLink)
      .then(() => {
        toast.success("Link copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy the link");
      });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-purple-400">Dashboard</h1>
          <div className="bg-red-400"></div>
          <Button
            onClick={handleShare}
            variant="outline"
            className="bg-gray-800 hover:bg-gray-700 text-purple-400 border-gray-700"
          >
            <Share2 className="mr-2 h-4 w-4" /> Share
            <ToastContainer />
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
                  {isCreator ? (
                    <Button
                      onClick={handlePlayNext}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {nextLoading ? (
                        "Loading..."
                      ) : (
                        <>
                          {" "}
                          <PlayCircle className="mr-2 h-4 w-4" /> Play Next
                        </>
                      )}
                    </Button>
                  ) : null}
                </div>
                {currentVideo ? (
                  <div className="space-y-4 aspect-video">
                    <div className="aspect-video">
                      {isCreator ? (
                        <div className="">
                          {/* @ts-ignore */}
                          <div ref={videoPlayerRef} className="w-full" />
                        </div>
                      ) : (
                        <img src={currentVideo.bigImg} />
                      )}
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
                  {queue.map((video) => (
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
