import { NavLink } from "@/components/NavLink";
import { Mail, Instagram } from "lucide-react";

const Navigation = () => {
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
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors font-medium text-sm"
                activeClassName="text-primary-foreground border-b-2 border-secondary"
              >
                {item.name}
              </NavLink>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            <a
              href="mailto:contact@pout.untar.ac.id"
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
            <a
              href="https://instagram.com/pout.untar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <div className="text-primary-foreground font-bold text-lg">POUT</div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
