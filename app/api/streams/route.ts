import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
//@ts-expect-error
import youtubesearchapi from "youtube-search-api";

const createStreamSchema = z.object({
  creatorId: z.string(),
  url: z.string(),
  // videoId: z.string(),
});

const YT_REGEX =
  /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;

export async function POST(req: NextRequest) {
  console.log("hit the backend" + JSON.stringify(req));
  try {
    const res = createStreamSchema.safeParse(await req.json());
    if (!res.success || res == undefined) {
      return NextResponse.json(
        {
          message: "InValid inputs",
        },
        {
          status: 400,
        }
      );
    }
    console.log("data" + JSON.stringify(res?.data));
    const isYt = res?.data.url.match(YT_REGEX);
    // console.log("is youtube" + isYt);
    if (!isYt) {
      return NextResponse.json(
        {
          message: "Wrong URL formate",
        },
        {
          status: 411,
        }
      );
    }
    const extractedId = res?.data.url.split("?v=")[1];
    console.log("below isYt !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" + extractedId);
    const detail = await youtubesearchapi.GetVideoDetails(extractedId);
    console.log("details of yt vdo => " + detail);

    const thumbnail = `https://img.youtube.com/vi/${extractedId}/0.jpg`;
    console.log("thumbanil => " + thumbnail);
    // thumbnails.sort((a: { width: number }, b: { width: number }) =>
    //   a.width > b.width ? -1 : 1
    // );
    console.log("details " + detail);
    console.log("above stream and data" + res?.data);
    const stream = await prisma.stream.create({
      data: {
        userId: res?.data.creatorId,
        url: res?.data.url,
        extractedId: extractedId,
        type: "Youtube",
        title: detail.title ?? "Title not available",
        smallImg:
          thumbnail ??
          "https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_640.jpg",
        bigImg:
          thumbnail ??
          "https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_640.jpg",
      },
    });
    console.log("stream created successfully");
    return NextResponse.json({
      thumbnail,
      ...stream,
      upvoteCount: 0,
      haveUpvoted: false,
    });
  } catch (e) {
    console.log("error" + e);
    return NextResponse.json(
      {
        message: "Errror while adding a stream",
        error: { e },
      },
      {
        status: 400,
      }
    );
  }
}

export async function GET(req: NextRequest) {
  // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  const session = await getServerSession(authOptions);

  const creatorId = req.nextUrl.searchParams.get("creatorId");
  if (!creatorId) {
    return NextResponse.json(
      {
        message: "Error",
      },
      {
        status: 411,
      }
    );
  }
  const [stream, activeStream] = await Promise.all([
    prisma.stream.findMany({
      where: {
        userId: creatorId,
        played: false,
      },
      include: {
        _count: {
          select: {
            upvote: true,
          },
        },
        upvote: {
          where: {
            userId: session?.user.id,
          },
        },
      },
    }),
    prisma.currentStream.findFirst({
      where: {
        userId: creatorId,
      },
      include: {
        stream: true,
      },
    }),
  ]);

  return NextResponse.json({
    streams: stream.map(({ _count, ...rest }) => ({
      ...rest,
      upvoteCount: _count.upvote,
      haveUpvoted: rest.upvote.length > 0 ? true : false,
    })),
    activeStream,
  });
}
