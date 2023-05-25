export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "FTT",
  description: "Next generation addictive family task tracker that will make household chores more bearable.",
  mainNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
    },
    {
      title: "Profiles",
      href: "/profiles",
    },
    {
      title: "Rewards",
      href: "/rewards",
    }
  ],
  links: {
    github: "https://github.com/mlhmz/family-task-tracking",
    docs: "https://github.com/mlhmz/family-task-tracking/blob/main/README.md",
  },
};
