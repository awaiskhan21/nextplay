import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
//@ts-ignore
import youtubesearchapi from "youtube-search-api";
const createStreamSchema = z.object({
  creatorId: z.string(),
  url: z.string(),
});

var YT_REGEX =
  /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;

export async function POST(req: NextRequest) {
  try {
    const data = createStreamSchema.parse(await req.json());
    const isYt = data.url.match(YT_REGEX);
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
    const detail = await youtubesearchapi.GetVideoDetails(extractedId);
    const thumbnails = detail.thumbnail.thumbnails;
    thumbnails.sort((a: { width: number }, b: { width: number }) =>
      a.width > b.width ? -1 : 1
    );
    console.log(thumbnails);
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
    return NextResponse.json({
      message: "Added stream",
      id: stream.id,
    });
  } catch (e) {
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
