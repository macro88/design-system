import type { Meta, StoryObj } from "@storybook/react-vite";

const swatches = [
  ["bg", "bg-bg"],
  ["surface", "bg-surface"],
  ["text", "bg-text"],
  ["muted", "bg-muted"],
  ["accent", "bg-accent"],
  ["accent-fg", "bg-accent-fg"],
  ["accent-on", "bg-accent-on"],
  ["accent-subtle", "bg-accent-subtle"],
  ["selected", "bg-selected"],
  ["today", "bg-today"],
  ["skeleton", "bg-skeleton"],
  ["border", "bg-border"],
  ["border-strong", "bg-border-strong"],
  ["focus", "bg-focus"],
] as const;

const statuses = [
  ["draft", "bg-status-draft-bg text-status-draft-fg"],
  ["queued", "bg-status-queued-bg text-status-queued-fg"],
  ["approved", "bg-status-approved-bg text-status-approved-fg"],
  ["signed", "bg-status-signed-bg text-status-signed-fg"],
  ["sent", "bg-status-sent-bg text-status-sent-fg"],
  ["failed", "bg-status-failed-bg text-status-failed-fg"],
  ["missed", "bg-status-missed-bg text-status-missed-fg"],
] as const;

const themeNames: Record<string, string> = {
  nostr: "Nostr",
  runifly: "Runifly (temporary)",
  exosquare: "Exosquare (temporary)",
};

function Tokens({ theme, scheme }: { theme: string; scheme: string }) {
  const label = themeNames[theme] ?? `${theme} (temporary)`;
  return (
    <div className="text-text grid max-w-prose gap-8">
      <p className="text-muted font-body text-caption">
        {label} · {scheme}. Switch theme and scheme from the toolbar.
      </p>
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {swatches.map(([name, swatch]) => (
          <div key={name} className="border-border overflow-hidden rounded-panel border">
            <div className={`${swatch} h-12`} />
            <p className="font-body text-caption px-2 py-1">{name}</p>
          </div>
        ))}
      </section>
      <section className="flex flex-wrap gap-2">
        {statuses.map(([name, swatch]) => (
          <span key={name} className={`${swatch} rounded-badge px-2 py-1 font-body text-caption`}>
            {name}
          </span>
        ))}
      </section>
      <section className="grid gap-3">
        <p className="font-display text-display-md">Display</p>
        <p className="font-body text-body-md max-w-prose">
          Body copy sits on the surface. Secondary text uses the muted role.
        </p>
        <p className="text-muted font-body text-caption tabular-nums">09:00 · 142</p>
      </section>
      <section className="flex flex-wrap items-end gap-4">
        <div className="bg-surface rounded-control shadow-rest h-16 w-16 border border-border" />
        <div className="bg-surface rounded-panel shadow-hover h-16 w-16 border border-border" />
        <div className="bg-surface rounded-overlay shadow-lift h-16 w-16 border border-border" />
        <div className="bg-accent-subtle rounded-badge h-8 w-16 border border-border" />
        <div className="bg-accent rounded-full size-10" />
      </section>
    </div>
  );
}

const meta = {
  title: "Tokens",
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {
  render: (_, { globals }) => (
    <Tokens theme={String(globals.theme ?? "nostr")} scheme={String(globals.scheme ?? "light")} />
  ),
};
