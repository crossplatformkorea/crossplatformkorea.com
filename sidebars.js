/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const sidebars = {
  docs: [
    "introduction",
    "news",
    "speaker",
    {
      type: "category",
      label: "Community",
      link: { type: "generated-index" },
      collapsed: true,
      items: [
        "community/communication",
        "community/forums",
        "community/meetup",
        "community/opensource",
      ],
    },
  ],
  "react-native": [
    "react-native/intro",
    {
      type: "category",
      label: "Development Environment",
      link: { type: "generated-index" },
      collapsed: false,
      items: [
        "react-native/development-environment-mac",
        "react-native/development-environment-windows",
        "react-native/vscode-plugins",
      ],
    },
    "react-native/components",
  ],
};

module.exports = sidebars;
