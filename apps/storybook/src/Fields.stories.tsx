import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input, Select, Textarea } from "@macro88/ui";

const options = [
  { value: "one", label: "One" },
  { value: "two", label: "Two" },
];

function Fields() {
  return (
    <div className="grid w-full max-w-prose gap-6">
      <Input label="Name" placeholder="Given name" />
      <Input label="Name" error="Enter a name." defaultValue="" />
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

export const States: Story = {};
