import { DashboardComponent } from "@/components/dashboard";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  const creatorId = session?.user.id ?? "";
  return (
    <div>
      <DashboardComponent creatorId={creatorId} />
    </div>
  );
}
