import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  User,
  UserRound,
  FileText,
  RefreshCw,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  getIntervention,
  getInterventionHistory,
  updateInterventionStatus,
  assignTechnician,
} from "../services/interventionService";

import { getTechnicians } from "../services/userService";
import { UserCheck } from "lucide-react";

import { jwtDecode } from "jwt-decode";
import InterventionMap from "../components/InterventionMap";

const statusLabels = {
  NEW: "Nouvelle",
  IN_PROGRESS: "En cours",
  COMPLETED: "Terminée",
  CANCELED: "Annulée",
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
  CANCELED: "bg-red-50 text-red-700",
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
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function InterventionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [intervention, setIntervention] = useState(null);
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);

  const [status, setStatus] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [error, setError] = useState("");

  const [technicians, setTechnicians] = useState([]);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState("");
  const [loadingTechnicians, setLoadingTechnicians] = useState(true);
  const [assigningTechnician, setAssigningTechnician] = useState(false);
  const [assignmentError, setAssignmentError] = useState("");
  const [assignmentSuccess, setAssignmentSuccess] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getIntervention(id);
        setSelectedTechnicianId(
          data.technicianId != null ? String(data.technicianId) : ""
        );
        setIntervention(data);
        setStatus(data.status);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger l'intervention.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setHistoryLoading(true);

        const data = await getInterventionHistory(id);

        setHistory(Array.isArray(data) ? data : data.content ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setHistoryLoading(false);
      }
    };

    loadHistory();
  }, [id]);

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;

    try {
      setUpdatingStatus(true);

      const updated = await updateInterventionStatus(id, newStatus);

      setIntervention((current) => ({
        ...current,
        ...(updated ?? {}),
        status: newStatus,
      }));

      setStatus(newStatus);

      const updatedHistory = await getInterventionHistory(id);

      setHistory(
        Array.isArray(updatedHistory)
          ? updatedHistory
          : updatedHistory.content ?? [],
      );
    } catch (err) {
      console.error(err);

      setError("Impossible de modifier le statut.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  useEffect(() => {
    const loadTechnicians = async () => {
      try {
        setLoadingTechnicians(true);
        const data = await getTechnicians();
        setTechnicians(data);
      } catch (err) {
        console.error(err);
        setAssignmentError("Impossible de charger les techniciens.");
      } finally {
        setLoadingTechnicians(false);
      }
    };

    loadTechnicians();
  }, []);

    useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setRole(decodedToken.role ?? decodedToken.role.length > 0 ? decodedToken.role[0] : "");
    }
  }, []);

  const handleAssignTechnician = async () => {
    if (!selectedTechnicianId) {
      setAssignmentError("Sélectionne un technicien.");
      return;
    }

    try {
      setAssigningTechnician(true);
      setAssignmentError("");
      setAssignmentSuccess("");

      await assignTechnician(id, Number(selectedTechnicianId));

      const updatedIntervention = await getIntervention(id);

      setIntervention(updatedIntervention);
      setSelectedTechnicianId(
        updatedIntervention.technicianId != null
          ? String(updatedIntervention.technicianId)
          : ""
      );

      setAssignmentSuccess("Technicien affecté avec succès.");
    } catch (err) {
      console.error(err);
      setAssignmentError("Impossible d'affecter le technicien.");
    } finally {
      setAssigningTechnician(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
        <div className="h-64 animate-pulse rounded-xl bg-white shadow-sm" />
      </div>
    );
  }

  if (error && !intervention) {
    return (
      <div className="space-y-4 p-16">
        <button
          type="button"
          onClick={() => navigate("/interventions")}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={18} />
          Retour aux interventions
        </button>

        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link
          to="/interventions"
          className="inline-flex w-fit items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft size={18} />
          Retour aux interventions
        </Link>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-slate-900">
                {intervention.title}
              </h1>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  statusStyles[intervention.status] ??
                  "bg-slate-100 text-slate-700"
                }`}
              >
                {statusLabels[intervention.status] ??
                  intervention.status}
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Intervention #{intervention.id}
            </p>
          </div>

          {role === "ROLE_ADMIN" && (
          <Link
            to={`/interventions/${id}/edit`}
            className="inline-flex w-fit items-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Modifier
          </Link>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main information */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-5">
              <div className="flex items-center gap-2">
                <FileText size={19} className="text-slate-500" />

                <h2 className="font-semibold text-slate-900">
                  Informations
                </h2>
              </div>
            </div>

            <div className="space-y-6 p-6">
              <div>
                <p className="mb-2 text-sm font-medium text-slate-500">
                  Description
                </p>

                <p className="text-sm leading-6 text-slate-700">
                  {intervention.description ||
                    "Aucune description disponible."}
                </p>
              </div>

              <InterventionMap intervention={intervention} />

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-sm font-medium text-slate-500">
                    Client
                  </p>

                  <div className="flex items-center gap-2 text-sm text-slate-800">
                    <User size={17} className="text-slate-400" />
                    Client #{intervention.clientId}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-slate-500">
                    Technicien
                  </p>

                  <div className="flex items-center gap-2 text-sm text-slate-800">
                    <UserRound
                      size={17}
                      className="text-slate-400"
                    />

                    {intervention.technicianName ??
                      "Non assigné"}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-slate-500">
                    Priorité
                  </p>

                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      priorityStyles[intervention.priority] ??
                      "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {priorityLabels[intervention.priority] ??
                      intervention.priority}
                  </span>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-slate-500">
                    Date prévue
                  </p>

                  <div className="flex items-center gap-2 text-sm text-slate-800">
                    <CalendarDays
                      size={17}
                      className="text-slate-400"
                    />

                    {formatDate(intervention.scheduledAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* History */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-5">
              <div className="flex items-center gap-2">
                <Clock size={19} className="text-slate-500" />

                <h2 className="font-semibold text-slate-900">
                  Historique des statuts
                </h2>
              </div>
            </div>

            <div className="p-6">
              {historyLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="h-12 animate-pulse rounded-lg bg-slate-100"
                    />
                  ))}
                </div>
              ) : history.length === 0 ? (
                <p className="text-sm text-slate-500">
                  Aucun changement de statut enregistré.
                </p>
              ) : (
                <div className="space-y-4">
                  {history.map((item, index) => (
                    <div
                      key={item.id ?? index}
                      className="flex gap-4"
                    >
                      <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-slate-400" />

                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800">
                          {statusLabels[item.oldStatus] ??
                            item.oldStatus ??
                            "Création"}{" "}
                          →{" "}
                          {statusLabels[item.newStatus] ??
                            item.newStatus}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {formatDate(
                            item.createdAt ??
                              item.changedAt ??
                              item.date,
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <RefreshCw size={19} className="text-slate-500" />

              <h2 className="font-semibold text-slate-900">
                Statut
              </h2>
            </div>

            <select
              value={status}
              onChange={handleStatusChange}
              disabled={updatingStatus}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="NEW">Nouvelle</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="COMPLETED">Terminée</option>
              <option value="CANCELED">Annulée</option>
            </select>

            {updatingStatus && (
              <p className="mt-2 text-xs text-slate-500">
                Mise à jour...
              </p>
            )}
          </div>

          {/* Technician assignment */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <UserCheck size={19} className="text-slate-500" />
              <h2 className="font-semibold text-slate-900">
                Affectation du technicien
              </h2>
            </div>

            <p className="mb-3 text-sm text-slate-500">
              Technicien actuel :{" "}
              <span className="font-medium text-slate-800">
                {intervention.technicianName || "Non assigné"}
              </span>
            </p>

          {
            role === "ROLE_ADMIN" && (
          
          loadingTechnicians ? ( <p className="text-sm text-slate-500">
          Chargement des techniciens... </p>
          ) : (
          <>
          <select
          value={selectedTechnicianId}
          onChange={(event) =>
          setSelectedTechnicianId(event.target.value)
          }
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          > <option value="">Choisir un technicien</option>


              {technicians.map((technician) => (
                <option key={technician.id} value={String(technician.id)}>
                  {technician.firstName} {technician.lastName}
                </option>
              ))}
          </select>

            <button
              type="button"
              onClick={handleAssignTechnician}
              disabled={!selectedTechnicianId || assigningTechnician}
              className="mt-3 w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {assigningTechnician ? "Affectation..." : "Affecter"}
            </button>
          </>


          ))}

          {role === "ROLE_ADMIN" && assignmentError && ( <p className="mt-3 text-sm text-red-600">
          {assignmentError} </p>
          )}

          {role === "ROLE_ADMIN" && assignmentSuccess && ( <p className="mt-3 text-sm text-emerald-700">
          {assignmentSuccess} </p>
          )}

          </div>

          {/* Metadata */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-semibold text-slate-900">
              Informations système
            </h2>

            <dl className="space-y-4">
              <div>
                <dt className="text-xs font-medium text-slate-500">
                  ID
                </dt>

                <dd className="mt-1 text-sm text-slate-800">
                  #{intervention.id}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-medium text-slate-500">
                  Créée le
                </dt>

                <dd className="mt-1 text-sm text-slate-800">
                  {formatDate(intervention.createdAt)}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-medium text-slate-500">
                  Dernière modification
                </dt>

                <dd className="mt-1 text-sm text-slate-800">
                  {formatDate(intervention.updatedAt)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InterventionDetail;

