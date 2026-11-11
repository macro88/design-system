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
export const Pending: Story = { args: { children: "Save", pending: true } };
export const Disabled: Story = { args: { children: "Save", disabled: true } };
export const Small: Story = { args: { children: "Save", size: "sm" } };
export const Large: Story = { args: { children: "Save", size: "lg" } };
