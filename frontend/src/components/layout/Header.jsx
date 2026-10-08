import { Bell, LogOut } from "lucide-react";

function Header() {
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
            M
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-900">
              Marwa
            </p>

            <p className="text-xs text-slate-500">
              Administrateur
            </p>
          </div>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100"
          aria-label="Déconnexion"
        >
          <LogOut size={19} />
        </button>
      </div>
    </header>
  );
}

export default Header;