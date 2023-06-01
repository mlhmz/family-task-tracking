export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Questie",
  description: "Turn chores into fun sidequests while gaining rewards",
  mainNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
    },
    {
      title: "Tasks",
      href: "/tasks",
    },
    {
      title: "Profiles",
      href: "/profiles",
    },
    {
      title: "Rewards",
      href: "/rewards",
    },
  ],
  links: {
    github: "https://github.com/mlhmz/family-task-tracking",
    docs: "https://github.com/mlhmz/family-task-tracking/blob/main/README.md",
  },
};
