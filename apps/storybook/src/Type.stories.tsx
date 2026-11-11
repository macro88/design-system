import type { Meta, StoryObj } from "@storybook/react-vite";
import { typeClass } from "@macro88/ui";

function Scale() {
  return (
    <div className="grid max-w-prose gap-3 text-text">
      <p className={typeClass.displayLg}>Display large</p>
      <p className={typeClass.displayMd}>Display medium</p>
      <p className={typeClass.displaySm}>Display small</p>
      <p className={typeClass.bodyLg}>Body large</p>
      <p className={typeClass.bodyMd}>Body medium</p>
      <p className={typeClass.bodySm}>Body small</p>
      <p className={typeClass.caption}>Caption</p>
      <p className={`${typeClass.eyebrow} text-muted`}>Eyebrow</p>
      <p className={`${typeClass.caption} ${typeClass.tabular} text-muted`}>09:00 · 142</p>
    </div>
  );
}

const meta = {
  title: "Type",
  component: Scale,
} satisfies Meta<typeof Scale>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ScaleStory: Story = { name: "Scale" };
