import { useState, FormEvent, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuthHook";
import { useNavigate } from "react-router-dom";

type AdminUser = {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: string;
  password?: string;
  created_at?: string;
  updated_at?: string;
};

const AdminUsers = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [modalType, setModalType] = useState<"create" | "update" | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "user",
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUsers();
  }, [token, navigate]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

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
      password: "",
      password_confirmation: "",
      role: "user",
    });
  };

  const openUpdate = (u: AdminUser) => {
    setModalType("update");
    setSelectedId(u._id || u.id || null);
    setForm({
      name: u.name,
      email: u.email,
      password: "",
      password_confirmation: "",
      role: u.role,
    });
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedId(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      setError(null);
      const response = await fetch(`${API_URL}/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers(users.filter((u) => (u._id || u.id) !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.role) {
      setError("Semua data wajib diisi");
      return;
    }

    if (modalType === "create") {
      if (!form.password || !form.password_confirmation) {
        setError("Password dan Confirm Password harus diisi");
        return;
      }
      if (form.password !== form.password_confirmation) {
        setError("Passwords tidak sama");
        return;
      }
      if (form.password.length < 6) {
        setError("Password terlalu pendek");
        return;
      }
    }

    setIsSaving(true);
    setError(null);

    try {
      let endpoint: string;
      let body: Record<string, unknown>;

      if (modalType === "create") {
        const registerEndpoint = form.role === "admin" ? "/registerAdmin" : "/register";
        endpoint = `${API_URL}${registerEndpoint}`;
        body = {
          name: form.name,
          email: form.email,
          password: form.password,
          password_confirmation: form.password_confirmation,
        };
      } else {
        endpoint = `${API_URL}/admin/users/${selectedId}`;
        body = {
          name: form.name,
          email: form.email,
          role: form.role,
        };
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to save user");
      }

      if (modalType === "create") {
        const newUser: AdminUser = responseData.user;
        setUsers([...users, newUser]);
      } else {
        setUsers(
          users.map((u) =>
            (u._id || u.id) === selectedId ? responseData.user : u
          )
        );
      }

      closeModal();
    } catch (err) {
      console.error("Error saving user:", err);
      setError(err instanceof Error ? err.message : "Failed to save user");
    } finally {
      setIsSaving(false);
    }
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
    <AdminLayout title="Users & Admins" subtitle="Tampilan daftar user dan admin">
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 text-sm">
          <div className="flex items-center gap-2">
            <span>Menampilkan</span>
            <select
              className="h-8 rounded border px-2 text-xs"
              value={pageSize}
              onChange={(e) => handleChangePageSize(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
            <span>data</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Search:</span>
            <input
              type="text"
              className="h-8 rounded border px-3 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Search users..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            <button
              onClick={openCreate}
              className="ml-2 flex items-center gap-1 rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-700"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
        </div>

        {error && (
          <div className="m-4 rounded-lg bg-red-50 p-3 text-xs text-red-600 border border-red-200">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-left text-slate-600">
                    <th className="border-b px-4 py-2 font-semibold">No</th>
                    <th className="border-b px-4 py-2 font-semibold">Nama</th>
                    <th className="border-b px-4 py-2 font-semibold">Email</th>
                    <th className="border-b px-4 py-2 font-semibold">Role</th>
                    <th className="border-b px-4 py-2 font-semibold text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pageUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="border-b px-4 py-3 text-center text-slate-500">
                        Belum ada user
                      </td>
                    </tr>
                  ) : (
                    pageUsers.map((user, idx) => (
                      <tr key={user._id || user.id} className="hover:bg-slate-50 border-b">
                        <td className="px-4 py-2">{startIndex + idx + 1}</td>
                        <td className="px-4 py-2">{user.name}</td>
                        <td className="px-4 py-2">{user.email}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`inline-block rounded-full px-2 py-1 text-[11px] font-semibold ${user.role === "admin"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                              }`}
                          >
                            {user.role === "admin" ? "Admin" : "User"}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openUpdate(user)}
                              className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() =>
                                handleDelete(user._id || user.id || "")
                              }
                              className="rounded bg-rose-500 px-2 py-1 text-white hover:bg-rose-600"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t px-4 py-2 text-[11px] text-slate-500">
              <span>
                {totalEntries === 0
                  ? "tidak ada data"
                  : `Menampilkan ${Math.min(
                    startIndex + pageSize,
                    totalEntries
                  )} dari ${totalEntries} data`}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className="rounded border px-2 py-1 hover:bg-slate-100 disabled:opacity-50"
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="rounded border px-2 py-1 hover:bg-slate-100 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="mb-4 text-lg font-semibold text-slate-800">
              {modalType === "create" ? "Create New User" : "Edit User"}
            </h3>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-xs text-red-600 border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 text-sm">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Nama *
                </label>
                <input
                  type="text"
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
                  Email *
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

              {modalType === "create" && (
                <>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">
                      Password *
                    </label>
                    <input
                      type="password"
                      className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                      value={form.password}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, password: e.target.value }))
                      }
                      placeholder="Min. 6 characters"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                      value={form.password_confirmation}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          password_confirmation: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </>
              )}

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Role *
                </label>
                <select
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.role}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, role: e.target.value }))
                  }
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="mt-6 flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSaving}
                  className="rounded-lg border px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;
