import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export default async function GET() {
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
      id: session.user.id,
    },
    orderBy: {
      upvote: {
        _count: "desc",
      },
    },
  });

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
    prisma.stream.delete({
      where: {
        id: mostUpvotedStream?.id,
      },
    }),
  ]);

  return NextResponse.json({
    stream: mostUpvotedStream,
  });
}
