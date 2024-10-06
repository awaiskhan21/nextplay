import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    return NextResponse.json(
      {
        message: "Unauthenticated",
      },
      {
        status: 403,
      }
    );
  }

  const stream = await prisma.stream.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      _count: {
        select: {
          upvote: true,
        },
      },
      upvote: {
        where: {
          userId: session.user.id,
        },
      },
    },
  });

  return NextResponse.json({
    streams: stream.map(({ _count, ...rest }) => ({
      ...rest,
      upvoteCount: _count.upvote,
      haveUpvoted: rest.upvote.length > 0 ? true : false,
    })),
  });
}
