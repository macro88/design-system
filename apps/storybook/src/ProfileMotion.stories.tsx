import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  detailPop,
  detailPush,
  fieldCollapse,
  fieldExpand,
  transitionsReduced,
} from "@macro88/theme-nostr";

type Ease = readonly [number, number, number, number];

function curve(ease: Ease) {
  return `cubic-bezier(${ease.join(", ")})`;
}

function fade(duration: number, ease: Ease) {
  return `opacity ${duration}s ${curve(ease)}`;
}

function ReducedToggle({
  quiet,
  onChange,
}: {
  quiet: boolean;
  onChange: (quiet: boolean) => void;
}) {
  return (
    <label className="font-display type-caption flex items-center gap-2">
      <input type="checkbox" checked={quiet} onChange={(event) => onChange(event.target.checked)} />
      Reduced motion
    </label>
  );
}

function FieldCollapseStory() {
  const [open, setOpen] = useState(true);
  const [quiet, setQuiet] = useState(false);
  const move = quiet ? transitionsReduced.fieldCollapse : fieldCollapse;
  const shown = open ? move.incoming : move.outgoing;
  return (
    <section className="bg-bg text-text grid max-w-prose gap-3 p-4">
      <h2 className="font-display type-body-md">Field collapse</h2>
      <ReducedToggle quiet={quiet} onChange={setQuiet} />
      <button
        type="button"
        className="font-display type-body-sm"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Collapse" : "Expand"}
      </button>
      <p
        className="font-body type-body-md"
        style={{
          opacity: shown.opacity,
          transition: fade(shown.transition.duration, shown.transition.ease),
        }}
      >
        A conditional field.
      </p>
    </section>
  );
}

function FieldExpandStory() {
  const [open, setOpen] = useState(false);
  const [quiet, setQuiet] = useState(false);
  const move = quiet ? transitionsReduced.fieldExpand : fieldExpand;
  const shown = open ? move.incoming : move.outgoing;
  return (
    <section className="bg-bg text-text grid max-w-prose gap-3 p-4">
      <h2 className="font-display type-body-md">Field expand</h2>
      <ReducedToggle quiet={quiet} onChange={setQuiet} />
      <button
        type="button"
        className="font-display type-body-sm"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Collapse" : "Expand"}
      </button>
      <p
        className="font-body type-body-md"
        style={{
          opacity: shown.opacity,
          transition: fade(shown.transition.duration, shown.transition.ease),
        }}
      >
        A conditional field.
      </p>
    </section>
  );
}

function DetailPushStory() {
  const [on, setOn] = useState(false);
  const [quiet, setQuiet] = useState(false);
  const move = quiet ? transitionsReduced.detailPush : detailPush;
  const detail = on ? move.detail.animate : move.detail.initial;
  const detailTransition = move.detail.animate.transition;
  const list = on
    ? move.list.exit
    : { opacity: 1 as const, x: 0 as const, transition: move.list.exit.transition };
  return (
    <section className="bg-bg text-text grid max-w-prose gap-3 overflow-hidden p-4">
      <h2 className="font-display type-body-md">Detail push</h2>
      <ReducedToggle quiet={quiet} onChange={setQuiet} />
      <button
        type="button"
        className="font-display type-body-sm"
        onClick={() => setOn((value) => !value)}
      >
        Push detail
      </button>
      <p
        className="font-display type-body-md"
        style={{
          opacity: list.opacity,
          transform: "x" in list ? `translateX(${list.x}px)` : "none",
          transition: fade(list.transition.duration, list.transition.ease),
        }}
      >
        List
      </p>
      <p
        className="font-display type-body-md"
        style={{
          opacity: detail.opacity,
          transform: "x" in detail ? `translateX(${detail.x}px)` : "none",
          transition: fade(detailTransition.duration, detailTransition.ease),
        }}
      >
        Detail
      </p>
    </section>
  );
}

function DetailPopStory() {
  const [on, setOn] = useState(false);
  const [quiet, setQuiet] = useState(false);
  const move = quiet ? transitionsReduced.detailPop : detailPop;
  const detail = on
    ? move.detail.exit
    : { opacity: 1 as const, x: 0 as const, transition: move.detail.exit.transition };
  const list = on ? move.list.animate : move.list.initial;
  const listTransition = move.list.animate.transition;
  return (
    <section className="bg-bg text-text grid max-w-prose gap-3 overflow-hidden p-4">
      <h2 className="font-display type-body-md">Detail pop</h2>
      <ReducedToggle quiet={quiet} onChange={setQuiet} />
      <button
        type="button"
        className="font-display type-body-sm"
        onClick={() => setOn((value) => !value)}
      >
        Pop detail
      </button>
      <p
        className="font-display type-body-md"
        style={{
          opacity: list.opacity,
          transform: "x" in list ? `translateX(${list.x}px)` : "none",
          transition: fade(listTransition.duration, listTransition.ease),
        }}
      >
        List
      </p>
      <p
        className="font-display type-body-md"
        style={{
          opacity: detail.opacity,
          transform: "x" in detail ? `translateX(${detail.x}px)` : "none",
          transition: fade(detail.transition.duration, detail.transition.ease),
        }}
      >
        Detail
      </p>
    </section>
  );
}

const meta = {
  title: "Profile motion",
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const FieldCollapse: Story = { render: () => <FieldCollapseStory /> };
export const FieldExpand: Story = { render: () => <FieldExpandStory /> };
export const DetailPush: Story = { render: () => <DetailPushStory /> };
export const DetailPop: Story = { render: () => <DetailPopStory /> };
