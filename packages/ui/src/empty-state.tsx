import { type ReactNode } from "react";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type EmptyStateProps = {
  title: string;
  headingLevel?: HeadingLevel;
  children?: ReactNode;
  action?: ReactNode;
};

export function EmptyState({ title, headingLevel = 2, children, action }: EmptyStateProps) {
  const Heading = `h${headingLevel}` as const;

  return (
    <div className="grid max-w-prose gap-3">
      <Heading className="type-display-sm text-text">{title}</Heading>
      {children ? <p className="type-body-md font-body text-muted">{children}</p> : null}
      {action ? <div>{action}</div> : null}
    </div>
  );
}
