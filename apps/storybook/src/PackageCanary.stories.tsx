import type { Meta, StoryObj } from "@storybook/react-vite";
import { packageName } from "@macro88/design-system";

function PackageCanary() {
  return <p>{packageName}</p>;
}

const meta = {
  title: "Canary",
  component: PackageCanary,
} satisfies Meta<typeof PackageCanary>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
