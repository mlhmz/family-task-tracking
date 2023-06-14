import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function WizardPage() {
  return (
    <div className="my-5 flex flex-col items-center gap-5">
      <h1 className="m-auto text-6xl">🎉</h1>
      <h2 className="text-center text-2xl font-bold">You&apos;re all set up!</h2>
      <Link href="/dashboard" className={buttonVariants({ size: "sm" })}>
        Next
      </Link>
    </div>
  );
}
