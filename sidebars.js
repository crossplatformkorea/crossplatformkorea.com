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
        "react-native/development-environment/macos",
        "react-native/development-environment/windows",
        "react-native/vscode-plugins",
      ],
    },
    {
      type: "category",
      label: "Style",
      link: { type: "generated-index" },
      items: [
        "react-native/style/built-in",
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
        "react-native/router/expo-router",
      ],
    },
  ],
};

module.exports = sidebars;
