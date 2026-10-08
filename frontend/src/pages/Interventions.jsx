import { useEffect, useState } from "react";
import { Eye, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { getInterventions } from "../services/interventionService";
import { Link } from "react-router-dom";

const statusLabels = {
  NEW: "Nouvelle",
  IN_PROGRESS: "En cours",
  COMPLETED: "Terminée",
  CANCELLED: "Annulée",
};

const priorityLabels = {
  LOW: "Faible",
  MEDIUM: "Moyenne",
  HIGH: "Haute",
  URGENT: "Urgente",
};

const statusStyles = {
  NEW: "bg-blue-50 text-blue-700",
  IN_PROGRESS: "bg-amber-50 text-amber-700",
  COMPLETED: "bg-emerald-50 text-emerald-700",
  CANCELLED: "bg-red-50 text-red-700",
};

const priorityStyles = {
  LOW: "bg-slate-100 text-slate-700",
  MEDIUM: "bg-blue-50 text-blue-700",
  HIGH: "bg-orange-50 text-orange-700",
  URGENT: "bg-red-50 text-red-700",
};

function formatDate(date) {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

function Interventions() {
  const [interventions, setInterventions] = useState([]);

  const [page, setPage] = useState(0);
  const [size] = useState(10);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadInterventions = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getInterventions({
        page,
        size,
        search,
        status,
      });

      setInterventions(data.content ?? []);
      setTotalPages(data.totalPages ?? 0);
      setTotalElements(data.totalElements ?? 0);
    } catch (err) {
      console.error(err);

      setError(
        "Impossible de charger les interventions. Veuillez réessayer.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterventions();
  }, [page, search, status]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setPage(0);
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage((currentPage) => currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage((currentPage) => currentPage + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Interventions
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Gérez et suivez les interventions de vos clients.
          </p>
        </div>

        <Link
          to="/interventions/new"
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Nouvelle intervention
        </Link>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Rechercher une intervention..."
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>

          {/* Status */}
          <select
            value={status}
            onChange={handleStatusChange}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          >
            <option value="">Tous les statuts</option>
            <option value="NEW">Nouvelle</option>
            <option value="IN_PROGRESS">En cours</option>
            <option value="COMPLETED">Terminée</option>
            <option value="CANCELLED">Annulée</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Intervention
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Client
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Priorité
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Statut
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Technicien
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Prévue le
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading &&
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan="7" className="px-6 py-5">
                      <div className="h-5 w-full animate-pulse rounded bg-slate-100" />
                    </td>
                  </tr>
                ))}

              {!loading && interventions.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-sm text-slate-500"
                  >
                    Aucune intervention trouvée.
                  </td>
                </tr>
              )}

              {!loading &&
                interventions.map((intervention) => (
                  <tr
                    key={intervention.id}
                    className="transition hover:bg-slate-50"
                  >
                    {/* Intervention */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {intervention.title}
                        </p>

                        <p className="mt-1 max-w-xs truncate text-sm text-slate-500">
                          {intervention.description || "Aucune description"}
                        </p>
                      </div>
                    </td>

                    {/* Client */}
                    <td className="px-6 py-4 text-sm text-slate-700">
                      Client #{intervention.clientId}
                    </td>

                    {/* Priority */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          priorityStyles[intervention.priority] ??
                          "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {priorityLabels[intervention.priority] ??
                          intervention.priority}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          statusStyles[intervention.status] ??
                          "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {statusLabels[intervention.status] ??
                          intervention.status}
                      </span>
                    </td>

                    {/* Technician */}
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {intervention.technicianName ?? "Non assigné"}
                    </td>

                    {/* Scheduled date */}
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {formatDate(intervention.scheduledAt)}
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/interventions/${intervention.id}`}
                        title="Voir le détail"
                        className="inline-flex rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                      >
                        <Eye size={18} />
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalElements > 0 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
            <p className="text-sm text-slate-500">
              {totalElements} intervention
              {totalElements > 1 ? "s" : ""}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePreviousPage}
                disabled={page === 0}
                className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={18} />
              </button>

              <span className="px-2 text-sm font-medium text-slate-700">
                Page {page + 1} / {Math.max(totalPages, 1)}
              </span>

              <button
                type="button"
                onClick={handleNextPage}
                disabled={page >= totalPages - 1}
                className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Interventions;

