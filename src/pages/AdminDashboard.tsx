import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useAuth } from "@/hooks/useAuthHook";
import { Package, Truck, Users, CalendarClock, Loader2, Info } from "lucide-react";

type Product = {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  stock: number;
  created_at?: string;
};

type Activity = {
  _id?: string;
  id?: string;
  title: string;
  date: string;
  location: string;
  status: string;
  created_at?: string;
};

type Supplier = {
  _id?: string;
  id?: string;
  name: string;
  phone: string;
  address: string;
  description: string;
  created_at?: string;
};

type User = {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: string;
  created_at?: string;
};

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
        <p className="text-xs uppercase tracking-wide text-slate-500"><strong>{title}</strong></p>
        <p className="text-2xl font-extrabold text-slate-800">{value}</p>
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [stats, setStats] = useState({
    products: 0,
    activities: 0,
    suppliers: 0,
    users: 0,
  });

  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchDashboardData();
  }, [token, navigate]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      const [productsRes, activitiesRes, suppliersRes, usersRes] = await Promise.all([
        fetch(`${API_URL}/admin/products`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/admin/activities`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/admin/suppliers`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      let productsData: Product[] = [];
      let activitiesData: Activity[] = [];
      let suppliersData: Supplier[] = [];
      let usersData: User[] = [];

      if (productsRes.ok) {
        const data = await productsRes.json();
        productsData = Array.isArray(data) ? data : data.data || [];
      }
      if (activitiesRes.ok) {
        const data = await activitiesRes.json();
        activitiesData = Array.isArray(data) ? data : data.data || [];
      }
      if (suppliersRes.ok) {
        const data = await suppliersRes.json();
        suppliersData = Array.isArray(data) ? data : data.data || [];
      }
      if (usersRes.ok) {
        const data = await usersRes.json();
        usersData = Array.isArray(data) ? data : data.data || [];
      }

      setStats({
        products: productsData.length,
        activities: activitiesData.length,
        suppliers: suppliersData.length,
        users: usersData.length,
      });

      setRecentProducts(productsData.sort((a, b) =>
        new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      ).slice(0, 3));

      setRecentActivities(activitiesData.sort((a, b) =>
        new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      ).slice(0, 3));

      setSuppliers(suppliersData.slice(0, 3));
      setAllUsers(usersData.slice(0, 4));
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <AdminLayout title="Admin Dashboard" subtitle="Dashboard">
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <h5><strong>Daftar Kategori</strong></h5>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-3 mb-10">
            <StatCard title="Produk" value={stats.products} icon={Package} bg="bg-sky-500" />
            <StatCard title="Kegiatan" value={stats.activities} icon={CalendarClock} bg="bg-purple-500" />
            <StatCard title="Supplier" value={stats.suppliers} icon={Truck} bg="bg-rose-500" />
            <StatCard title="User" value={stats.users} icon={Users} bg="bg-amber-500" />
          </div>

          <h1><strong>Tabel Kategori</strong></h1>

          <div className="rounded-xl border bg-white shadow-sm mt-3 mb-10">
            <div className="border-b p-4 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">Daftar Produk</h3>
              <button
                onClick={() => navigate("/admin/products")}
                className="ml-2 flex items-center gap-1 rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-700"
              >
                <Info className="h-4 w-4" />
                Detail
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left text-slate-600">
                    <th className="px-4 py-3 font-semibold">Nama Produk</th>
                    <th className="px-4 py-3 font-semibold">Harga</th>
                    <th className="px-4 py-3 font-semibold">Stock</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProducts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-3 text-center text-slate-500">
                        Belum ada produk yang ditambahkan
                      </td>
                    </tr>
                  ) : (
                    recentProducts.map((product) => (
                      <tr key={product._id || product.id} className="border-t hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium">{product.name}</td>
                        <td className="px-4 py-3">Rp {Number(product.price).toLocaleString('id-ID')}</td>
                        <td className="px-4 py-3">{product.stock}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-semibold ${product.stock > 0
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-rose-100 text-rose-700"
                              }`}
                          >
                            {product.stock > 0 ? "Available" : "Out of stock"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl border bg-white shadow-sm mb-10 mt-3">
            <div className="border-b p-4 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">Daftar Kegiatan</h3>
              <button
                onClick={() => navigate("/admin/activities")}
                className="ml-2 flex items-center gap-1 rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-700"
              >
                <Info className="h-4 w-4" />
                Detail
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left text-slate-600">
                    <th className="px-4 py-3 font-semibold">Nama Kegiatan</th>
                    <th className="px-4 py-3 font-semibold">Waktu Kegiatan</th>
                    <th className="px-4 py-3 font-semibold">Lokasi</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivities.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-3 text-center text-slate-500">
                        Belum ada kegiatan yang ditambahkan
                      </td>
                    </tr>
                  ) : (
                    recentActivities.map((activity) => (
                      <tr key={activity._id || activity.id} className="border-t hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium">{activity.title}</td>
                        <td className="px-4 py-3">{activity.date}</td>
                        <td className="px-4 py-3">{activity.location}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-semibold ${activity.status === "upcoming"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                              }`}
                          >
                            {activity.status === "upcoming" ? "Upcoming" : "Past"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl border bg-white shadow-sm mb-10 mt-3">
            <div className="border-b p-4 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">Daftar Supplier</h3>
              <button
                onClick={() => navigate("/admin/suppliers")}
                className="ml-2 flex items-center gap-1 rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-700"
              >
                <Info className="h-4 w-4" />
                Detail
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left text-slate-600">
                    <th className="px-4 py-3 font-semibold">Nama Supplier</th>
                    <th className="px-4 py-3 font-semibold">No. HP</th>
                    <th className="px-4 py-3 font-semibold">Alamat</th>
                    <th className="px-4 py-3 font-semibold">Deskripsi</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-3 text-center text-slate-500">
                        Belum ada supplier yang ditambahkan
                      </td>
                    </tr>
                  ) : (
                    suppliers.map((supplier) => (
                      <tr key={supplier._id || supplier.id} className="border-t hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium">{supplier.name}</td>
                        <td className="px-4 py-3">{supplier.phone}</td>
                        <td className="px-4 py-3">{supplier.address}</td>
                        <td className="px-4 py-3 text-xs line-clamp-1">{supplier.description}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl border bg-white shadow-sm mb-10 mt-3">
            <div className="border-b p-4 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">Daftar User</h3>
              <button
                onClick={() => navigate("/admin/users")}
                className="ml-2 flex items-center gap-1 rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-700"
              >
                <Info className="h-4 w-4" />
                Detail
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left text-slate-600">
                    <th className="px-4 py-3 font-semibold">Nama</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Role</th>
                    <th className="px-4 py-3 font-semibold">Waktu Register</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-3 text-center text-slate-500">
                        Belum ada user yang terdaftar.
                      </td>
                    </tr>
                  ) : (
                    allUsers.map((user) => (
                      <tr key={user._id || user.id} className="border-t hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium">{user.name}</td>
                        <td className="px-4 py-3 text-xs">{user.email}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-semibold ${user.role === "admin"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-slate-100 text-slate-700"
                              }`}
                          >
                            {user.role === "admin" ? "Admin" : "User"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs">
                          {user.created_at ? new Date(user.created_at).toLocaleDateString('id-ID') : '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <h5><strong>Quick Actions</strong></h5>
          <div className="rounded-xl border bg-white shadow-sm mt-3 pt-3 pb-3">
            <div className="space-y-3 p-4">
              <button
                onClick={() => navigate("/admin/products")}
                className="w-full rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 transition"
              >
                + Add Product
              </button>
              <button
                onClick={() => navigate("/admin/activities")}
                className="w-full rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition"
              >
                + Add Activity
              </button>
              <button
                onClick={() => navigate("/admin/suppliers")}
                className="w-full rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition"
              >
                + Add Supplier
              </button>
              <button
                onClick={() => navigate("/admin/users")}
                className="w-full rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition"
              >
                + Add User
              </button>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
