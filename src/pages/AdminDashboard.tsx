import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  Package,
  Truck,
  Users,
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Search,
  Bell,
} from "lucide-react";

const StatCard = ({
  title,
  value,
  icon: Icon,
  bg = "bg-sky-500",
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  bg?: string;
}) => (
  <div className="rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md">
    <div className="flex items-center gap-4 p-4">
      <div className={`grid h-12 w-12 place-items-center rounded-lg text-white ${bg}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
        <p className="text-2xl font-extrabold text-slate-800">{value}</p>
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [productOpen, setProductOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const navItemClass = (path: string) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
      isActive(path) ? "bg-slate-800/80 text-white" : "hover:bg-slate-800/80"
    }`;

  const subItemClass = (path: string) =>
    `block rounded-md px-3 py-1.5 text-sm ${
      isActive(path) ? "bg-slate-800/60 text-white" : "hover:bg-slate-800/60"
    }`;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 h-12 bg-[#1E6DEB] text-white shadow">
        <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between px-3 md:px-6">
          <div className="flex items-center gap-3">
            <button
              className="rounded-md p-1 hover:bg-white/10 md:hidden"
              onClick={() => setSidebarOpen((s) => !s)}
              aria-label="Toggle Sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 font-black tracking-wide">
              <span className="rounded bg-amber-300 px-2 py-[2px] text-slate-900">POUT</span>
              <span className="hidden text-sm opacity-90 sm:inline">Admin</span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden items-center gap-2 rounded-lg bg-white/10 px-2 py-1 md:flex">
              <Search className="h-4 w-4 opacity-90" />
              <input
                className="w-48 bg-transparent text-sm placeholder-white/70 focus:outline-none"
                placeholder="Search…"
              />
            </div>
            <button className="rounded-md p-1 hover:bg-white/10" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </button>
            <div className="ml-1 flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-white/80 ring-2 ring-white/40" />
              <span className="hidden text-sm font-semibold md:inline">Admin</span>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 md:grid-cols-[260px_1fr]">
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

              <NavLink to="/admin" className={navItemClass("/admin")}>
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </NavLink>

              <NavLink to="/admin/suppliers" className={navItemClass("/admin/suppliers")}>
                <Truck className="h-4 w-4" />
                Suppliers
              </NavLink>

              <div className="mt-1">
                <button
                  onClick={() => setProductOpen((v) => !v)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-800/80"
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
                    <NavLink to="/admin/products" className={subItemClass("/admin/products")}>
                      General
                    </NavLink>
                    <NavLink
                      to="/admin/products/inventory"
                      className={subItemClass("/admin/products/inventory")}
                    >
                      Inventory
                    </NavLink>
                  </div>
                )}
              </div>

              <p className="mt-6 px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Settings
              </p>

              <NavLink to="/admin/users" className={navItemClass("/admin/users")}>
                <Users className="h-4 w-4" />
                Users
              </NavLink>

              <button className="mt-6 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-slate-800/80">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </nav>
          </div>
        </aside>

        <main className="min-h-[calc(100vh-3rem)] bg-slate-50 p-4 md:p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Dashboard</h2>
            <p className="text-xs text-slate-500">Control Panel</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard title="Items" value={11} icon={Package} bg="bg-sky-500" />
            <StatCard title="Suppliers" value={3} icon={Truck} bg="bg-rose-500" />
            <StatCard title="Users" value={4} icon={Users} bg="bg-amber-500" />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2 rounded-xl border bg-white shadow-sm">
              <div className="flex items-center justify-between border-b p-4">
                <h3 className="font-semibold">Recent Items</h3>
                <button
                  onClick={() => navigate("/admin/products/inventory")}
                  className="text-sm text-slate-600 hover:text-slate-900"
                >
                  View all
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-left text-slate-600">
                      <th className="px-4 py-3 font-semibold">SKU</th>
                      <th className="px-4 py-3 font-semibold">Name</th>
                      <th className="px-4 py-3 font-semibold">Category</th>
                      <th className="px-4 py-3 font-semibold">Stock</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { sku: "RST-001", name: "Risol Mayo", cat: "Snack", stock: 120, ok: true },
                      { sku: "PST-002", name: "Pastel Ayam", cat: "Snack", stock: 80, ok: true },
                      { sku: "LMP-003", name: "Lumpia Sayur", cat: "Snack", stock: 0, ok: false },
                      { sku: "DRK-004", name: "Es Teh Manis", cat: "Drink", stock: 45, ok: true },
                    ].map((r) => (
                      <tr key={r.sku} className="border-t">
                        <td className="px-4 py-3 font-mono text-xs">{r.sku}</td>
                        <td className="px-4 py-3">{r.name}</td>
                        <td className="px-4 py-3">{r.cat}</td>
                        <td className="px-4 py-3">{r.stock}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2 py-1 text-xs ${
                              r.ok
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-rose-100 text-rose-700"
                            }`}
                          >
                            {r.ok ? "Available" : "Out of stock"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-xl border bg-white shadow-sm">
              <div className="border-b p-4">
                <h3 className="font-semibold">Quick Actions</h3>
              </div>
              <div className="space-y-3 p-4">
                <button
                  onClick={() => navigate("/admin/products?add=true")}
                  className="w-full rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
                >
                  + Add Item
                </button>

                <button
                  onClick={() => navigate("/admin/suppliers?add=true")}
                  className="w-full rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
                >
                  + Add Supplier
                </button>

                <button
                  onClick={() => navigate("/admin/users")}
                  className="w-full rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600"
                >
                  + Invite User
                </button>

                <div className="mt-4 rounded-lg bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Storage Usage</p>
                  <div className="mt-2 h-2 w-full rounded bg-slate-200">
                    <div className="h-2 w-[62%] rounded bg-sky-500" />
                  </div>
                  <p className="mt-1 text-right text-[11px] text-slate-500">
                    62% used
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
