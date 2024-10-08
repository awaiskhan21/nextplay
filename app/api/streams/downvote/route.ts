import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const UpvoteSchema = z.object({
  streamId: z.string(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      {
        message: "You need to be logged in to upvote streams",
      },
      {
        status: 401,
      }
    );
  }

  const user = session.user;

  if (!user) {
    return NextResponse.json(
      {
        message: "Unauthenticated",
      },
      {
        status: 403,
      }
    );
  }

  try {
    const data = UpvoteSchema.parse(await req.json());
    await prisma.upvote.delete({
      where: {
        userId_streamId: {
          userId: user?.id,
          streamId: data.streamId,
        },
      },
    });
    return NextResponse.json({
      message: "Done!",
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        message: "Error while upvoting",
      },
      {
        status: 403,
      }
    );
  }
}
