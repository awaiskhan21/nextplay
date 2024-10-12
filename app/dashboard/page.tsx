import { DashboardComponent } from "@/components/dashboard";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/signin");
  }
  const creatorId = session?.user.id;
  return (
    <div>
      {session.user.id ? session.user.id : "Id is not available"}
      <DashboardComponent creatorId={creatorId} isCreator={true} />
    </div>
  );
}
