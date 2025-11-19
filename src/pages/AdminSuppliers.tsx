import AdminLayout from "@/components/AdminLayout";
import { useState, FormEvent } from "react";
import { Search as SearchIcon, Plus, Pencil, Trash2 } from "lucide-react";

type Supplier = {
  id: number;
  name: string;
  phone: string;
  address: string;
  description: string;
};

const AdminSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: 1,
      name: "Toko A",
      phone: "0295382222",
      address: "Pati",
      description: "Toko ATK Besar",
    },
    {
      id: 2,
      name: "Toko B",
      phone: "021343848",
      address: "Jakarta",
      description: "Toko ATK Terbesar",
    },
    {
      id: 3,
      name: "Toko C",
      phone: "0215454",
      address: "Kudus",
      description: "Toko Oke",
    },
  ]);

  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [modalType, setModalType] = useState<"create" | "update" | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    description: "",
  });

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
    setSelectedId(s.id);
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

  const handleDelete = (id: number) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (modalType === "create") {
      setSuppliers((prev) => {
        const nextId =
          prev.length === 0 ? 1 : Math.max(...prev.map((s) => s.id)) + 1;
        return [
          ...prev,
          {
            id: nextId,
            name: form.name,
            phone: form.phone,
            address: form.address,
            description: form.description,
          },
        ];
      });
    }
    if (modalType === "update" && selectedId !== null) {
      setSuppliers((prev) =>
        prev.map((s) =>
          s.id === selectedId
            ? {
                ...s,
                name: form.name,
                phone: form.phone,
                address: form.address,
                description: form.description,
              }
            : s
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
    <AdminLayout title="Suppliers" subtitle="Pemasok Barang">
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 text-sm">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              className="h-8 rounded border px-2 text-xs"
              value={pageSize}
              onChange={(e) => handleChangePageSize(Number(e.target.value))}
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
                <th className="px-4 py-2 font-semibold">Phone</th>
                <th className="px-4 py-2 font-semibold">Address</th>
                <th className="px-4 py-2 font-semibold">Description</th>
                <th className="w-32 px-4 py-2 text-center font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((s, i) => (
                <tr key={s.id} className="border-t">
                  <td className="px-4 py-2">{startIndex + i + 1}</td>
                  <td className="px-4 py-2">{s.name}</td>
                  <td className="px-4 py-2">{s.phone}</td>
                  <td className="px-4 py-2">{s.address}</td>
                  <td className="px-4 py-2">{s.description}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => openUpdate(s)}
                        className="flex items-center gap-1 rounded bg-sky-500 px-2 py-1 text-[10px] font-semibold text-white hover:bg-sky-600"
                      >
                        <Pencil className="h-3 w-3" />
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="flex items-center gap-1 rounded bg-rose-500 px-2 py-1 text-[10px] font-semibold text-white hover:bg-rose-600"
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
              disabled={currentPage === 1}
              onClick={handlePrev}
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
              disabled={currentPage === totalPages || totalEntries === 0}
              onClick={handleNext}
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

      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold text-slate-800">
              {modalType === "create" ? "Create Supplier" : "Update Supplier"}
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
                  Phone
                </label>
                <input
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Address
                </label>
                <input
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.address}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, address: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Description
                </label>
                <textarea
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                />
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
    </AdminLayout>
  );
};

export default AdminSuppliers;
