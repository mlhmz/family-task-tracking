import Link from "next/link";

import { siteConfig } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";

export default function IndexPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          Next generation family chore tracker <br className="hidden sm:inline" />
          to make household chores bearable.
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
          Revolutionize your home management: Embrace the future of chore tracking for families and transform
          mundane tasks into enjoyable moments.
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href={siteConfig.links.docs}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants({ size: "lg" })}>
          Documentation
        </Link>
        <Link
          target="_blank"
          rel="noreferrer"
          href={siteConfig.links.github}
          className={buttonVariants({ variant: "outline", size: "lg" })}>
          GitHub
        </Link>
      </div>
    </section>
  );
}
