import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input, RadioGroup, Switch } from "@macro88/ui";

function Controls() {
  return (
    <div className="bg-bg text-text grid w-full max-w-prose gap-6 p-6">
      <RadioGroup
        label="Schedule"
        defaultValue="weekly"
        options={[
          { value: "weekly", label: "Weekly", description: "Repeats every week." },
          { value: "once", label: "Once" },
          { value: "paused", label: "Paused", disabled: true },
        ]}
      />
      <Input label="Note" placeholder="Shown after the group" />
      <Switch label="Off" />
      <Switch label="On" defaultChecked />
      <Switch label="Disabled" disabled />
    </div>
  );
}

const meta = {
  title: "Controls",
  component: Controls,
} satisfies Meta<typeof Controls>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NostrLight: Story = {
  name: "nostr · light",
  globals: { theme: "nostr", scheme: "light" },
};
export const NostrDark: Story = {
  name: "nostr · dark",
  globals: { theme: "nostr", scheme: "dark" },
};
export const RuniflyLight: Story = {
  name: "runifly · light",
  globals: { theme: "runifly", scheme: "light" },
};
export const RuniflyDark: Story = {
  name: "runifly · dark",
  globals: { theme: "runifly", scheme: "dark" },
};
export const ExosquareLight: Story = {
  name: "exosquare · light",
  globals: { theme: "exosquare", scheme: "light" },
};
export const ExosquareDark: Story = {
  name: "exosquare · dark",
  globals: { theme: "exosquare", scheme: "dark" },
};
