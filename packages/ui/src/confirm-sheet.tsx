import { reducedMotion, spring } from "@macro88/motion";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Button } from "./button";

function readPx(name: string, fallback: number): number {
  if (typeof window === "undefined") return fallback;
  const raw = window.getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (raw.endsWith("rem")) {
    const root =
      Number.parseFloat(window.getComputedStyle(document.documentElement).fontSize) || 16;
    return Number.parseFloat(raw) * root;
  }
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) ? value : fallback;
}

export type ConfirmSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
};

export function ConfirmSheet({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
}: ConfirmSheetProps) {
  const reduced = useReducedMotion() === true;
  const enter = reduced ? 0 : readPx("--sheet-enter", 28);
  const exit = reduced ? 0 : readPx("--sheet-exit", 16);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay className="sheet-overlay" />
            <Dialog.Content asChild forceMount>
              <motion.div
                className="sheet"
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: enter }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: exit }}
                transition={reducedMotion(
                  spring.lively,
                  reduced,
                  reduced ? "opacity" : "transform",
                )}
              >
                <Dialog.Title className="type-display-sm">{title}</Dialog.Title>
                <Dialog.Description className="type-body-md mt-2 text-muted">
                  {description}
                </Dialog.Description>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    {cancelLabel}
                  </Button>
                  <Button
                    onClick={() => {
                      onConfirm();
                      onOpenChange(false);
                    }}
                  >
                    {confirmLabel}
                  </Button>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}
