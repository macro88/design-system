import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "@macro88/ui";

function Sizes() {
  return (
    <div className="flex items-center gap-4">
      <Avatar name="Ada Lovelace" size="sm" />
      <Avatar name="Ada Lovelace" size="md" />
      <Avatar name="Ada Lovelace" size="lg" />
    </div>
  );
}

const meta = {
  title: "Avatar",
  component: Sizes,
} satisfies Meta<typeof Sizes>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Initials: Story = {};
