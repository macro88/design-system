import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input, Select, Textarea } from "@macro88/ui";

const options = [
  { value: "one", label: "One" },
  { value: "two", label: "Two" },
];

function Fields() {
  return (
    <div className="bg-bg text-text grid w-full max-w-prose gap-6 p-6">
      <Input label="Name" placeholder="Given name" hint="As it should be read." />
      <Input label="Name" error="Enter a name." autoFocus />
      <Textarea label="Message" placeholder="A short line" hint="Optional." />
      <Select label="City" options={options} placeholder="Choose" />
      <Select label="City" options={options} error="Choose a city." />
    </div>
  );
}

const meta = {
  title: "Fields",
  component: Fields,
} satisfies Meta<typeof Fields>;

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
