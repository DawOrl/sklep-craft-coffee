import type { ElementType, ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  /** Rendered element (default "div"), e.g. "section", "footer". */
  as?: ElementType<{ className?: string; children?: ReactNode }>;
}

/** Page container per DESIGN.md §5: mx-auto max-w-[88rem] px-6 md:px-10. */
export function Container({ children, className, as: Tag = "div" }: ContainerProps) {
  return (
    <Tag className={`mx-auto w-full max-w-[88rem] px-6 md:px-10 ${className ?? ""}`}>
      {children}
    </Tag>
  );
}

export default Container;
