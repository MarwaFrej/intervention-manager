
import { Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

function Header() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.role;

      if (Array.isArray(userRole)) {
        if (userRole.includes("ROLE_ADMIN")) {
          setRole("Administrateur");
        } else if (userRole.includes("ROLE_TECHNICIAN")) {
          setRole("Technicien");
        } else if (userRole.includes("ROLE_CLIENT")) {
          setRole("Client");
        }
      } else {
        if (userRole === "ROLE_ADMIN") {
          setRole("Administrateur");
        } else if (userRole === "ROLE_TECHNICIAN") {
          setRole("Technicien");
        } else if (userRole === "ROLE_CLIENT") {
          setRole("Client");
        }
      }

      setUsername(decodedToken.sub ?? "");
    } catch (error) {
      console.error("Erreur lors de la lecture du token :", error);
    }
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full min-w-0 items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 sm:px-6">
      {/* Titre */}
      <div className="min-w-0 flex-1 pl-14 sm:pl-0">
        <p className="truncate text-xs font-medium text-slate-500 sm:text-sm">
          Gestion des interventions
        </p>
      </div>

      {/* Actions et profil */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-4">
        <button
          type="button"
          className="relative rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100"
          aria-label="Notifications"
        >
          <Bell size={20} />

          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            {username ? username.charAt(0).toUpperCase() : "U"}
          </div>

          {/* Informations utilisateur masquées sur petit écran */}
          <div className="hidden min-w-0 sm:block">
            <p className="max-w-48 truncate text-sm font-semibold text-slate-900">
              {username}
            </p>

            <p className="text-xs text-slate-500">{role}</p>
          </div>
        </div>

        <button
          type="button"
          className="shrink-0 rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100"
          onClick={handleLogout}
          aria-label="Déconnexion"
          title="Déconnexion"
        >
          <LogOut size={19} />
        </button>
      </div>
    </header>
  );
}

export default Header;
