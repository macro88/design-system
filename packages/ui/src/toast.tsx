import { useEffect } from "react";
import { Toaster as SonnerToaster, toast } from "sonner";
import { Button } from "./button";
import { readToken } from "./read-token";

let nextToastId = 0;

type Kind = "success" | "error" | "undo";

type Entry = {
  kind: Kind;
  remaining: number;
  deadline: number | null;
  handle: number | null;
  held: boolean;
  hidden: boolean;
};

const entries = new Map<string, Entry>();
const order: string[] = [];
const visibleLimit = 3;

function createToastId(): string {
  nextToastId += 1;
  return `toast-${nextToastId}`;
}

function durationToken(kind: Kind): string | null {
  if (kind === "success") return "--toast-duration-success";
  if (kind === "undo") return "--toast-duration-undo";
  return null;
}

function toastElement(id: string): HTMLElement | null {
  const inner = document.querySelector(`[data-toast-id="${CSS.escape(id)}"]`);
  const host = inner?.closest("[data-sonner-toast]");
  return host instanceof HTMLElement ? host : null;
}

function isVisible(id: string): boolean {
  const node = toastElement(id);
  if (!node) return true;
  return node.getAttribute("data-visible") !== "false";
}

function toastId(node: Element | null): string | null {
  if (!node) return null;
  const marked = node.closest("[data-toast-id]");
  if (marked) return marked.getAttribute("data-toast-id");
  const host = node.closest("[data-sonner-toast]");
  return host?.querySelector("[data-toast-id]")?.getAttribute("data-toast-id") ?? null;
}

function clearHandle(entry: Entry) {
  if (entry.handle) window.clearTimeout(entry.handle);
  entry.handle = null;
  entry.deadline = null;
}

function drop(id: string) {
  const entry = entries.get(id);
  if (entry) clearHandle(entry);
  entries.delete(id);
  const index = order.indexOf(id);
  if (index >= 0) order.splice(index, 1);
}

function dismiss(id: string) {
  drop(id);
  toast.dismiss(id);
}

function shouldRun(entry: Entry) {
  return entry.kind !== "error" && !entry.held && !entry.hidden;
}

function arm(id: string) {
  const entry = entries.get(id);
  if (!entry || entry.kind === "error") return;
  if (!shouldRun(entry)) {
    if (entry.deadline !== null) {
      entry.remaining = Math.max(0, entry.deadline - Date.now());
    }
    clearHandle(entry);
    return;
  }
  if (entry.handle) return;
  entry.deadline = Date.now() + entry.remaining;
  entry.handle = window.setTimeout(() => {
    const current = entries.get(id);
    if (!current) return;
    current.handle = null;
    current.deadline = null;
    if (current.held || !isVisible(id)) {
      current.hidden = !isVisible(id);
      const token = durationToken(current.kind);
      if (token) current.remaining = readToken(token);
      return;
    }
    dismiss(id);
  }, entry.remaining) as unknown as number;
}

function syncVisibility(id: string) {
  const entry = entries.get(id);
  if (!entry || entry.kind === "error") return;
  const hidden = !isVisible(id);
  if (hidden === entry.hidden) return;
  entry.hidden = hidden;
  arm(id);
}

function evictOverflow() {
  const live = order.filter((id) => entries.has(id));
  while (live.length > visibleLimit) {
    const victim = live.find((id) => entries.get(id)?.kind === "success");
    if (!victim) return;
    dismiss(victim);
    live.splice(live.indexOf(victim), 1);
  }
}

function register(id: string, kind: Kind) {
  const token = durationToken(kind);
  entries.set(id, {
    kind,
    remaining: token ? readToken(token) : 0,
    deadline: null,
    handle: null,
    held: false,
    hidden: false,
  });
  order.push(id);
  arm(id);
  evictOverflow();
}

function hold(id: string) {
  const entry = entries.get(id);
  if (!entry) return;
  entry.held = true;
  arm(id);
}

function release(id: string) {
  const entry = entries.get(id);
  if (!entry) return;
  const node = toastElement(id);
  const hovered = node?.matches(":hover") ?? false;
  const focused = node?.contains(document.activeElement) ?? false;
  if (hovered || focused) return;
  entry.held = false;
  arm(id);
}

function makeRoom() {
  const live = order.filter((id) => entries.has(id));
  if (live.length < visibleLimit) return;
  const victim = live.find((id) => entries.get(id)?.kind === "success");
  if (victim) dismiss(victim);
}

function show(kind: Kind, message: string, action?: { label: string; onClick: () => void }) {
  const id = createToastId();
  makeRoom();
  toast.custom(
    (toastId) => (
      <div
        data-toast-id={String(toastId)}
        role={kind === "error" ? "alert" : "status"}
        className="flex items-center justify-between gap-3"
      >
        <p>{message}</p>
        <div className="flex gap-2">
          {action ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                drop(String(toastId));
                action.onClick();
                toast.dismiss(toastId);
              }}
            >
              {action.label}
            </Button>
          ) : null}
          {kind === "error" ? (
            <Button
              variant="ghost"
              size="sm"
              aria-label="Close"
              onClick={() => dismiss(String(toastId))}
            >
              Close
            </Button>
          ) : null}
        </div>
      </div>
    ),
    {
      id,
      duration: Number.POSITIVE_INFINITY,
      classNames: kind === "error" ? { toast: "toast-error" } : undefined,
    },
  );
  register(id, kind);
  return id;
}

export function showSuccess(message: string) {
  return show("success", message);
}

export function showError(message: string) {
  return show("error", message);
}

export function showUndo(message: string, onUndo: () => void) {
  return show("undo", message, { label: "Undo", onClick: onUndo });
}

function watchTarget(target: EventTarget | null, fn: (id: string) => void) {
  const id = toastId(target instanceof Element ? target : null);
  if (id) fn(id);
}

export function Toaster() {
  useEffect(() => {
    const pointerOver = (event: Event) => watchTarget(event.target, hold);
    const pointerOut = (event: Event) => watchTarget(event.target, release);
    const focusIn = (event: Event) => watchTarget(event.target, hold);
    const focusOut = (event: Event) => watchTarget(event.target, release);
    const observer = new MutationObserver(() => {
      for (const id of entries.keys()) syncVisibility(id);
    });

    document.addEventListener("pointerover", pointerOver);
    document.addEventListener("pointerout", pointerOut);
    document.addEventListener("focusin", focusIn);
    document.addEventListener("focusout", focusOut);
    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ["data-visible"],
    });

    return () => {
      document.removeEventListener("pointerover", pointerOver);
      document.removeEventListener("pointerout", pointerOut);
      document.removeEventListener("focusin", focusIn);
      document.removeEventListener("focusout", focusOut);
      observer.disconnect();
      for (const id of [...entries.keys()]) drop(id);
    };
  }, []);

  return (
    <SonnerToaster
      position="bottom-center"
      visibleToasts={visibleLimit}
      gap={readToken("--toast-gap")}
      offset="var(--toast-offset)"
      duration={Number.POSITIVE_INFINITY}
    />
  );
}
