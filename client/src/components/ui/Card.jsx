import { cn } from "@/lib/utils";

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-white/60 bg-white/85 p-6 shadow-panel backdrop-blur dark:border-slate-800 dark:bg-slate-900/85",
        className
      )}
      {...props}
    />
  );
}
