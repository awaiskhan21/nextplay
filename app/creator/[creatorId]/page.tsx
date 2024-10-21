import { DashboardComponent } from "@/components/dashboard";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Creator({
  params: { creatorId },
}: {
  params: {
    creatorId: string;
  };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/signin");
  }
  return (
    <div>
      {/* <div>creator Id = {creatorId ? creatorId : "no creatorId"}</div>
      <div>
        user Id ={" "}
        {session.user.id ? session.user.id : "userId is not available"}
      </div> */}
      <DashboardComponent creatorId={creatorId} isCreator={false} />
    </div>
  );
}
