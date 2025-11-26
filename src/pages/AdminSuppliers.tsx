import { useState, FormEvent, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Plus, Trash2, Edit2, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuthHook";
import { useNavigate } from "react-router-dom";

type Supplier = {
  _id?: string;
  id?: string;
  name: string;
  phone: string;
  address: string;
  description: string;
  created_at?: string;
  updated_at?: string;
};

const AdminSuppliers = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
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
    phone: "",
    address: "",
    description: "",
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchSuppliers();
  }, [token, navigate]);

  const fetchSuppliers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/admin/suppliers`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch suppliers");
      }

      const data = await response.json();
      setSuppliers(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      setError("Failed to load suppliers");
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = suppliers.filter((s) =>
    [s.name, s.phone, s.address, s.description]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalEntries = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const pageItems = filtered.slice(startIndex, startIndex + pageSize);

  const openCreate = () => {
    setModalType("create");
    setSelectedId(null);
    setForm({
      name: "",
      phone: "",
      address: "",
      description: "",
    });
  };

  const openUpdate = (s: Supplier) => {
    setModalType("update");
    setSelectedId(s._id || s.id || null);
    setForm({
      name: s.name,
      phone: s.phone,
      address: s.address,
      description: s.description,
    });
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedId(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Konfirmasi untuk Delete Supplier.")) {
      return;
    }

    try {
      setError(null);
      const response = await fetch(`${API_URL}/admin/suppliers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to delete supplier");
      }

      setSuppliers(suppliers.filter((s) => (s._id || s.id) !== id));
    } catch (err) {
      console.error("Error deleting supplier:", err);
      setError("Failed to delete supplier");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.address || !form.description) {
      setError("Semua data harus diisi");
      return;
    }

    if (!/^[0-9\-\+\s()]+$/.test(form.phone)) {
      setError("Nomor HP tidak valid");
      return;
    }

    if (form.name.length > 30) {
      setError("Maksimal 30 huruf");
      return;
    }
    if (form.address.length > 30) {
      setError("Maksimal 30 huruf");
      return;
    }
    if (form.description.length > 30) {
      setError("Maksimal 30 huruf");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const method = modalType === "create" ? "POST" : "POST";
      const endpoint =
        modalType === "create"
          ? `${API_URL}/admin/suppliers`
          : `${API_URL}/admin/suppliers/${selectedId}`;

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save supplier");
      }

      const savedSupplier = await response.json();

      if (modalType === "create") {
        setSuppliers([...suppliers, savedSupplier]);
      } else {
        setSuppliers(
          suppliers.map((s) =>
            (s._id || s.id) === selectedId ? savedSupplier : s
          )
        );
      }

      closeModal();
    } catch (err) {
      console.error("Error saving supplier:", err);
      setError(err instanceof Error ? err.message : "Failed to save supplier");
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
    <AdminLayout title="Suppliers" subtitle="Supplier Management">
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 text-sm">
          <div className="flex items-center gap-2">
            <span>Tampilkan</span>
            <select
              className="h-8 rounded border px-2 text-xs"
              value={pageSize}
              onChange={(e) => handleChangePageSize(Number(e.target.value))}
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
            <span>data</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Search:</span>
            <input
              type="text"
              className="h-8 rounded border px-3 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Search suppliers..."
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

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-left text-slate-600">
                <th className="border-b px-4 py-2 font-semibold">No</th>
                <th className="border-b px-4 py-2 font-semibold">Nama</th>
                <th className="border-b px-4 py-2 font-semibold">Nomor HP</th>
                <th className="border-b px-4 py-2 font-semibold">Alamat</th>
                <th className="border-b px-4 py-2 font-semibold">
                  Deskripsi
                </th>
                <th className="border-b px-4 py-2 font-semibold text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="border-b px-4 py-3 text-center text-slate-500">
                    Belum ada supplier yang ditambahkan
                  </td>
                </tr>
              ) : (
                pageItems.map((supplier, idx) => (
                  <tr key={supplier._id || supplier.id} className="hover:bg-slate-50 border-b">
                    <td className="px-4 py-2">{startIndex + idx + 1}</td>
                    <td className="px-4 py-2">{supplier.name}</td>
                    <td className="px-4 py-2">{supplier.phone}</td>
                    <td className="px-4 py-2">{supplier.address}</td>
                    <td className="px-4 py-2 line-clamp-1">
                      {supplier.description}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openUpdate(supplier)}
                          className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(supplier._id || supplier.id || "")
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
              : `menampilkan ${Math.min(
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
      </div>

      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold text-slate-800">
              {modalType === "create" ? "Add New Supplier" : "Edit Supplier"}
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
                    setForm((f) => ({
                      ...f,
                      name: e.target.value.slice(0, 30),
                    }))
                  }
                  required
                />
                <span className="text-xs text-slate-400">
                  {form.name.length}/30
                </span>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Nomor HP *
                </label>
                <input
                  type="tel"
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      phone: e.target.value.slice(0, 15),
                    }))
                  }
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Alamat *
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.address}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      address: e.target.value.slice(0, 30),
                    }))
                  }
                  required
                />
                <span className="text-xs text-slate-400">
                  {form.address.length}/30
                </span>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Deskripsi *
                </label>
                <textarea
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      description: e.target.value.slice(0, 35),
                    }))
                  }
                  required
                />
                <span className="text-xs text-slate-400">
                  {form.description.length}/35
                </span>
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

export default AdminSuppliers;
