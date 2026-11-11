import { useEffect } from "react";
import { Toaster as SonnerToaster, toast } from "sonner";

let nextToastId = 0;

function createToastId(): string {
  nextToastId += 1;
  return `toast-${nextToastId}`;
}

type Timer = {
  remaining: number;
  deadline: number | null;
  handle: number | null;
  paused: boolean;
};

const timers = new Map<string, Timer>();

function readMs(name: string, fallback: number): number {
  if (typeof window === "undefined") return fallback;
  const inline = document.documentElement.style.getPropertyValue(name).trim();
  const raw =
    inline || window.getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) ? value : fallback;
}

function readPx(name: string, fallback: number): number {
  if (typeof window === "undefined") return fallback;
  const raw = window.getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (raw.endsWith("rem")) {
    const root =
      Number.parseFloat(window.getComputedStyle(document.documentElement).fontSize) || 16;
    return Number.parseFloat(raw) * root;
  }
  if (raw.endsWith("px") || raw.endsWith("ms")) return Number.parseFloat(raw);
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) ? value : fallback;
}

function clearTimer(id: string) {
  const timer = timers.get(id);
  if (timer?.handle) window.clearTimeout(timer.handle);
  timers.delete(id);
}

function arm(id: string, duration: number) {
  clearTimer(id);
  const timer: Timer = {
    remaining: duration,
    deadline: Date.now() + duration,
    handle: null,
    paused: false,
  };
  timer.handle = window.setTimeout(() => {
    timers.delete(id);
    toast.dismiss(id);
  }, duration) as unknown as number;
  timers.set(id, timer);
}

function pause(id: string) {
  const timer = timers.get(id);
  if (!timer || timer.paused || timer.deadline === null) return;
  timer.remaining = Math.max(0, timer.deadline - Date.now());
  if (timer.handle) window.clearTimeout(timer.handle);
  timer.handle = null;
  timer.deadline = null;
  timer.paused = true;
}

function resume(id: string) {
  const timer = timers.get(id);
  if (!timer || !timer.paused) return;
  timer.paused = false;
  timer.deadline = Date.now() + timer.remaining;
  timer.handle = window.setTimeout(() => {
    timers.delete(id);
    toast.dismiss(id);
  }, timer.remaining) as unknown as number;
}

function toastId(node: Element | null): string | null {
  const toastNode = node?.closest("[data-sonner-toast]");
  return toastNode?.getAttribute("data-testid") ?? null;
}

export function showSuccess(message: string) {
  const id = createToastId();
  toast.success(message, { id, duration: Number.POSITIVE_INFINITY, testId: id });
  arm(id, readMs("--toast-duration-success", 4000));
  return id;
}

export function showError(message: string) {
  const id = createToastId();
  toast.error(message, { id, duration: Number.POSITIVE_INFINITY, testId: id });
  return id;
}

export function showUndo(message: string, onUndo: () => void) {
  const id = createToastId();
  toast(message, {
    id,
    duration: Number.POSITIVE_INFINITY,
    testId: id,
    action: {
      label: "Undo",
      onClick: () => {
        clearTimer(id);
        onUndo();
      },
    },
  });
  arm(id, readMs("--toast-duration-undo", 6000));
  return id;
}

export function Toaster() {
  useEffect(() => {
    function hold(target: EventTarget | null) {
      const id = toastId(target instanceof Element ? target : null);
      if (id) pause(id);
    }

    function release(target: EventTarget | null) {
      const id = toastId(target instanceof Element ? target : null);
      if (!id) return;
      const node = document.querySelector(`[data-sonner-toast][data-testid="${id}"]`);
      const hovered = node?.matches(":hover") ?? false;
      const focused = node?.contains(document.activeElement) ?? false;
      if (!hovered && !focused) resume(id);
    }

    const pointerOver = (event: Event) => hold(event.target);
    const pointerOut = (event: Event) => release(event.target);
    const focusIn = (event: Event) => hold(event.target);
    const focusOut = (event: Event) => release(event.target);

    document.addEventListener("pointerover", pointerOver);
    document.addEventListener("pointerout", pointerOut);
    document.addEventListener("focusin", focusIn);
    document.addEventListener("focusout", focusOut);
    return () => {
      document.removeEventListener("pointerover", pointerOver);
      document.removeEventListener("pointerout", pointerOut);
      document.removeEventListener("focusin", focusIn);
      document.removeEventListener("focusout", focusOut);
    };
  }, []);

  return (
    <SonnerToaster
      position="bottom-center"
      visibleToasts={3}
      gap={readPx("--toast-gap", 8)}
      offset="var(--toast-offset)"
      duration={Number.POSITIVE_INFINITY}
    />
  );
}
