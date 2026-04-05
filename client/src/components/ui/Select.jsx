export function Select(props) {
  return (
    <select
      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
      {...props}
    />
  );
}
