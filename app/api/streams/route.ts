import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
//@ts-ignore
import youtubesearchapi from "youtube-search-api";
const createStreamSchema = z.object({
  creatorId: z.string(),
  url: z.string(),
  // videoId: z.string(),
});

var YT_REGEX =
  /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;

export async function POST(req: NextRequest) {
  // console.log("hit the backend" + JSON.stringify(req));
  try {
    const data = createStreamSchema.parse(await req.json());
    // console.log("data" + JSON.stringify(data));
    const isYt = data.url.match(YT_REGEX);
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
    const extractedId = data.url.split("?v=")[1];
    // console.log("below isYt !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" + extractedId);
    const detail = await youtubesearchapi.GetVideoDetails(extractedId);
    const thumbnails = detail.thumbnail.thumbnails;
    thumbnails.sort((a: { width: number }, b: { width: number }) =>
      a.width > b.width ? -1 : 1
    );
    // console.log(detail);
    // console.log("above stream and data" + data);
    const stream = await prisma.stream.create({
      data: {
        userId: data.creatorId,
        url: data.url,
        extractedId: extractedId,
        type: "Youtube",
        title: detail.title ?? "Title not available",
        smallImg:
          thumbnails.length > 1
            ? thumbnails[1].url
            : thumbnails[0].url ??
              "https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_640.jpg",
        bigImg:
          thumbnails[0].url ??
          "https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_640.jpg",
      },
    });
    // console.log("below stream");
    return NextResponse.json({
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
  const creatorId = req.nextUrl.searchParams.get("creatorId");
  const stream = await prisma.stream.findMany({
    where: {
      userId: creatorId || "",
    },
  });
  return NextResponse.json({
    stream,
  });
}
