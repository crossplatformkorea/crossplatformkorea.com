/**
 * Sidebar items for rendering the navigation menu
 */
import { FileText, Lightbulb, Palette, BookOpen } from 'lucide-react';

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
  {
    key: 'showcase',
    route: '/showcase',
    icon: Palette,
    labelKey: 'pages.showcase',
  },
  // {
  //   key: "contributors",
  //   route: "/contributors",
  //   icon: Users,
  //   labelKey: "pages.contributors",
  // },
  {
    key: 'featureRequest',
    route: '/feature-request',
    icon: Lightbulb,
    labelKey: 'pages.featureRequests',
  },
  {
    key: 'docs',
    route: 'https://doc.crossplatformkorea.com',
    icon: BookOpen,
    labelKey: 'common.navDoc',
  },
];
