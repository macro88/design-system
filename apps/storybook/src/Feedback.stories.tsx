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
