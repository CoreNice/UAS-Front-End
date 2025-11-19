import { useState, FormEvent } from "react";
import {
  Menu,
  Package,
  Truck,
  Users,
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Search as SearchIcon,
  Bell,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
};

const AdminUsers = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [productOpen, setProductOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([
    {
      id: 1,
      name: "Super Admin",
      email: "admin@pout.untar.ac.id",
      role: "Administrator",
      active: true,
    },
    {
      id: 2,
      name: "BPHI – Ketua",
      email: "ketua.bphi@pout.untar.ac.id",
      role: "Staff",
      active: true,
    },
    {
      id: 3,
      name: "Volunteer",
      email: "volunteer@pout.untar.ac.id",
      role: "Viewer",
      active: false,
    },
  ]);

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [modalType, setModalType] = useState<"create" | "update" | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    active: true,
  });

  const filtered = users.filter((u) =>
    `${u.name} ${u.email} ${u.role}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalEntries = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const pageUsers = filtered.slice(startIndex, startIndex + pageSize);

  const openCreate = () => {
    setModalType("create");
    setSelectedId(null);
    setForm({
      name: "",
      email: "",
      role: "",
      active: true,
    });
  };

  const openUpdate = (u: AdminUser) => {
    setModalType("update");
    setSelectedId(u.id);
    setForm({
      name: u.name,
      email: u.email,
      role: u.role,
      active: u.active,
    });
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedId(null);
  };

  const handleDelete = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (modalType === "create") {
      setUsers((prev) => {
        const nextId =
          prev.length === 0 ? 1 : Math.max(...prev.map((u) => u.id)) + 1;
        return [
          ...prev,
          {
            id: nextId,
            name: form.name,
            email: form.email,
            role: form.role,
            active: form.active,
          },
        ];
      });
    }

    if (modalType === "update" && selectedId !== null) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedId
            ? {
                ...u,
                name: form.name,
                email: form.email,
                role: form.role,
                active: form.active,
              }
            : u
        )
      );
    }

    closeModal();
  };

  const handleChangePageSize = (value: number) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  const handlePrev = () => {
    setCurrentPage((p) => Math.max(1, p - 1));
  };

  const handleNext = () => {
    setCurrentPage((p) => Math.min(totalPages, p + 1));
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
              <span className="hidden text-sm opacity-90 sm:inline">
                Admin
              </span>
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
                      className="block rounded-md px-3 py-1.5 text-sm hover:bg-slate-800/60"
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
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm bg-slate-800/90"
              >
                <Users className="h-4 w-4" />
                Users
              </a>

              <button className="mt-6 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-slate-800/80">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </nav>
          </div>
        </aside>

        <main className="min-h-[calc(100vh-3rem)] bg-slate-50 p-4 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Users</h2>
              <p className="text-xs text-slate-500">Pengelolaan akun admin</p>
            </div>
          </div>

          <div className="rounded-xl border bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 text-sm">
              <div className="flex items-center gap-2">
                <span>Show</span>
                <select
                  className="h-8 rounded border px-2 text-xs"
                  value={pageSize}
                  onChange={(e) =>
                    handleChangePageSize(Number(e.target.value))
                  }
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
                <button
                  onClick={openCreate}
                  className="ml-4 flex items-center gap-1 rounded bg-sky-600 px-3 py-1 text-xs font-semibold text-white hover:bg-sky-700"
                >
                  <Plus className="h-3 w-3" />
                  Create
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-left text-slate-600">
                    <th className="w-10 px-4 py-2 font-semibold">#</th>
                    <th className="px-4 py-2 font-semibold">Name</th>
                    <th className="px-4 py-2 font-semibold">Email</th>
                    <th className="px-4 py-2 font-semibold">Role</th>
                    <th className="px-4 py-2 font-semibold">Status</th>
                    <th className="w-36 px-4 py-2 text-center font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pageUsers.map((u, i) => (
                    <tr key={u.id} className="border-t">
                      <td className="px-4 py-2">{startIndex + i + 1}</td>
                      <td className="px-4 py-2">{u.name}</td>
                      <td className="px-4 py-2">{u.email}</td>
                      <td className="px-4 py-2">{u.role}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] ${
                            u.active
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {u.active ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          {u.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openUpdate(u)}
                            className="flex items-center gap-1 rounded bg-sky-500 px-2 py-1 text-[10px] font-semibold text-white hover:bg-sky-600"
                          >
                            <Pencil className="h-3 w-3" />
                            Update
                          </button>
                          <button
                            onClick={() => handleDelete(u.id)}
                            className="flex items-center gap-1 rounded bg-rose-500 px-2 py-1 text-[10px] font-semibold text-white hover:bg-rose-600"
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {pageUsers.length === 0 && (
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
                      startIndex + pageUsers.length
                    } of ${totalEntries} entries`}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className={`rounded border px-2 py-1 text-xs ${
                    currentPage === 1
                      ? "cursor-not-allowed bg-slate-100 text-slate-400"
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
                      ? "cursor-not-allowed bg-slate-100 text-slate-400"
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

      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold text-slate-800">
              {modalType === "create" ? "Create User" : "Update User"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-sm">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Name
                </label>
                <input
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Role
                </label>
                <select
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.role}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, role: e.target.value }))
                  }
                  required
                >
                  <option value="">Pilih role</option>
                  <option value="Administrator">Administrator</option>
                  <option value="Staff">Staff</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Status
                </label>
                <div className="flex gap-3 text-xs">
                  <label className="inline-flex items-center gap-1">
                    <input
                      type="radio"
                      name="status"
                      className="h-3 w-3"
                      checked={form.active === true}
                      onChange={() =>
                        setForm((f) => ({ ...f, active: true }))
                      }
                    />
                    Active
                  </label>
                  <label className="inline-flex items-center gap-1">
                    <input
                      type="radio"
                      name="status"
                      className="h-3 w-3"
                      checked={form.active === false}
                      onChange={() =>
                        setForm((f) => ({ ...f, active: false }))
                      }
                    />
                    Inactive
                  </label>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
