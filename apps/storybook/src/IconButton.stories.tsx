import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon, IconButton } from "@macro88/ui";

function Mark() {
  return (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8" />
    </svg>
  );
}

const meta = {
  title: "IconButton",
  component: IconButton,
  args: {
    label: "Close",
    children: (
      <Icon>
        <Mark />
      </Icon>
    ),
  },
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Small: Story = { args: { size: "sm" } };
export const Large: Story = { args: { size: "lg" } };
export const Disabled: Story = { args: { disabled: true } };
