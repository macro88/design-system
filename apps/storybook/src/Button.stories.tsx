import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@macro88/ui";

const meta = {
  title: "Button",
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { children: "Save", variant: "primary" } };
export const Outline: Story = { args: { children: "Edit", variant: "outline" } };
export const Ghost: Story = { args: { children: "Dismiss", variant: "ghost" } };
const variants = ["primary", "outline", "ghost", "danger", "danger-solid"] as const;

function DangerSolidButton() {
  return (
    <div className="bg-bg text-text p-6">
      <Button variant="danger-solid">Remove</Button>
    </div>
  );
}

export const DangerSolidNostrLight: Story = {
  name: "danger-solid · nostr · light",
  globals: { theme: "nostr", scheme: "light" },
  render: () => <DangerSolidButton />,
};
export const DangerSolidNostrDark: Story = {
  name: "danger-solid · nostr · dark",
  globals: { theme: "nostr", scheme: "dark" },
  render: () => <DangerSolidButton />,
};
export const DangerSolidRuniflyLight: Story = {
  name: "danger-solid · runifly · light",
  globals: { theme: "runifly", scheme: "light" },
  render: () => <DangerSolidButton />,
};
export const DangerSolidRuniflyDark: Story = {
  name: "danger-solid · runifly · dark",
  globals: { theme: "runifly", scheme: "dark" },
  render: () => <DangerSolidButton />,
};
export const DangerSolidExosquareLight: Story = {
  name: "danger-solid · exosquare · light",
  globals: { theme: "exosquare", scheme: "light" },
  render: () => <DangerSolidButton />,
};
export const DangerSolidExosquareDark: Story = {
  name: "danger-solid · exosquare · dark",
  globals: { theme: "exosquare", scheme: "dark" },
  render: () => <DangerSolidButton />,
};

export const Pending: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {variants.map((variant) => (
        <Button key={variant} variant={variant} pending>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="grid gap-3">
      {variants.map((variant) => (
        <div key={variant} className="flex flex-wrap items-center gap-3">
          <Button variant={variant} disabled>
            {variant} disabled
          </Button>
          <Button variant={variant} pending>
            {variant} pending
          </Button>
        </div>
      ))}
    </div>
  ),
};
export const Small: Story = { args: { children: "Edit", variant: "outline", size: "sm" } };
export const Large: Story = { args: { children: "Save", size: "lg" } };
