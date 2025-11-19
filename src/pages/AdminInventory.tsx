import AdminLayout from "@/components/AdminLayout";
import { useState } from "react";
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
  Trash2,
} from "lucide-react";
import risolImg from "@/assets/product-risol.jpg";

type Item = {
  id: number;
  name: string;
  priceLabel: string;
  stock: number;
  image: string;
};

const AdminInventory = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [productOpen, setProductOpen] = useState(true);
  const [search, setSearch] = useState("");

  const [items, setItems] = useState<Item[]>([
    {
      id: 1,
      name: "Risol",
      priceLabel: "5.000",
      stock: 3,
      image: risolImg as unknown as string,
    },
  ]);

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = items.filter((i) =>
    `${i.name} ${i.priceLabel} ${i.stock}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalEntries = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const pageItems = filtered.slice(startIndex, startIndex + pageSize);

  const handleDelete = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handlePrev = () => {
    setCurrentPage((p) => Math.max(1, p - 1));
  };

  const handleNext = () => {
    setCurrentPage((p) => Math.min(totalPages, p + 1));
  };

  const handleLogout = () => {
    alert("Logged out (dummy)");
  };

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
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <button
              className="rounded-md p-1 hover:bg-white/10"
              aria-label="Notifications"
            >
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

              <a
                href="/admin"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-slate-800/80"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </a>

              <a
                href="/admin/suppliers"
                className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-slate-800/80"
              >
                <Truck className="h-4 w-4" />
                Suppliers
              </a>

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
                    <a
                      href="/admin/products"
                      className="block rounded-md px-3 py-1.5 text-sm hover:bg-slate-800/60"
                    >
                      General
                    </a>
                    <a
                      href="/admin/products/inventory"
                      className="block rounded-md px-3 py-1.5 text-sm bg-slate-800/70"
                    >
                      Inventory
                    </a>
                  </div>
                )}
              </div>

              <p className="mt-6 px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Settings
              </p>
              <a
                href="/admin/users"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-slate-800/80"
              >
                <Users className="h-4 w-4" />
                Users
              </a>

              <button
                onClick={handleLogout}
                className="mt-6 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-slate-800/80"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </nav>
          </div>
        </aside>

        <main className="min-h-[calc(100vh-3rem)] bg-slate-50 p-4 md:p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Items</h2>
            <p className="text-xs text-slate-500">Data Barang</p>
          </div>

          <div className="rounded-xl border bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 text-sm">
              <div className="flex items-center gap-2">
                <span>Show</span>
                <select
                  className="h-8 rounded border px-2 text-xs"
                  value={pageSize}
                  onChange={(e) => {
                    const size = Number(e.target.value);
                    setPageSize(size);
                    setCurrentPage(1);
                  }}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span>entries</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Search:</span>
                <div className="flex items-center gap-1 rounded border bg-slate-50 px-2">
                  <SearchIcon className="h-3 w-3 text-slate-400" />
                  <input
                    className="h-7 w-40 bg-transparent text-xs focus:outline-none"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-left text-slate-600">
                    <th className="w-10 px-4 py-2 font-semibold">#</th>
                    <th className="px-4 py-2 font-semibold">Name</th>
                    <th className="px-4 py-2 font-semibold">Price</th>
                    <th className="px-4 py-2 font-semibold">Stock</th>
                    <th className="px-4 py-2 font-semibold">Image</th>
                    <th className="w-24 px-4 py-2 text-center font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((i, idx) => (
                    <tr key={i.id} className="border-t">
                      <td className="px-4 py-3">{startIndex + idx + 1}</td>
                      <td className="px-4 py-3 text-sm font-semibold">
                        {i.name}
                      </td>
                      <td className="px-4 py-3">{i.priceLabel}</td>
                      <td className="px-4 py-3">{i.stock}</td>
                      <td className="px-4 py-3">
                        <img
                          src={i.image}
                          alt={i.name}
                          className="h-12 w-16 rounded object-cover"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => handleDelete(i.id)}
                            className="flex items-center gap-1 rounded bg-rose-500 px-3 py-1 text-[10px] font-semibold text-white hover:bg-rose-600"
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {pageItems.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-6 text-center text-xs text-slate-500"
                      >
                        Tidak ada data.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t px-4 py-2 text-[11px] text-slate-500">
              <span>
                {totalEntries === 0
                  ? "Showing 0 entries"
                  : `Showing ${startIndex + 1} to ${
                      startIndex + pageItems.length
                    } of ${totalEntries} entries`}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className={`rounded border px-2 py-1 text-xs ${
                    currentPage === 1
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "bg-white hover:bg-slate-50"
                  }`}
                >
                  Previous
                </button>
                <button className="rounded border bg-sky-500 px-2 py-1 text-xs font-semibold text-white">
                  {currentPage}
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages || totalEntries === 0}
                  className={`rounded border px-2 py-1 text-xs ${
                    currentPage === totalPages || totalEntries === 0
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "bg-white hover:bg-slate-50"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminInventory;
