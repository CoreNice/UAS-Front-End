import { useState, FormEvent } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Plus, Trash2 } from "lucide-react";
import risolImg from "@/assets/product-risol.jpg";

type Product = {
  id: number;
  name: string;
  price: string;
  desc: string;
  image: string;
};

type EventItem = {
  id: number;
  title: string;
  date: string;
  location: string;
  image: string;
};

type ModalType = "product" | "upcoming" | "past" | null;

const AdminProductsGeneral = () => {
  const [imageFile, setImageFile] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Risol Mayo",
      price: "Rp 5.000",
      desc: "Risol lezat dengan mayones spesial, cocok untuk camilan",
      image: risolImg,
    },
  ]);

  const [upcomingEvents, setUpcomingEvents] = useState<EventItem[]>([
    {
      id: 1,
      title: "Leadership Workshop",
      date: "5–6 Januari 2025",
      location: "Sekretariat / Kampus",
      image:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
    },
  ]);

  const [pastEvents, setPastEvents] = useState<EventItem[]>([
    {
      id: 1,
      title: "Christmas Celebration 2024",
      date: "Desember 2024",
      location: "Aula Kampus",
      image:
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
    },
  ]);

  const [modalType, setModalType] = useState<ModalType>(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    desc: "",
    date: "",
    location: "",
  });

  // ====== HANDLER DELETE DI SINI ======
  const handleDeleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleDeleteUpcoming = (id: number) => {
    setUpcomingEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const handleDeletePast = (id: number) => {
    setPastEvents((prev) => prev.filter((e) => e.id !== id));
  };
  // ====================================

  const openModal = (type: ModalType) => {
    setModalType(type);
    setForm({
      name: "",
      price: "",
      desc: "",
      date: "",
      location: "",
    });
    setImageFile(null);
  };

  const closeModal = () => {
    setModalType(null);
    setImageFile(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!modalType) return;

    if (modalType === "product") {
      if (!form.name || !form.price) return;
      setProducts((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          name: form.name,
          price: form.price,
          desc: form.desc || "-",
          // pakai foto upload kalau ada, kalau nggak pakai default
          image: imageFile || (risolImg as unknown as string),
        },
      ]);
    }

    if (modalType === "upcoming") {
      if (!form.name || !form.date) return;
      setUpcomingEvents((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          title: form.name,
          date: form.date,
          location: form.location || "-",
          image:
            imageFile ||
            "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
        },
      ]);
    }

    if (modalType === "past") {
      if (!form.name || !form.date) return;
      setPastEvents((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          title: form.name,
          date: form.date,
          location: form.location || "-",
          image:
            imageFile ||
            "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
        },
      ]);
    }

    closeModal();
  };

  return (
    <AdminLayout title="Product" subtitle="General">
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">Product</h2>

        <div className="flex items-start gap-10">
          <div className="space-y-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="w-72 overflow-hidden rounded-lg border bg-white shadow"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-40 w-full object-cover"
                />
                <div className="p-3">
                  <p className="text-sm font-semibold">{p.name}</p>
                  <p className="mt-1 text-sm font-bold text-amber-600">
                    {p.price}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">{p.desc}</p>
                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    className="mt-3 flex items-center gap-1 rounded bg-rose-500 px-3 py-1 text-[11px] text-white"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => openModal("product")}
            className="mt-10 grid h-16 w-16 place-items-center rounded-full border-2 border-dashed border-slate-300 text-slate-400 hover:border-slate-400 hover:text-slate-500"
          >
            <Plus className="h-8 w-8" />
          </button>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">
          Kegiatan Mendatang
        </h2>

        <div className="flex items-start gap-10">
          <div className="space-y-6">
            {upcomingEvents.map((e) => (
              <div
                key={e.id}
                className="w-[320px] overflow-hidden rounded-lg border bg-white shadow"
              >
                <img
                  src={e.image}
                  alt={e.title}
                  className="h-40 w-full object-cover"
                />
                <div className="p-3">
                  <p className="text-sm font-semibold">{e.title}</p>
                  <p className="mt-1 text-[11px] text-slate-500">{e.date}</p>
                  <p className="text-[11px] text-slate-500">{e.location}</p>
                  <button
                    onClick={() => handleDeleteUpcoming(e.id)}
                    className="mt-3 flex items-center gap-1 rounded bg-rose-500 px-3 py-1 text-[11px] text-white"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => openModal("upcoming")}
            className="mt-10 grid h-16 w-16 place-items-center rounded-full border-2 border-dashed border-slate-300 text-slate-400 hover:border-slate-400 hover:text-slate-500"
          >
            <Plus className="h-8 w-8" />
          </button>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-800">
          Kegiatan Yang Telah Dilaksanakan
        </h2>

        <div className="flex items-start gap-10">
          <div className="space-y-6">
            {pastEvents.map((e) => (
              <div
                key={e.id}
                className="w-[320px] overflow-hidden rounded-lg border bg-white shadow"
              >
                <img
                  src={e.image}
                  alt={e.title}
                  className="h-40 w-full object-cover"
                />
                <div className="p-3">
                  <p className="text-sm font-semibold">{e.title}</p>
                  <p className="mt-1 text-[11px] text-slate-500">{e.date}</p>
                  <p className="text-[11px] text-slate-500">{e.location}</p>
                  <button
                    onClick={() => handleDeletePast(e.id)}
                    className="mt-3 flex items-center gap-1 rounded bg-rose-500 px-3 py-1 text-[11px] text-white"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => openModal("past")}
            className="mt-10 grid h-16 w-16 place-items-center rounded-full border-2 border-dashed border-slate-300 text-slate-400 hover:border-slate-400 hover:text-slate-500"
          >
            <Plus className="h-8 w-8" />
          </button>
        </div>
      </section>

      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold text-slate-800">
              {modalType === "product" && "Tambah Produk"}
              {modalType === "upcoming" && "Tambah Kegiatan Mendatang"}
              {modalType === "past" && "Tambah Kegiatan"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-sm">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  {modalType === "product" ? "Nama Produk" : "Judul Kegiatan"}
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
                  Foto
                </label>

                <input
                  type="file"
                  accept="image/*"
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setImageFile(url);
                    }
                  }}
                />
                {imageFile && (
                  <img
                    src={imageFile}
                    alt="preview"
                    className="mt-2 h-28 w-full rounded-lg object-cover border"
                  />
                )}
              </div>

              {modalType === "product" && (
                <>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">
                      Harga
                    </label>
                    <input
                      className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                      value={form.price}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, price: e.target.value }))
                      }
                      placeholder="Contoh: Rp 8.000"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">
                      Deskripsi
                    </label>
                    <textarea
                      className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                      rows={3}
                      value={form.desc}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, desc: e.target.value }))
                      }
                    />
                  </div>
                </>
              )}

              {modalType !== "product" && (
                <>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">
                      Tanggal
                    </label>
                    <input
                      className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                      value={form.date}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, date: e.target.value }))
                      }
                      placeholder="Contoh: Desember 2025"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">
                      Lokasi
                    </label>
                    <input
                      className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                      value={form.location}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, location: e.target.value }))
                      }
                      placeholder="Contoh: Aula Kampus"
                    />
                  </div>
                </>
              )}

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

export default AdminProductsGeneral;
