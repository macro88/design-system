import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@macro88/ui";

function KindTabs() {
  return (
    <Tabs defaultValue="one">
      <TabsList aria-label="Kinds">
        <TabsTrigger value="one">One</TabsTrigger>
        <TabsTrigger value="two">Two</TabsTrigger>
        <TabsTrigger value="three">Three</TabsTrigger>
      </TabsList>
      <TabsContent value="one">First panel</TabsContent>
      <TabsContent value="two">Second panel</TabsContent>
      <TabsContent value="three">Third panel</TabsContent>
    </Tabs>
  );
}

const meta = {
  title: "Tabs",
  component: KindTabs,
} satisfies Meta<typeof KindTabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
