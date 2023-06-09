import { env } from "@/env.mjs";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: env.NEXT_PUBLIC_APP_NAME,
  description: "Turn chores into fun sidequests while gaining rewards",
  mainNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
      privilegedOnly: false,
    },
    {
      title: "Tasks",
      href: "/tasks",
      privilegedOnly: true,
    },
    {
      title: "Profiles",
      href: "/profiles",
      privilegedOnly: true,
    },
    {
      title: "Rewards",
      href: "/rewards",
      privilegedOnly: true,
    },
  ],
  links: {
    github: "https://github.com/mlhmz/family-task-tracking",
    docs: "https://github.com/mlhmz/family-task-tracking/blob/main/README.md",
  },
};
