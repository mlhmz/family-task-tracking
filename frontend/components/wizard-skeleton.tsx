import { Skeleton } from "./ui/skeleton";

export default function WizardSkeleton() {
  return (
    <div className="m-auto my-5 flex w-1/3 flex-col gap-5">
        <Skeleton className="m-auto h-10 w-10" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="m-auto h-2 w-1/2" />
        <Skeleton className="h-10 w-full" />
      </div>
  )
}
