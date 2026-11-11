import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "@macro88/ui";
import { statusRoles } from "@macro88/tokens";

function StatusBadges() {
  return (
    <div className="flex flex-wrap gap-2">
      {statusRoles.map((status) => (
        <Badge key={status} status={status}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      ))}
    </div>
  );
}

const meta = {
  title: "Badge",
  component: StatusBadges,
} satisfies Meta<typeof StatusBadges>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Statuses: Story = {};
