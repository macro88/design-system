import type { Decorator, Preview } from "@storybook/react-vite";
import "../src/styles.css";

const withTheme: Decorator = (Story, context) => {
  const theme = String(context.globals.theme ?? "nostr");
  const scheme = String(context.globals.scheme ?? "light");

  if (typeof document !== "undefined") {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.scheme = scheme;
  }

  return (
    <div data-theme={theme} data-scheme={scheme}>
      <Story />
    </div>
  );
};

const preview: Preview = {
  decorators: [withTheme],
  initialGlobals: {
    theme: "nostr",
    scheme: "light",
  },
  globalTypes: {
    theme: {
      description: "Temporary palette",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: [
          { value: "nostr", title: "Nostr" },
          { value: "runifly", title: "Runifly (temporary)" },
          { value: "exosquare", title: "Exosquare (temporary)" },
        ],
        dynamicTitle: true,
      },
    },
    scheme: {
      description: "Colour scheme",
      toolbar: {
        title: "Scheme",
        icon: "mirror",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    layout: "centered",
    backgrounds: { disable: true },
    a11y: {
      test: "error",
    },
  },
};

export default preview;
