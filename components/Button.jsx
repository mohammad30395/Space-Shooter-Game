import Link from "next/link";

const variants = {
  primary: "border-cyan-300/40 bg-cyan-300 text-slate-950 shadow-glow hover:bg-white",
  secondary: "border-white/15 bg-white/10 text-white hover:border-cyan-200/50 hover:bg-white/15",
  danger: "border-rose-300/40 bg-rose-500/90 text-white hover:bg-rose-400",
  ghost: "border-transparent bg-transparent text-slate-200 hover:bg-white/10"
};

const sizes = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-12 px-6 text-base"
};

export default function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  type = "button",
  ...props
}) {
  const classes = [
    "inline-flex items-center justify-center gap-2 rounded-lg border font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-200/70 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-45",
    variants[variant],
    sizes[size],
    className
  ].join(" ");

  if (href && !disabled) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
