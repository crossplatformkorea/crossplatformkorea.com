const sidebars = {
  docs: [
    "introduction",
    "news",
    "speaker",
    "membership",
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
      items: [
        "react-native/development-environment/macos",
        "react-native/development-environment/windows",
        "react-native/development-environment/vscode-plugins",
      ],
    },
    "react-native/react",
    {
      type: "category",
      label: "Style",
      link: { type: "generated-index" },
      items: [
        "react-native/style/built-in",
        "react-native/style/styled-component",
      ],
    },
    {
      type: "category",
      label: "Component",
      link: { type: "generated-index" },
      items: [
        "react-native/component/built-in",
      ],
    },
    {
      type: "category",
      label: "Router",
      link: { type: "generated-index" },
      items: [
        "react-native/router/router",
        "react-native/router/expo-router",
      ],
    },
    {
      type: "category",
      label: "Development",
      collapsed: false,
      link: { type: "generated-index" },
      items: [
        "react-native/development/start",
        "react-native/development/folder-structure",
      ],
    },
  ],
};

module.exports = sidebars;
