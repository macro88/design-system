import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Icon,
  IconButton,
  Input,
  Panel,
  SegmentedControl,
  Select,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  typeClass,
} from "@macro88/ui";
import { statusTones } from "@macro88/tokens";

function Mark() {
  return (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8" />
    </svg>
  );
}

function CoreGallery() {
  return (
    <div className="bg-bg text-text grid gap-6 p-6">
      <header className="grid gap-1">
        <p className={`${typeClass.eyebrow} text-muted`}>Temporary palette</p>
        <h1 className={typeClass.displayMd}>Core</h1>
      </header>
      <div className="flex flex-wrap items-center gap-3">
        <Button>Save</Button>
        <Button variant="outline">Edit</Button>
        <Button variant="ghost">Dismiss</Button>
        <Button pending>Save</Button>
        <Button disabled>Save</Button>
        <IconButton label="Close">
          <Icon>
            <Mark />
          </Icon>
        </IconButton>
        <Avatar name="Ada Lovelace" />
      </div>
      <div className="flex flex-wrap gap-2">
        {statusTones.map((tone) => (
          <Badge key={tone} tone={tone}>
            {tone.charAt(0).toUpperCase() + tone.slice(1)}
          </Badge>
        ))}
      </div>
      <SegmentedControl
        label="Layout"
        defaultValue="list"
        options={[
          { value: "list", label: "List" },
          { value: "grid", label: "Grid" },
        ]}
      />
      <Tabs defaultValue="one">
        <TabsList aria-label="Kinds">
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger value="two">Two</TabsTrigger>
        </TabsList>
        <TabsContent value="one">First panel</TabsContent>
        <TabsContent value="two">Second panel</TabsContent>
      </Tabs>
      <div className="grid max-w-prose gap-4">
        <Input label="Name" placeholder="Given name" />
        <Textarea label="Message" hint="Optional." placeholder="A short line" />
        <Select
          label="City"
          options={[
            { value: "one", label: "One" },
            { value: "two", label: "Two" },
          ]}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <p className={typeClass.bodyMd}>Card body</p>
        </Card>
        <Panel>
          <h2 className={typeClass.displaySm}>Panel</h2>
          <p className={typeClass.bodyMd}>Supporting line.</p>
        </Panel>
      </div>
    </div>
  );
}

const meta = {
  title: "Core",
  component: CoreGallery,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof CoreGallery>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Gallery: Story = {};
