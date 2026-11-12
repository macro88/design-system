import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  Button,
  ConfirmSheet,
  EmptyState,
  InlineError,
  Skeleton,
  Toaster,
  showError,
  showSuccess,
  showUndo,
} from "@macro88/ui";

const paletteLabel: Record<string, string> = {
  nostr: "Nostr",
  runifly: "Runifly (temporary)",
  exosquare: "Exosquare (temporary)",
};

function FeedbackGallery() {
  const [open, setOpen] = useState(false);
  const theme = document.documentElement.dataset.theme ?? "nostr";
  const scheme = document.documentElement.dataset.scheme ?? "light";
  return (
    <div className="bg-bg text-text grid gap-6 p-6">
      <Toaster />
      <header className="grid gap-1">
        <p className="type-eyebrow text-muted">
          {paletteLabel[theme] ?? `${theme} (temporary)`} · {scheme}
        </p>
        <h1 className="type-display-md">Feedback</h1>
      </header>
      <div className="grid max-w-prose gap-3">
        <Skeleton variant="line" label="Loading a line" />
        <Skeleton variant="card" label="Loading a card" />
        <Skeleton variant="column" label="Loading a column" />
      </div>
      <EmptyState title="Nothing here" action={<Button>Continue</Button>}>
        Try another step.
      </EmptyState>
      <InlineError>That could not be saved. Try again.</InlineError>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => showSuccess("Saved")}>Show success</Button>
        <Button variant="outline" onClick={() => showError("That could not be saved.")}>
          Show error
        </Button>
        <Button variant="ghost" onClick={() => showUndo("Removed", () => undefined)}>
          Show undo
        </Button>
        <Button onClick={() => setOpen(true)}>Open sheet</Button>
      </div>
      <ConfirmSheet
        open={open}
        onOpenChange={setOpen}
        title="Remove this item?"
        description="This cannot be undone."
        confirmLabel="Remove"
        onConfirm={() => undefined}
      />
    </div>
  );
}

const meta = {
  title: "Feedback",
  component: FeedbackGallery,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof FeedbackGallery>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Gallery: Story = {};

const themes = ["nostr", "runifly", "exosquare"] as const;

export const ToastOverSheet: Story = {
  render: () => (
    <div className="grid gap-8 p-6">
      {themes.map((theme) => (
        <section
          key={theme}
          data-theme={theme}
          data-scheme="light"
          className="bg-bg relative grid gap-4 p-4"
        >
          <p className="font-display type-caption text-muted">{theme}</p>
          <div className="bg-surface border-border relative rounded-overlay border p-4 shadow-lift">
            <p className="font-body type-body-md">A sheet on the page surface.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button>Confirm</Button>
              <Button variant="outline">Cancel</Button>
            </div>
            <div className="absolute right-4 bottom-4 left-4" data-sonner-toaster>
              <div data-sonner-toast data-styled="true">
                Saved
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  ),
};
