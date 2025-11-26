import { useState, FormEvent, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Plus, Trash2, Edit2, Loader2 } from "lucide-react";
import { uploadImage } from "@/supabase/storage/client";
import { useAuth } from "@/hooks/useAuthHook";
import { useNavigate } from "react-router-dom";

interface Product {
  _id?: string;
  id?: string;
  name: string;
  price: number | string;
  description: string;
  stock: number | string;
  image: string;
  created_at?: string;
  updated_at?: string;
}

type ModalType = "create" | "edit" | null;

const AdminProductsCMS = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [modalType, setModalType] = useState<ModalType>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchProducts();
  }, [token, navigate]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/admin/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalType("create");
    setEditingId(null);
    setForm({ name: "", price: "", description: "", stock: "" });
    setImageFile(null);
    setImagePreview(null);
  };

  const openEditModal = (product: Product) => {
    setModalType("edit");
    setEditingId(product._id || product.id || null);
    setForm({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      stock: product.stock.toString(),
    });
    setImageFile(null);
    setImagePreview(product.image);
  };

  const closeModal = () => {
    setModalType(null);
    setEditingId(null);
    setForm({ name: "", price: "", description: "", stock: "" });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.description || !form.stock) {
      setError("All fields are required");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      let imageUrl = imagePreview || null;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile, "pout-pictures");
        if (!imageUrl) {
          throw new Error("Failed to upload image");
        }
      }

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("description", form.description);
      formData.append("stock", form.stock);
      if (imageFile) {
        formData.append("image", imageUrl || "");
      }

      const method = modalType === "create" ? "POST" : "POST";
      const endpoint = modalType === "create"
        ? `${API_URL}/admin/products`
        : `${API_URL}/admin/products/${editingId}`;

      const response = await fetch(endpoint, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to save product");
      }

      const savedProduct = await response.json();

      if (modalType === "create") {
        setProducts([...products, savedProduct]);
      } else {
        setProducts(products.map((p) =>
          (p._id || p.id) === editingId ? savedProduct : p
        ));
      }

      closeModal();
    } catch (err) {
      console.error("Error saving product:", err);
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      setError(null);
      const response = await fetch(`${API_URL}/admin/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      setProducts(products.filter((p) => (p._id || p.id) !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product");
    }
  };

  return (
    <AdminLayout title="Products" subtitle="Barang/produk jualan">
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Daftar Produk</h2>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-slate-300 p-12 text-center">
            <p className="text-slate-500">Belum ada produk yang ditambahkan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product._id || product.id}
                className="overflow-hidden rounded-lg border bg-white shadow hover:shadow-lg transition-shadow"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-40 w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22%3E%3Crect fill=%22%23ddd%22 width=%22300%22 height=%22200%22/%3E%3C/svg%3E';
                  }}
                />
                <div className="p-4">
                  <p className="mb-3 text-sm font-semibold">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${Number(product.stock) > 0
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                      }`}>
                      {Number(product.stock) > 0 ? `Stock: ${product.stock}` : "Out of Stock"}
                    </span>
                  </p>
                  <p className="font-semibold text-slate-900">{product.name}</p>
                  <p className="mt-1 text-lg font-bold text-amber-600">
                    Rp {Number(product.price).toLocaleString('id-ID')}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                    {product.description}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => openEditModal(product)}
                      className="flex-1 flex items-center justify-center gap-1 rounded bg-blue-500 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-600"
                    >
                      <Edit2 className="h-3 w-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id || product.id || '')}
                      className="flex-1 flex items-center justify-center gap-1 rounded bg-rose-500 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-600"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold text-slate-800">
              {modalType === "create" ? "Add New Product" : "Edit Product"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Nama Produk*
                </label>
                <input
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Harga (IDR) *
                </label>
                <input
                  type="number"
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  placeholder="contoh: 15000"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Deskripsi *
                </label>
                <textarea
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Stock *
                </label>
                <input
                  type="number"
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.stock}
                  onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="mt-2 h-32 w-full rounded-lg object-cover border"
                  />
                )}
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

export default AdminProductsCMS;
