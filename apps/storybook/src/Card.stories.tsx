import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, Panel } from "@macro88/ui";

function Surfaces() {
  return (
    <div className="grid max-w-prose gap-4">
      <Card>
        <p className="type-body-md">Card body</p>
      </Card>
      <Panel>
        <h2 className="type-display-sm">Panel</h2>
        <p className="type-body-md">Supporting line.</p>
      </Panel>
    </div>
  );
}

const meta = {
  title: "Card",
  component: Surfaces,
} satisfies Meta<typeof Surfaces>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SurfacesStory: Story = { name: "Surfaces" };
