import { Skeleton } from "./skeleton";

export const DashboardSkeleton = () => {
  const skeletonCards = Array.from({ length: 10 }, (_, i) => i);
  return (
    <>
      <Skeleton className="mb-8 h-11 w-96" />
      <div className="flex w-full flex-wrap gap-4">
        {skeletonCards.map((_, i) => (
          <Skeleton key={i} className="h-64 w-56" />
        ))}
      </div>
    </>
  );
};
