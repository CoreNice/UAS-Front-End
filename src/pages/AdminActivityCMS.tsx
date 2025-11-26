import { useState, FormEvent, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Plus, Trash2, Edit2, Loader2 } from "lucide-react";
import { uploadImage } from "@/supabase/storage/client";
import { useAuth } from "@/hooks/useAuthHook";
import { useNavigate } from "react-router-dom";

interface Activity {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  status: 'upcoming' | 'past';
  created_at?: string;
  updated_at?: string;
}

type ModalType = "create" | "edit" | null;

const AdminActivityCMS = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [modalType, setModalType] = useState<ModalType>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    status: "upcoming" as 'upcoming' | 'past',
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchActivities();
  }, [token, navigate]);

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/admin/activities`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch activities");
      }

      const data = await response.json();
      setActivities(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Error fetching activities:", err);
      setError("Failed to load activities");
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalType("create");
    setEditingId(null);
    setForm({ title: "", description: "", date: "", location: "", status: "upcoming" });
    setImageFile(null);
    setImagePreview(null);
  };

  const openEditModal = (activity: Activity) => {
    setModalType("edit");
    setEditingId(activity._id || activity.id || null);
    setForm({
      title: activity.title,
      description: activity.description,
      date: activity.date,
      location: activity.location,
      status: activity.status,
    });
    setImageFile(null);
    setImagePreview(activity.image);
  };

  const closeModal = () => {
    setModalType(null);
    setEditingId(null);
    setForm({ title: "", description: "", date: "", location: "", status: "upcoming" });
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

    if (!form.title || !form.description || !form.date || !form.location) {
      setError("Semua data wajib diisi");
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
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("date", form.date);
      formData.append("location", form.location);
      formData.append("status", form.status);
      if (imageFile) {
        formData.append("image", imageUrl);
      }

      const method = modalType === "create" ? "POST" : "POST";
      const endpoint = modalType === "create"
        ? `${API_URL}/admin/activities`
        : `${API_URL}/admin/activities/${editingId}`;

      const response = await fetch(endpoint, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to save activity");
      }

      const savedActivity = await response.json();

      if (modalType === "create") {
        setActivities([...activities, savedActivity]);
      } else {
        setActivities(activities.map((a) =>
          (a._id || a.id) === editingId ? savedActivity : a
        ));
      }

      closeModal();
    } catch (err) {
      console.error("Error saving activity:", err);
      setError(err instanceof Error ? err.message : "Failed to save activity");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this activity?")) {
      return;
    }

    try {
      setError(null);
      const response = await fetch(`${API_URL}/admin/activities/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to delete activity");
      }

      setActivities(activities.filter((a) => (a._id || a.id) !== id));
    } catch (err) {
      console.error("Error deleting activity:", err);
      setError("Failed to delete activity");
    }
  };

  const upcomingActivities = activities.filter(a => a.status === 'upcoming');
  const pastActivities = activities.filter(a => a.status === 'past');

  return (
    <AdminLayout title="Activities" subtitle="kegiatan">
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Daftar Kegiatan</h2>
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
        ) : (
          <>
            <div className="mb-12">
              <h3 className="mb-4 text-base font-semibold text-slate-700">Kegiatan yang Mendatang</h3>
              {upcomingActivities.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-slate-300 p-8 text-center">
                  <p className="text-slate-500">Belum ada kegiatan yang ditambahkan.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {upcomingActivities.map((activity) => (
                    <div
                      key={activity._id || activity.id}
                      className="overflow-hidden rounded-lg border bg-white shadow hover:shadow-lg transition-shadow"
                    >
                      <img
                        src={activity.image || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22%3E%3Crect fill=%22%23ddd%22 width=%22300%22 height=%22200%22/%3E%3C/svg%3E'}
                        alt={activity.title}
                        className="h-40 w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22%3E%3Crect fill=%22%23ddd%22 width=%22300%22 height=%22200%22/%3E%3C/svg%3E';
                        }}
                      />
                      <div className="p-4">
                        <p className="font-semibold text-slate-900">{activity.title}</p>
                        <p className="mt-1 text-sm text-slate-600">{activity.date}</p>
                        <p className="text-sm text-slate-600">{activity.location}</p>
                        <p className="mt-2 line-clamp-2 text-xs text-slate-600">
                          {activity.description}
                        </p>
                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => openEditModal(activity)}
                            className="flex-1 flex items-center justify-center gap-1 rounded bg-blue-500 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-600"
                          >
                            <Edit2 className="h-3 w-3" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(activity._id || activity.id || '')}
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
            </div>

            <div>
              <h3 className="mb-4 text-base font-semibold text-slate-700">Kegiatan yang telah Dilaksanakan</h3>
              {pastActivities.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-slate-300 p-8 text-center">
                  <p className="text-slate-500">Belum ada kegiatan yang ditambahkan.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {pastActivities.map((activity) => (
                    <div
                      key={activity._id || activity.id}
                      className="overflow-hidden rounded-lg border bg-white shadow hover:shadow-lg transition-shadow"
                    >
                      <img
                        src={activity.image || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22%3E%3Crect fill=%22%23ddd%22 width=%22300%22 height=%22200%22/%3E%3C/svg%3E'}
                        alt={activity.title}
                        className="h-40 w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22%3E%3Crect fill=%22%23ddd%22 width=%22300%22 height=%22200%22/%3E%3C/svg%3E';
                        }}
                      />
                      <div className="p-4">
                        <p className="font-semibold text-slate-900">{activity.title}</p>
                        <p className="mt-1 text-sm text-slate-600">{activity.date}</p>
                        <p className="text-sm text-slate-600">{activity.location}</p>
                        <p className="mt-2 line-clamp-2 text-xs text-slate-600">
                          {activity.description}
                        </p>
                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => openEditModal(activity)}
                            className="flex-1 flex items-center justify-center gap-1 rounded bg-blue-500 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-600"
                          >
                            <Edit2 className="h-3 w-3" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(activity._id || activity.id || '')}
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
            </div>
          </>
        )}
      </section>

      {/* Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="mb-4 text-lg font-semibold text-slate-800">
              {modalType === "create" ? "Add New Activity" : "Edit Activity"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Nama Kegiatan  *
                </label>
                <input
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Waktu Kegiatan *
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  placeholder="contoh: April 15, 2025"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Lokasi Kegiatan *
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Status *
                </label>
                <select
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as 'upcoming' | 'past' }))}
                  required
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past</option>
                </select>
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

export default AdminActivityCMS;
