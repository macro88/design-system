import { reducedMotion, spring } from "@macro88/motion";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { Button } from "./button";
import { readToken } from "./read-token";

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
  const enter = reduced ? 0 : readToken("--sheet-enter");
  const exit = reduced ? 0 : readToken("--sheet-exit");
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) cancelRef.current?.focus();
  }, [open]);

  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open ? (
          <AlertDialog.Portal forceMount>
            <AlertDialog.Overlay forceMount className="sheet-overlay" />
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
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: enter }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: exit }}
                transition={reducedMotion(
                  spring.lively,
                  reduced,
                  reduced ? "opacity" : "transform",
                )}
              >
                <AlertDialog.Title className="type-display-sm">{title}</AlertDialog.Title>
                <AlertDialog.Description className="type-body-md mt-2 text-muted">
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
