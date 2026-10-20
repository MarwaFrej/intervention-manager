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
    // Réinitialiser ici l'état utilisateur et l'état d'authentification
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const role = decodedToken.role;
      if (role?.length > 0 && role[0] === "ROLE_ADMIN") {
        setRole("Administrateur");
      } else if (role?.length > 0 && role[0] === "ROLE_TECHNICIAN") {
        setRole("Technicien");
      } else if (role?.length > 0 && role[0] === "ROLE_CLIENT") {
        setRole("Client");
      }
      setUsername(decodedToken.sub);
    }
  }, []);



  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div>
        <p className="text-sm font-medium text-slate-500">
          Gestion des interventions
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="relative rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100"
          aria-label="Notifications"
        >
          <Bell size={20} />

          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            {username.charAt(0).toLocaleUpperCase()}
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-900">
              {username}
            </p>

            <p className="text-xs text-slate-500">
              {role}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100"
          onClick={handleLogout}
          aria-label="Déconnexion"
        >
          <LogOut size={19} />
        </button>
      </div>
    </header>
  );
}

export default Header;