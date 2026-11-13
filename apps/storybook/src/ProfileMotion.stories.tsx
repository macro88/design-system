import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@macro88/ui";
import {
  detailPop,
  detailPush,
  fieldCollapse,
  fieldExpand,
  transitionsReduced,
} from "@macro88/theme-nostr";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

function useQuietMotion() {
  const osReduced = useReducedMotion() === true;
  const [forced, setForced] = useState(false);
  return { quiet: osReduced || forced, osReduced, setForced };
}

function ReducedToggle({
  quiet,
  osReduced,
  onChange,
}: {
  quiet: boolean;
  osReduced: boolean;
  onChange: (quiet: boolean) => void;
}) {
  return (
    <label className="font-display type-caption flex items-center gap-2">
      <input
        type="checkbox"
        checked={quiet}
        disabled={osReduced}
        onChange={(event) => onChange(event.target.checked)}
      />
      Reduced motion
    </label>
  );
}

function FieldCollapseStory() {
  const { quiet, osReduced, setForced } = useQuietMotion();
  const [open, setOpen] = useState(true);
  const move = quiet ? transitionsReduced.fieldCollapse : fieldCollapse;
  return (
    <section className="bg-bg text-text grid w-80 gap-3 p-4">
      <h2 className="font-display type-body-md">Field collapse</h2>
      <ReducedToggle quiet={quiet} osReduced={osReduced} onChange={setForced} />
      <Button variant="outline" type="button" onClick={() => setOpen((value) => !value)}>
        {open ? "Collapse" : "Expand"}
      </Button>
      <motion.div
        className="overflow-hidden"
        initial={false}
        animate={
          "height" in move.container
            ? {
                height: open ? "auto" : move.container.height,
                transition: move.container.transition,
              }
            : { transition: move.container.transition }
        }
      >
        <AnimatePresence mode="sync" initial={false}>
          {open ? (
            <motion.p
              key="field"
              className="font-body type-body-md"
              initial={{ opacity: 0 }}
              animate={{
                opacity: move.incoming.opacity,
                transition: move.incoming.transition,
              }}
              exit={{
                opacity: move.outgoing.opacity,
                transition: move.outgoing.transition,
              }}
            >
              A conditional field.
            </motion.p>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

function FieldExpandStory() {
  const { quiet, osReduced, setForced } = useQuietMotion();
  const [open, setOpen] = useState(false);
  const move = quiet ? transitionsReduced.fieldExpand : fieldExpand;
  return (
    <section className="bg-bg text-text grid w-80 gap-3 p-4">
      <h2 className="font-display type-body-md">Field expand</h2>
      <ReducedToggle quiet={quiet} osReduced={osReduced} onChange={setForced} />
      <Button variant="outline" type="button" onClick={() => setOpen((value) => !value)}>
        {open ? "Collapse" : "Expand"}
      </Button>
      <motion.div
        className="overflow-hidden"
        initial={false}
        animate={
          "height" in move.container
            ? {
                height: open ? move.container.height : fieldCollapse.container.height,
                transition: move.container.transition,
              }
            : { transition: move.container.transition }
        }
      >
        <AnimatePresence mode="sync" initial={false}>
          {open ? (
            <motion.p
              key="field"
              className="font-body type-body-md"
              initial={{ opacity: 0 }}
              animate={{
                opacity: move.incoming.opacity,
                transition: move.incoming.transition,
              }}
              exit={{
                opacity: move.outgoing.opacity,
                transition: move.outgoing.transition,
              }}
            >
              A conditional field.
            </motion.p>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

function DetailPushStory() {
  const { quiet, osReduced, setForced } = useQuietMotion();
  const [pushed, setPushed] = useState(false);
  const move = quiet ? transitionsReduced.detailPush : detailPush;
  return (
    <section className="bg-bg text-text grid w-80 gap-3 overflow-hidden p-4">
      <h2 className="font-display type-body-md">Detail push</h2>
      <ReducedToggle quiet={quiet} osReduced={osReduced} onChange={setForced} />
      <Button variant="outline" type="button" onClick={() => setPushed((value) => !value)}>
        {pushed ? "Show list" : "Push detail"}
      </Button>
      <div className="relative h-10">
        <AnimatePresence mode="sync">
          {pushed ? (
            <motion.p
              key="detail"
              className="font-display type-body-md absolute inset-0"
              initial={move.detail.initial}
              animate={move.detail.animate}
            >
              Detail
            </motion.p>
          ) : (
            <motion.p
              key="list"
              className="font-display type-body-md absolute inset-0"
              exit={move.list.exit}
            >
              List
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function DetailPopStory() {
  const { quiet, osReduced, setForced } = useQuietMotion();
  const [popped, setPopped] = useState(false);
  const move = quiet ? transitionsReduced.detailPop : detailPop;
  return (
    <section className="bg-bg text-text grid w-80 gap-3 overflow-hidden p-4">
      <h2 className="font-display type-body-md">Detail pop</h2>
      <ReducedToggle quiet={quiet} osReduced={osReduced} onChange={setForced} />
      <Button variant="outline" type="button" onClick={() => setPopped((value) => !value)}>
        {popped ? "Show detail" : "Pop detail"}
      </Button>
      <div className="relative h-10">
        <AnimatePresence mode="sync">
          {popped ? (
            <motion.p
              key="list"
              className="font-display type-body-md absolute inset-0"
              initial={move.list.initial}
              animate={move.list.animate}
            >
              List
            </motion.p>
          ) : (
            <motion.p
              key="detail"
              className="font-display type-body-md absolute inset-0"
              exit={move.detail.exit}
            >
              Detail
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

const meta = {
  title: "Nostr/Profile motion",
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const FieldCollapse: Story = { render: () => <FieldCollapseStory /> };
export const FieldExpand: Story = { render: () => <FieldExpandStory /> };
export const DetailPush: Story = { render: () => <DetailPushStory /> };
export const DetailPop: Story = { render: () => <DetailPopStory /> };
