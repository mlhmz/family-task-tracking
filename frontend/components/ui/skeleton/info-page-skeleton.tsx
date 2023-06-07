import { Skeleton } from "./skeleton";

export default function InfoPageSkeleton() {
  return (
    <div className="m-5 flex flex-col gap-5 lg:mx-auto lg:w-1/3">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="mt-8 h-16 w-full" />
      <Skeleton className="mt-2 h-16 w-full" />
    </div>
  );
}
