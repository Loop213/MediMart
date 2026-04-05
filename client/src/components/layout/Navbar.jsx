import { useState } from "react";
import { Moon, Sun, ShoppingCart, Pill, Search, UserCircle } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "@/features/theme/themeSlice";
import { Button } from "@/components/ui/Button";
import { logout } from "@/features/auth/authSlice";
import { Input } from "@/components/ui/Input";

export function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mode } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.auth);
  const cartCount = useSelector((state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0));
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleSearch = (event) => {
    if (event.key !== "Enter") return;
    const query = searchQuery.trim();
    navigate(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-white/70 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-panel">
            <Pill size={22} />
          </div>
          <div>
            <p className="text-lg font-extrabold tracking-tight">MediMart</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Trusted pharmacy delivered fast</p>
          </div>
        </Link>

        <div className="hidden max-w-xl flex-1 lg:block">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onKeyDown={handleSearch}
              className="rounded-full border-white/70 bg-white/90 pl-11 dark:border-slate-700 dark:bg-slate-900"
              placeholder="Search medicines and press Enter"
            />
          </div>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          {[
            ["/", "Home"],
            ["/medicines", "Medicines"],
            ["/orders", "My Orders"],
          ]
            .concat(user ? [["/profile", "Profile"]] : [])
            .map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `text-sm font-semibold ${isActive ? "text-brand-600" : "text-slate-600 dark:text-slate-300"}`
              }
            >
              {label}
            </NavLink>
            ))}
          {user?.role === "admin" && (
            <NavLink to="/admin" className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Admin
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" className="h-11 w-11 rounded-2xl p-0" onClick={() => dispatch(toggleTheme())}>
            {mode === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </Button>
          <Link to="/cart" className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 rounded-full bg-brand-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          {user ? (
            <>
              <Link
                to="/profile"
                className="hidden items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold dark:bg-slate-800 sm:flex"
              >
                <UserCircle size={18} />
                {user.name.split(" ")[0]}
              </Link>
              <Button variant="secondary" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
