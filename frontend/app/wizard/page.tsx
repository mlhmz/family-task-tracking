import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function WizardPage() {
  return (
    <div className="m-auto my-5 flex w-1/3 flex-col gap-5">
      <h1 className="m-auto text-6xl">👋</h1>
      <h2 className="text-center text-2xl font-bold">Welcome to FTT</h2>
      <Link href="/wizard/1" className={buttonVariants({ size: "sm" })}>
        Next
      </Link>
    </div>
  );
}
