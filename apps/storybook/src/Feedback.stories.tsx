import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  ConfirmSheet,
  EmptyState,
  InlineError,
  Skeleton,
  Textarea,
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
  const [destructiveOpen, setDestructiveOpen] = useState(false);
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
        <Button variant="danger" onClick={() => setDestructiveOpen(true)}>
          Open destructive sheet
        </Button>
      </div>
      <ConfirmSheet
        open={open}
        onOpenChange={setOpen}
        title="Continue?"
        description="This keeps the item."
        confirmLabel="Continue"
        onConfirm={() => undefined}
      />
      <ConfirmSheet
        open={destructiveOpen}
        onOpenChange={setDestructiveOpen}
        title="Remove this item?"
        description="This cannot be undone."
        confirmLabel="Remove"
        destructive
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

function QueueRow({
  when,
  status,
  failed = false,
  children,
}: {
  when: string;
  status: string;
  failed?: boolean;
  children: string;
}) {
  return (
    <div className="grid gap-1 border-b border-border py-3">
      <div className="flex items-center justify-between gap-3">
        <p className="type-caption text-muted">{when}</p>
        {failed ? <Badge tone="danger">{status}</Badge> : <p className="type-caption">{status}</p>}
      </div>
      <p className="type-body-md font-body">{children}</p>
    </div>
  );
}

function OpenSheetWithToast() {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    showSuccess("Saved");
  }, []);

  return (
    <div className="bg-bg text-text grid min-h-screen content-start gap-6 p-6">
      <Toaster />
      <Card>
        <p className="type-eyebrow text-muted">This week</p>
        <h1 className="type-display-sm">Queue</h1>
      </Card>
      <div className="grid max-w-prose border-t border-border">
        <QueueRow when="Monday 09:00" status="Draft">
          The relay list stays out of the note.
        </QueueRow>
        <QueueRow when="Tuesday 18:30" status="Queued">
          Ship the week note after the sign-off.
        </QueueRow>
        <QueueRow when="Wednesday 12:00" status="Failed" failed>
          The relay did not accept this one.
        </QueueRow>
      </div>
      <div className="max-w-prose">
        <Textarea label="Note" defaultValue="A short note for Thursday morning." />
      </div>
      <ConfirmSheet
        open={open}
        onOpenChange={setOpen}
        title="Remove this item?"
        description="This cannot be undone."
        confirmLabel="Remove"
        destructive
        onConfirm={() => undefined}
      />
    </div>
  );
}

export const ToastOverSheet: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Remove uses the danger button. An open sheet keeps the toast clear of Cancel and Remove.",
      },
    },
  },
  render: () => <OpenSheetWithToast />,
};

function DestructiveConfirm() {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-bg text-text grid min-h-screen content-start gap-6 p-6">
      <Button variant="danger" className="justify-self-start">
        Remove
      </Button>
      <ConfirmSheet
        open={open}
        onOpenChange={setOpen}
        title="Remove this item?"
        description="This cannot be undone."
        confirmLabel="Remove"
        destructive
        onConfirm={() => undefined}
      />
    </div>
  );
}

export const DangerSolidNostrLight: Story = {
  name: "danger-solid · nostr · light",
  globals: { theme: "nostr", scheme: "light" },
  render: () => <DestructiveConfirm />,
};
export const DangerSolidNostrDark: Story = {
  name: "danger-solid · nostr · dark",
  globals: { theme: "nostr", scheme: "dark" },
  render: () => <DestructiveConfirm />,
};
export const DangerSolidRuniflyLight: Story = {
  name: "danger-solid · runifly · light",
  globals: { theme: "runifly", scheme: "light" },
  render: () => <DestructiveConfirm />,
};
export const DangerSolidRuniflyDark: Story = {
  name: "danger-solid · runifly · dark",
  globals: { theme: "runifly", scheme: "dark" },
  render: () => <DestructiveConfirm />,
};
export const DangerSolidExosquareLight: Story = {
  name: "danger-solid · exosquare · light",
  globals: { theme: "exosquare", scheme: "light" },
  render: () => <DestructiveConfirm />,
};
export const DangerSolidExosquareDark: Story = {
  name: "danger-solid · exosquare · dark",
  globals: { theme: "exosquare", scheme: "dark" },
  render: () => <DestructiveConfirm />,
};
