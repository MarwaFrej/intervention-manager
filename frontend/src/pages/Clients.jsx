import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  deleteClient,
  getClients,
} from "../services/clientService";

function Clients() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const loadClients = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getClients();
      setClients(data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ??
          "Impossible de charger les clients.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const filteredClients = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return clients;
    }

    return clients.filter((client) => {
      const fullName =
        `${client.firstName} ${client.lastName}`.toLowerCase();

      return (
        fullName.includes(normalizedSearch) ||
        client.email.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [clients, search]);

  const handleDelete = async (client) => {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer le client ${client.firstName} ${client.lastName} ?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(client.id);
      setError("");

      await deleteClient(client.id);

      setClients((current) =>
        current.filter((item) => item.id !== client.id),
      );
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ??
          "Impossible de supprimer le client.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Clients
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Gérez les clients de votre entreprise.
          </p>
        </div>

        <Link
          to="/clients/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Plus size={18} />
          Nouveau client
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher un client..."
            className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="space-y-4 p-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-12 animate-pulse rounded-lg bg-slate-100"
              />
            ))}
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="font-medium text-slate-900">
              Aucun client trouvé
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {search
                ? "Essayez une autre recherche."
                : "Commencez par créer votre premier client."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Client
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Email
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredClients.map((client) => (
                  <tr
                    key={client.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                          {client.firstName?.charAt(0)}
                          {client.lastName?.charAt(0)}
                        </div>

                        <div>
                          <p className="font-medium text-slate-900">
                            {client.firstName} {client.lastName}
                          </p>

                          <p className="text-xs text-slate-500">
                            Client #{client.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {client.email}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1">
                        <Link
                          to={`/clients/${client.id}`}
                          title="Voir le client"
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                          <Eye size={18} />
                        </Link>

                        <Link
                          to={`/clients/${client.id}/edit`}
                          title="Modifier le client"
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                          <Pencil size={18} />
                        </Link>

                        <button
                          type="button"
                          title="Supprimer le client"
                          disabled={deletingId === client.id}
                          onClick={() => handleDelete(client)}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer */}
      {!loading && filteredClients.length > 0 && (
        <p className="text-sm text-slate-500">
          {filteredClients.length} client
          {filteredClients.length > 1 ? "s" : ""} affiché
          {filteredClients.length > 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}

export default Clients;

