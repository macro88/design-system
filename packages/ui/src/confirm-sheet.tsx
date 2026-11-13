import { ease, reducedMotion } from "@macro88/motion";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { Button } from "./button";
import { readEase, readToken } from "./read-token";

export type ConfirmSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
};

type ThemeTween = {
  type: "tween";
  duration: number;
  ease: [number, number, number, number];
};

function themeTween(durationToken: string, easeToken: string): ThemeTween {
  return {
    type: "tween",
    duration: readToken(durationToken) / 1000,
    ease: readEase(easeToken),
  };
}

function reducedFade(): ThemeTween {
  const fade = reducedMotion({ type: "tween", duration: 0, ease: ease.linear }, true, "opacity");
  return {
    type: "tween",
    duration: fade.type === "tween" ? fade.duration : 0,
    ease: [0, 0, 1, 1],
  };
}

/** Distances and timings for the sheet and its backdrop, from the active theme. */
export function sheetTiming(reduced: boolean) {
  if (reduced) {
    const fade = reducedFade();
    return {
      enterY: 0,
      exitY: 0,
      sheetEnter: fade,
      sheetExit: fade,
      backdropEnter: fade,
      backdropExit: fade,
    };
  }
  const exit = themeTween("--motion-exit-duration", "--motion-exit-ease");
  return {
    enterY: readToken("--sheet-enter"),
    exitY: readToken("--sheet-exit"),
    sheetEnter: themeTween("--motion-sheet-duration", "--motion-sheet-ease"),
    sheetExit: exit,
    backdropEnter: themeTween("--motion-surface-duration", "--motion-surface-ease"),
    backdropExit: exit,
  };
}

export function ConfirmSheet({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
}: ConfirmSheetProps) {
  const reduced = useReducedMotion() === true;
  const timing = sheetTiming(reduced);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) cancelRef.current?.focus();
  }, [open]);

  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open ? (
          <AlertDialog.Portal forceMount>
            <AlertDialog.Overlay asChild forceMount>
              <motion.div
                className="sheet-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: timing.backdropEnter }}
                exit={{ opacity: 0, transition: timing.backdropExit }}
              />
            </AlertDialog.Overlay>
            <AlertDialog.Content
              asChild
              forceMount
              onOpenAutoFocus={(event) => {
                event.preventDefault();
                cancelRef.current?.focus();
              }}
            >
              <motion.div
                className="sheet"
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: timing.enterY }}
                animate={{ opacity: 1, y: 0, transition: timing.sheetEnter }}
                exit={
                  reduced
                    ? { opacity: 0, transition: timing.sheetExit }
                    : { opacity: 0, y: timing.exitY, transition: timing.sheetExit }
                }
              >
                <AlertDialog.Title className="type-display-sm">{title}</AlertDialog.Title>
                <AlertDialog.Description className="type-body-md font-body mt-2 text-muted">
                  {description}
                </AlertDialog.Description>
                <div className="mt-4 flex flex-wrap gap-2">
                  <AlertDialog.Cancel asChild>
                    <Button ref={cancelRef} variant="outline">
                      {cancelLabel}
                    </Button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action asChild>
                    <Button variant={destructive ? "danger" : "primary"} onClick={onConfirm}>
                      {confirmLabel}
                    </Button>
                  </AlertDialog.Action>
                </div>
              </motion.div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        ) : null}
      </AnimatePresence>
    </AlertDialog.Root>
  );
}
