/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  title: "Cross-Platform Korea",
  url: "https://crossplatformkorea.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  favicon: "img/favicon.ico",
  organizationName: "crossplatformkorea",
  projectName: "crossplatformkorea.com",
  onBrokenLinks: "ignore",
  i18n: {
    defaultLocale: "ko",
    locales: ["en", "ko"],
  },
  plugins: [
    [
      "@docusaurus/plugin-client-redirects",
      {
        redirects: [
          {
            to: "/docs/current/introduction",
            from: "/docs",
          },
          {
            to: "/docs/current/introduction",
            from: "/docs/introduction",
          }
        ],
      },
    ],
  ],
  themeConfig: {
    navbar: {
      title: "Cross-Platform Korea",
      logo: {
        alt: "crossplatformkorea",
        src: "img/logo.png",
      },
      items: [
        {
          type: 'dropdown',
          label: 'Development',
          position: 'left',
          items: [
            {
              label: 'React Native',
              href: '/docs/current/react-native/intro',
            },
          ],
        },
        {
          to: "/docs/current/introduction",
          label: "Community",
          position: "left",
        },
        { to: "/blog", label: "Blog", position: "left" },
        { href: "https://forums.crossplatformkorea.com", label: "Forums", position: "left" },
        {
          href: "https://github.com/crossplatformkorea/crossplatformkorea.com",
          label: "GitHub",
          position: "right",
        },
        {
          type: "localeDropdown",
          position: "right",
        },
        {
          type: "docsVersionDropdown",
          position: "right",
          dropdownActiveClassDisabled: true,
          dropdownItemsAfter: [],
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Community",
          items: [
            {
              label: "Forums",
              href: "https://forums.crossplatformkorea.com",
            },
            {
              label: "Slack",
              href: "https://dooboolab.com/joinCPKorea",
            },
          ],
        },
        {
          title: "Offline",
          items: [
            {
              label: "Meetup",
              href: "https://www.meetup.com/ko-KR/crossplatformkorea",
            },
          ],
        },
        {
          title: "Contents",
          items: [
            {
              label: "Medium",
              href: "https://medium.com/crossplatformkorea",
            },
            {
              label: "Youtube",
              href: "https://www.youtube.com/playlist?list=PLMu8UG37vF6oJLNhjsjoy_ApcJFZZwJOo",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} dooboolab.`,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          path: "docs",
          lastVersion: "current",
          versions: {
            current: {
              label: "current",
              path: "current",
            },
          },
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: ({ locale, docPath }) => {
            if (locale !== "en") {
              return `https://github.com/crossplatformkorea/crossplatformkorea.com/tree/main/${locale}`;
            }
            // We want users to submit doc updates to the upstream/next version!
            // Otherwise we risk losing the update on the next release.
            const nextVersionDocsDirPath = "docs";
            return `https://github.com/crossplatformkorea/crossplatformkorea.com/edit/main/${nextVersionDocsDirPath}/${docPath}`;
          },
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
};
