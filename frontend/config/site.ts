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
      title: "Profile",
      href: "/profile",
    },
    {
      title: "Profiles",
      href: "/profiles"
    }
  ],
  links: {
    github: "https://github.com/mlhmz/family-task-tracking",
    docs: "https://github.com/mlhmz/family-task-tracking/blob/main/README.md",
  },
};
