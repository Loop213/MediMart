import { BarChart3, BadgePercent, PackageCheck, Pill, Settings2, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/admin", label: "Dashboard", icon: BarChart3 },
  { to: "/admin/orders", label: "Orders", icon: PackageCheck },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/medicines", label: "Products", icon: Pill },
  { to: "/admin/coupons", label: "Coupons", icon: BadgePercent },
  { to: "/admin/footer", label: "Settings", icon: Settings2 },
];

export function AdminShell({ title, description, actions, children }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="h-fit rounded-[28px] border border-white/70 bg-white/75 p-4 shadow-panel backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <p className="px-3 pb-3 text-xs font-black uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
          Admin Navigation
        </p>
        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/admin"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-brand-600 text-white shadow-panel"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`
                }
              >
                <Icon size={18} />
                {link.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand-600">Admin Workspace</p>
            <h1 className="text-3xl font-black">{title}</h1>
            {description ? <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</p> : null}
          </div>
          {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
        </div>
        {children}
      </section>
    </div>
  );
}
