import type { Meta, StoryObj } from "@storybook/react-vite";

function paletteLabel(): string {
  if (typeof document === "undefined") return "Nostr";
  const theme = document.documentElement.dataset.theme ?? "nostr";
  const scheme = document.documentElement.dataset.scheme ?? "light";
  const name = theme === "nostr" ? "Nostr" : `${theme} (temporary)`;
  return `${name} · ${scheme}`;
}

function NostrMarks() {
  return (
    <div className="bg-bg text-text grid max-w-prose gap-6 p-6">
      <p className="font-display text-caption text-muted">{paletteLabel()}</p>
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
  component: NostrMarks,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof NostrMarks>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Marks: Story = {};
