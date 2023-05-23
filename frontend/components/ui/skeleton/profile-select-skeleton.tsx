import { Skeleton } from "./skeleton";

export const ProfileSelectSkeleton = () => {
  return (
    <div className="m-auto my-5 flex w-1/3 flex-col items-center gap-5">
      <div className="m-auto">
        <Skeleton className="h-[180px] w-[180px] rounded-full" />
      </div>
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-[40px] w-[240px]" />
      <Skeleton className="h-10 w-16" />
    </div>
  );
};
