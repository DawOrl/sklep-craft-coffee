import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  MouseEventHandler,
  ReactNode,
} from "react";

type ButtonVariant = "solid" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full font-mono uppercase tracking-[0.2em] whitespace-nowrap select-none transition-[color,background-color,border-color,transform] duration-300 active:scale-[0.97] active:duration-100 motion-reduce:transition-none motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-50";

const VARIANTS: Record<ButtonVariant, string> = {
  solid: "bg-gold text-espresso hover:bg-gold-soft",
  outline: "border border-line text-crema hover:border-gold hover:text-gold-soft",
  ghost: "text-crema hover:text-gold",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-9 px-5 text-[10px] pointer-coarse:h-11",
  md: "h-11 px-7 text-[11px]",
  lg: "h-13 px-9 text-xs",
};

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Renders a <Link> instead of <button> when provided. */
  href?: string;
  className?: string;
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLElement>;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "onClick"> &
  Pick<AnchorHTMLAttributes<HTMLAnchorElement>, "target" | "rel">;

/**
 * Primary action element. Variants: solid (gold), outline, ghost.
 * Wrap in <Magnetic> where the design calls for it.
 */
export function Button({
  variant = "solid",
  size = "md",
  href,
  className,
  children,
  onClick,
  type = "button",
  target,
  rel,
  ...rest
}: ButtonProps) {
  const cls = [BASE, VARIANTS[variant], SIZES[size], className]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <Link
        href={href}
        className={cls}
        onClick={onClick}
        target={target}
        rel={rel}
        aria-label={rest["aria-label"]}
      >
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={cls} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}

export default Button;
