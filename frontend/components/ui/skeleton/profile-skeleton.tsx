import { Skeleton } from "./skeleton";

export const ProfileSkeleton = () => {
  return (
    <div className="m-auto my-5 flex w-1/3 flex-col gap-5">
      <div className="flex items-center gap-5">
        <Skeleton className="h-[180px] w-[180px] rounded-full" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-8 w-36" />
          <div className="flex gap-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  );
};
