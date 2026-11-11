import type { Meta, StoryObj } from "@storybook/react-vite";
import { SegmentedControl } from "@macro88/ui";

const meta = {
  title: "SegmentedControl",
  component: SegmentedControl,
  args: {
    label: "Layout",
    defaultValue: "list",
    options: [
      { value: "list", label: "List" },
      { value: "grid", label: "Grid" },
    ],
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
