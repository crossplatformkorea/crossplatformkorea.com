/**
 * Sidebar items for rendering the navigation menu
 */
import { FileText, Lightbulb, Palette, Calendar } from 'lucide-react';

export type SidebarItem = {
  key: string;
  route: string;
  icon: React.ComponentType<{ size?: number }>;
  labelKey: string;
};

export const sidebarItems: SidebarItem[] = [
  {
    key: 'posts',
    route: '/posts',
    icon: FileText,
    labelKey: 'pages.posts',
  },
  // {
  //   key: "showcase",
  //   route: "/showcase",
  //   icon: Palette,
  //   labelKey: "pages.showcase",
  // },
  // {
  //   key: "events",
  //   route: "/events",
  //   icon: Calendar,
  //   labelKey: "pages.events",
  // },
  {
    key: 'featureRequest',
    route: '/feature-request',
    icon: Lightbulb,
    labelKey: 'pages.featureRequests',
  },
];
