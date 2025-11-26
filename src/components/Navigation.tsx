import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuthHook";
import { Mail, Instagram } from "lucide-react";
import MiniCard from "./MiniCard";
import type { User } from "@/contexts/AuthContext";

type UserMini = { name: string; avatarUrl?: string | null };
type Props = { user?: UserMini | null };

const Navigation = ({ user: _user = null }: Props) => {
  const { user: authUser } = useAuth();
  const [miniCardOpen, setMiniCardOpen] = useState(false);
  const user = authUser || _user;

  const navItems = [
    { name: "HOME", path: "/" },
    { name: "PROFIL", path: "/profile" },
    { name: "ACTIVITY", path: "/activity" },
    { name: "PRODUCT", path: "/product" },
    { name: "ABOUT US", path: "/about" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `text-primary-foreground/80 hover:text-primary-foreground transition-colors font-medium text-sm ${isActive ? "text-primary-foreground border-b-2 border-secondary" : ""
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center space-x-4 relative">
            {user && user.name ? (
              <div className="relative">
                <button
                  onClick={() => setMiniCardOpen(!miniCardOpen)}
                  className="flex items-center gap-2 text-primary-foreground/90 hover:text-primary-foreground font-semibold transition-colors"
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover border-2 border-primary-foreground/30 hover:border-primary-foreground"
                    />
                  ) : (
                    <span className="h-8 w-8 rounded-full bg-white/50 inline-flex items-center justify-center text-primary text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span className="text-sm">{user.name}</span>
                </button>

                {miniCardOpen && (
                  <div className="absolute top-full right-0 mt-2">
                    <MiniCard user={authUser} onClose={() => setMiniCardOpen(false)} />
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `text-primary-foreground/80 hover:text-primary-foreground underline underline-offset-4 tracking-wide text-sm font-semibold transition-colors ${isActive ? "text-primary-foreground" : ""
                  }`
                }
              >
                Login
              </NavLink>
            )}

            <a
              href="mailto:oikoumene.ut@gmail.com"
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              <Mail className="h-5 w-5" />
            </a>

            <a
              href="https://instagram.com/po_untar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </a>

            <div className="text-primary-foreground font-bold text-lg">POUT</div>
          </div>
        </div>
      </div>

      {miniCardOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setMiniCardOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navigation;
