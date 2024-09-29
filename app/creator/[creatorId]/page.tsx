import { DashboardComponent } from "@/components/dashboard";

export default function Creator({
  params: { creatorId },
}: {
  params: {
    creatorId: string;
  };
}) {
  return (
    <div>
      {creatorId}
      <DashboardComponent creatorId={creatorId} />
    </div>
  );
}
