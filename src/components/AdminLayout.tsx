import { ReactNode, useState, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuthHook";
import {
  Menu,
  Monitor,
  CalendarClock,
  Package,
  Truck,
  Users,
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Search as SearchIcon,
  Bell,
  BellOff,
  BellRing,
  FileText
} from "lucide-react";
import { uploadImage } from "@/supabase/storage/client";
import { useToast } from "@/hooks/use-toast";

type AdminLayoutProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};


const AdminLayout = ({ title, subtitle, children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const productsActive = location.pathname.startsWith("/admin/products") || location.pathname.startsWith("/admin/activities");
  const [productOpen, setProductOpen] = useState(productsActive);
  const { logout, token, user, updateProfile } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [active, setActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      logout();
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(file);

      const result = await updateProfile({ avatarUrl: imageUrl });

      if (result.success) {
        toast({
          title: "Success",
          description: "Avatar updated successfully"
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update avatar",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload avatar",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const linkBase =
    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors";
  const linkInactive = "text-slate-200 hover:bg-slate-800/80";
  const linkActive = "bg-slate-800/90 text-white";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* TOP NAVBAR */}
      <header className="sticky top-0 z-40 h-12 bg-[#1E6DEB] text-white shadow">
        <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between px-3 md:px-6">
          <div className="flex items-center gap-3">
            <button
              className="rounded-md p-1 hover:bg-white/10 md:hidden"
              onClick={() => setSidebarOpen((s) => !s)}
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

            <button
              onClick={() => setActive(!active)}
              className="rounded-md p-1 hover:bg-white/10"
            >
              {active ? (
                <Bell className="w-6 h-6" />
              ) : (
                <BellRing className="w-6 h-6" />
              )}
            </button>

            <button
              onClick={handleAvatarClick}
              disabled={isUploading}
              className="ml-1 flex items-center gap-2 rounded-lg hover:bg-white/10 p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Click to change avatar"
            >
              <div className="h-6 w-6 rounded-full bg-white/80 ring-2 ring-white/40 overflow-hidden flex-shrink-0">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-white/50" />
                )}
              </div>
              <span className="hidden text-sm font-semibold md:inline">
                {user?.name || 'Admin'}
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
              disabled={isUploading}
            />
          </div>
        </div>
      </header>

      {/* LAYOUT */}
      <div className="flex">
        {/* SIDEBAR */}
        <aside
          className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } fixed inset-y-12 left-0 z-30 w-64 bg-slate-900 text-slate-100 transition-transform md:static md:translate-x-0 md:inset-auto`}
        >
          <div className="h-full overflow-y-auto">
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4">

              <button
                onClick={handleAvatarClick}
                disabled={isUploading}
                className="h-10 w-10 rounded-full bg-slate-700 ring-2 ring-white/10 overflow-hidden flex-shrink-0 hover:ring-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title="Click to change avatar"
              >
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-600" />
                )}
              </button>
              <div>
                <p className="font-semibold leading-tight">{user?.name || 'Admin'}</p>
                <p className="text-xs text-emerald-400">● Online</p>
              </div>
            </div>

            <nav className="px-2 py-4">
              <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Navigation
              </p>

              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkInactive}`
                }
                end
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </NavLink>

              <NavLink
                to="/admin/suppliers"
                className={({ isActive }) =>
                  `${linkBase} mt-1 ${isActive ? linkActive : linkInactive}`
                }
              >
                <Truck className="h-4 w-4" />
                Suppliers
              </NavLink>

              <NavLink
                to="/admin/products"
                className={({ isActive }) =>
                  `${linkBase} mt-1 ${isActive ? linkActive : linkInactive}`
                }
              >
                <Package className="h-4 w-4" />
                Products
              </NavLink>
              <NavLink
                to="/admin/activities"
                className={({ isActive }) =>
                  `${linkBase} mt-1 ${isActive ? linkActive : linkInactive}`
                }
              >
                <CalendarClock className="h-4 w-4" />
                Activities
              </NavLink>
              <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mt-3">
                Settings
              </p>
              <NavLink
                to="/admin/profile-cms"
                className={({ isActive }) =>
                  `${linkBase} mt-1 ${isActive ? linkActive : linkInactive}`
                }
              >
                <FileText className="h-4 w-4" />
                Divisions & Departments
              </NavLink>
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkInactive}`
                }
              >
                <Users className="h-4 w-4" />
                Users & Admins
              </NavLink>
              <div className="w-full flex justify-left items-center mt-1" >
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-fit mt-6 flex items-center justify-left gap-2 hover:bg-red-30 text-gray-300 font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LogOut className="h-5 w-5" />
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            </nav>
          </div>
        </aside>

        <main className="flex-1 min-h-[calc(100vh-3rem)] bg-slate-50 p-4 md:p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
            {subtitle && (
              <p className="text-xs text-slate-500">{subtitle}</p>
            )}
          </div>

          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
