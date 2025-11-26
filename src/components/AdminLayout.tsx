import { ReactNode, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  Package,
  Truck,
  Users,
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
  Settings,
  LogOut,
  Search as SearchIcon,
  Bell,
} from "lucide-react";

type AdminLayoutProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

const AdminLayout = ({ title, subtitle, children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const productsActive = location.pathname.startsWith("/admin/products");
  const [productOpen, setProductOpen] = useState(productsActive);

  const linkBase =
    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors";
  const linkInactive = "text-slate-200 hover:bg-slate-800/80";
  const linkActive = "bg-slate-800/90 text-white";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* TOP NAVBAR */}
      <header className="sticky top-0 z-40 h-12 bg-[#1E6DEB] text-white shadow">
        <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between px-3 md:px-6">
          <div className="flex items-center gap-3">
            <button
              className="rounded-md p-1 hover:bg-white/10 md:hidden"
              onClick={() => setSidebarOpen((s) => !s)}
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 font-black tracking-wide">
              <span className="rounded bg-amber-300 px-2 py-[2px] text-slate-900">
                POUT
              </span>
              <span className="hidden text-sm opacity-90 sm:inline">Admin</span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden items-center gap-2 rounded-lg bg-white/10 px-2 py-1 md:flex">
              <SearchIcon className="h-4 w-4 opacity-90" />
              <input
                className="w-48 bg-transparent text-sm placeholder-white/70 focus:outline-none"
                placeholder="Search…"
              />
            </div>

            <button className="rounded-md p-1 hover:bg-white/10">
              <Bell className="h-5 w-5" />
            </button>

            <div className="ml-1 flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-white/80 ring-2 ring-white/40" />
              <span className="hidden text-sm font-semibold md:inline">
                Admin
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* LAYOUT */}
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 md:grid-cols-[260px_1fr]">
        {/* SIDEBAR */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          } fixed inset-y-12 z-30 w-64 bg-slate-900 text-slate-100 transition-transform md:static`}
        >
          <div className="h-full overflow-y-auto">
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4">
              <div className="h-10 w-10 rounded-full bg-slate-700 ring-2 ring-white/10" />
              <div>
                <p className="font-semibold leading-tight">Admin</p>
                <p className="text-xs text-emerald-400">● Online</p>
              </div>
            </div>

            <nav className="px-2 py-4">
              <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Main Navigation
              </p>

              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkInactive}`
                }
                end
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </NavLink>

              <NavLink
                to="/admin/suppliers"
                className={({ isActive }) =>
                  `${linkBase} mt-1 ${isActive ? linkActive : linkInactive}`
                }
              >
                <Truck className="h-4 w-4" />
                Suppliers
              </NavLink>

              {/* PRODUCTS MENU */}
              <div className="mt-1">
                <button
                  type="button"
                  onClick={() => setProductOpen((v) => !v)}
                  className={`${linkBase} w-full justify-between text-left ${
                    productsActive ? linkActive : linkInactive
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Package className="h-4 w-4" />
                    Products
                  </span>

                  {productOpen ? (
                    <ChevronDown className="h-4 w-4 opacity-70" />
                  ) : (
                    <ChevronRight className="h-4 w-4 opacity-70" />
                  )}
                </button>

                {productOpen && (
                  <div className="ml-10 mt-1 space-y-1">
                    <NavLink
                      to="/admin/products"
                      className={({ isActive }) =>
                        `block rounded-md px-3 py-1.5 text-sm ${
                          isActive
                            ? "bg-slate-800/80 text-white"
                            : "text-slate-200 hover:bg-slate-800/60"
                        }`
                      }
                      end
                    >
                      General
                    </NavLink>

                    <NavLink
                      to="/admin/products/inventory"
                      className={({ isActive }) =>
                        `block rounded-md px-3 py-1.5 text-sm ${
                          isActive
                            ? "bg-slate-800/80 text-white"
                            : "text-slate-200 hover:bg-slate-800/60"
                        }`
                      }
                    >
                      Inventory
                    </NavLink>
                  </div>
                )}
              </div>

              <p className="mt-6 px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Settings
              </p>

              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkInactive}`
                }
              >
                <Users className="h-4 w-4" />
                Users
              </NavLink>

              <button
                type="button"
                onClick={() => navigate("/")}
                className={`${linkBase} mt-6 text-slate-200 hover:bg-slate-800/80 w-full`}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </nav>
          </div>
        </aside>

        <main className="min-h-[calc(100vh-3rem)] bg-slate-50 p-4 md:p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
            {subtitle && (
              <p className="text-xs text-slate-500">{subtitle}</p>
            )}
          </div>

          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
