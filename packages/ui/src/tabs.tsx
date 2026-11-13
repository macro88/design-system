import { focusRingClass } from "@macro88/tokens";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { type ComponentProps } from "react";
import { cx } from "./cx";

export function Tabs(props: ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root {...props} />;
}

export function TabsList({ className, ...props }: ComponentProps<typeof TabsPrimitive.List>) {
  return <TabsPrimitive.List {...props} className={cx("flex flex-wrap gap-1", className)} />;
}

export function TabsTrigger({ className, ...props }: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      {...props}
      className={cx(
        "tabs-trigger inline-flex h-control items-center justify-center rounded-control px-3 font-display text-text outline-none",
        focusRingClass,
        className,
      )}
    />
  );
}

export function TabsContent({ className, ...props }: ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      {...props}
      className={cx(
        "type-body-md font-body pt-3 text-text outline-none",
        focusRingClass,
        className,
      )}
    />
  );
}
