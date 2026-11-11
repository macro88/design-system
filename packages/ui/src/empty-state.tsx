import { type ReactNode } from "react";

export type EmptyStateProps = {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
};

export function EmptyState({ title, children, action }: EmptyStateProps) {
  return (
    <div className="grid max-w-prose gap-3">
      <h2 className="type-display-sm text-text">{title}</h2>
      {children ? <p className="type-body-md text-muted">{children}</p> : null}
      {action ? <div>{action}</div> : null}
    </div>
  );
}
