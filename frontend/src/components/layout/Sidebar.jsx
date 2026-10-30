
import {
  ClipboardList,
  LayoutDashboard,
  Settings,
  UserCog,
  Users,
  Calendar,
  MapPin,
  Menu,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const navigation = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Planning", path: "/planning", icon: Calendar },
  { label: "Interventions", path: "/interventions", icon: ClipboardList },
  { label: "Cartes des interventions", path: "/map", icon: MapPin },
  { label: "Clients", path: "/clients", icon: Users },
  { label: "Utilisateurs", path: "/users", icon: UserCog },
];

function Sidebar() {
  const [navigationList, setNavigationList] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setNavigationList([]);
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const role = decodedToken.role;

      if (role?.includes("ROLE_ADMIN") || role === "ROLE_ADMIN") {
        setNavigationList(navigation);
      } else if (
        role?.includes("ROLE_TECHNICIAN") ||
        role === "ROLE_TECHNICIAN"
      ) {
        setNavigationList(
          navigation.filter(
            (item) =>
              item.label !== "Utilisateurs" && item.label !== "Clients"
          )
        );
      } else if (
        role?.includes("ROLE_CLIENT") ||
        role === "ROLE_CLIENT"
      ) {
        setNavigationList(
          navigation.filter(
            (item) =>
              item.label !== "Utilisateurs" &&
              item.label !== "Interventions" &&
              item.label !== "Dashboard"
          )
        );
      } else {
        setNavigationList([]);
      }
    } catch (error) {
      console.error("Impossible de lire le token utilisateur :", error);
      setNavigationList([]);
    }
  }, []);

  // Fermer le menu avec la touche Échap
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Bouton hamburger : visible uniquement sur mobile */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Ouvrir le menu"
        aria-expanded={isOpen}
        className="fixed left-4 top-4 z-[60] flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2.5 text-slate-700 shadow-md md:hidden"
      >
        <Menu size={22} />
      </button>

      {/* Fond assombri : mobile uniquement */}
      {isOpen && (
        <button
          type="button"
          onClick={closeSidebar}
          aria-label="Fermer le menu"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col",
          "border-r border-slate-200 bg-white",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0",
        ].join(" ")}
        >
        {/* En-tête */}
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-6 pl-16 md:pl-6">          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              Intervention
            </h1>
            <p className="text-xs text-slate-500">Manager</p>
          </div>

          <button
            type="button"
            onClick={closeSidebar}
            aria-label="Fermer le menu"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"
          >
            <X size={21} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navigationList?.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-lg px-3 py-3",
                    "text-sm font-medium transition-colors",
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  ].join(" ")
                }
              >
                <Icon size={19} className="shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Paramètres */}
        <div className="shrink-0 border-t border-slate-200 p-4">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <Settings size={19} className="shrink-0" />
            <span>Paramètres</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
