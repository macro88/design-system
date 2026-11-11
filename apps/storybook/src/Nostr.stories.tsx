import type { Meta, StoryObj } from "@storybook/react-vite";

const themeNames: Record<string, string> = {
  nostr: "Nostr (temporary)",
  runifly: "Runifly (temporary)",
  exosquare: "Exosquare (temporary)",
};

function paletteLabel(theme: string, scheme: string): string {
  return `${themeNames[theme] ?? `${theme} (temporary)`} · ${scheme}`;
}

function NostrMarks({ theme, scheme }: { theme: string; scheme: string }) {
  return (
    <div className="bg-bg text-text grid max-w-prose gap-6 p-6">
      <p className="font-display text-caption text-muted">{paletteLabel(theme, scheme)}</p>
      <h1 className="font-display text-display-sm">Scheduler</h1>
      <p className="literata-reading max-w-prose">
        The writing is the product. Notes sit in Literata, with the optical size set for reading.
      </p>
      <p className="literata-excerpt">
        A shorter excerpt stays on the same face at a smaller optical size.
      </p>
      <p className="font-mono text-caption">npub1example</p>
      <div className="ink-rule" role="presentation" />
      <p className="font-display text-caption text-muted">Draft</p>
      <p>
        <span className="bg-status-failed-bg text-status-failed-fg rounded-badge inline-block px-2 py-1 font-display text-caption">
          Failed
        </span>
      </p>
      <p>
        <span className="bg-status-missed-bg text-status-missed-fg rounded-badge inline-block px-2 py-1 font-display text-caption">
          Missed
        </span>
      </p>
      <div className="bg-skeleton h-4 w-full" />
    </div>
  );
}

const meta = {
  title: "Nostr",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Marks: Story = {
  render: (_, { globals }) => (
    <NostrMarks
      theme={String(globals.theme ?? "nostr")}
      scheme={String(globals.scheme ?? "light")}
    />
  ),
};
