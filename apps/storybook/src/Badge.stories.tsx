import type { Meta, StoryObj } from "@storybook/react-vite";
import { type StatusTone } from "@macro88/tokens";
import { Badge } from "@macro88/ui";

function ToneBadge({ tone }: { tone: StatusTone }) {
  return <Badge tone={tone}>{tone}</Badge>;
}

const meta = {
  title: "Badge",
  component: ToneBadge,
} satisfies Meta<typeof ToneBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

function toneStory(
  tone: StatusTone,
  theme: "nostr" | "runifly" | "exosquare",
  scheme: "light" | "dark",
): Story {
  return {
    name: `${tone} · ${theme} · ${scheme}`,
    args: { tone },
    globals: { theme, scheme },
  };
}

export const NeutralNostrLight = toneStory("neutral", "nostr", "light");
export const NeutralNostrDark = toneStory("neutral", "nostr", "dark");
export const NeutralRuniflyLight = toneStory("neutral", "runifly", "light");
export const NeutralRuniflyDark = toneStory("neutral", "runifly", "dark");
export const NeutralExosquareLight = toneStory("neutral", "exosquare", "light");
export const NeutralExosquareDark = toneStory("neutral", "exosquare", "dark");

export const AccentNostrLight = toneStory("accent", "nostr", "light");
export const AccentNostrDark = toneStory("accent", "nostr", "dark");
export const AccentRuniflyLight = toneStory("accent", "runifly", "light");
export const AccentRuniflyDark = toneStory("accent", "runifly", "dark");
export const AccentExosquareLight = toneStory("accent", "exosquare", "light");
export const AccentExosquareDark = toneStory("accent", "exosquare", "dark");

export const SuccessNostrLight = toneStory("success", "nostr", "light");
export const SuccessNostrDark = toneStory("success", "nostr", "dark");
export const SuccessRuniflyLight = toneStory("success", "runifly", "light");
export const SuccessRuniflyDark = toneStory("success", "runifly", "dark");
export const SuccessExosquareLight = toneStory("success", "exosquare", "light");
export const SuccessExosquareDark = toneStory("success", "exosquare", "dark");

export const WarningNostrLight = toneStory("warning", "nostr", "light");
export const WarningNostrDark = toneStory("warning", "nostr", "dark");
export const WarningRuniflyLight = toneStory("warning", "runifly", "light");
export const WarningRuniflyDark = toneStory("warning", "runifly", "dark");
export const WarningExosquareLight = toneStory("warning", "exosquare", "light");
export const WarningExosquareDark = toneStory("warning", "exosquare", "dark");

export const DangerNostrLight = toneStory("danger", "nostr", "light");
export const DangerNostrDark = toneStory("danger", "nostr", "dark");
export const DangerRuniflyLight = toneStory("danger", "runifly", "light");
export const DangerRuniflyDark = toneStory("danger", "runifly", "dark");
export const DangerExosquareLight = toneStory("danger", "exosquare", "light");
export const DangerExosquareDark = toneStory("danger", "exosquare", "dark");

export const InfoNostrLight = toneStory("info", "nostr", "light");
export const InfoNostrDark = toneStory("info", "nostr", "dark");
export const InfoRuniflyLight = toneStory("info", "runifly", "light");
export const InfoRuniflyDark = toneStory("info", "runifly", "dark");
export const InfoExosquareLight = toneStory("info", "exosquare", "light");
export const InfoExosquareDark = toneStory("info", "exosquare", "dark");
