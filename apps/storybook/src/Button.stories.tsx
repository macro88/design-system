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
const variants = ["primary", "outline", "ghost", "danger"] as const;

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
