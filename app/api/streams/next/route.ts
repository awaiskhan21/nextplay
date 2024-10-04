import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      {
        message: "Unauthenticated",
      },
      {
        status: 403,
      }
    );
  }

  const mostUpvotedStream = await prisma.stream.findFirst({
    where: {
      userId: session.user.id,
      played: false,
    },
    orderBy: [
      {
        upvote: {
          _count: "desc",
        },
      },
      {
        createdAt: "asc",
      },
    ],
    include: {
      upvote: true,
      _count: {
        select: { upvote: true },
      },
    },
  });
  // console.log(
  //   "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  // );
  // console.log("user: - " + session.user.id);
  // console.log("mostupvoted :- " + mostUpvotedStream);
  await Promise.all([
    prisma.currentStream.upsert({
      where: {
        userId: session.user.id,
      },
      update: {
        streamId: mostUpvotedStream?.id,
      },
      create: {
        userId: session.user.id,
        streamId: mostUpvotedStream?.id,
      },
    }),
    prisma.stream.updateMany({
      where: {
        id: mostUpvotedStream?.id ?? "",
      },
      data: {
        played: true,
        playedTs: new Date(),
      },
    }),
  ]);

  return NextResponse.json({
    stream: mostUpvotedStream,
  });
}
