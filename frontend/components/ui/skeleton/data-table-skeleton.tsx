import { Skeleton } from "./skeleton";

export default function DataTableSkeleton() {
  return (
    <div className="flex flex-col items-center">
      <Skeleton className="my-2 h-[50px] w-[400px] md:w-[600px] lg:w-[900px] xl:w-[1200px]" />
      <Skeleton className="h-[300px] w-[400px] md:w-[600px] lg:w-[900px] xl:w-[1200px]" />
    </div>
  );
}
