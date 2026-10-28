
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Navigation,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import { getMapInterventions } from "../services/interventionService";
import { getUsers } from "../services/userService";
import { jwtDecode } from "jwt-decode";

const statusLabels = {
  NEW: "Nouvelle",
  IN_PROGRESS: "En cours",
  COMPLETED: "Terminée",
  CANCELED: "Annulée",
};

const statusColors = {
  NEW: "#3B82F6",
  IN_PROGRESS: "#F59E0B",
  COMPLETED: "#10B981",
  CANCELED: "#EF4444",
};

const buildAddress = (item) =>
  [
    item.street,
    item.address,
    item.postalCode,
    item.city,
    item.country,
  ]
    .filter(Boolean)
    .join(", ");

const formatDate = (value) => {
  if (!value) return "Non planifiée";

  return new Date(value).toLocaleString("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

function FitMapToMarkers({ markers }) {
  const map = useMap();

  useEffect(() => {
    if (markers.length === 1) {
      map.setView(
        [markers[0].latitude, markers[0].longitude],
        15
      );
    } else if (markers.length > 1) {
      const bounds = markers.map((marker) => [
        marker.latitude,
        marker.longitude,
      ]);

      map.fitBounds(bounds, { padding: [35, 35], maxZoom: 14 });
    }
  }, [markers, map]);

  return null;
}

function InterventionMap() {
  const navigate = useNavigate();
  const [interventions, setInterventions] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [status, setStatus] = useState("");
  const [technicianId, setTechnicianId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [error, setError] = useState("");
  const [selectedIntervention, setSelectedIntervention] = useState(null);
  const [role, setRole] = useState("");

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			const decodedToken = jwtDecode(token);
			setRole(decodedToken.role ?? decodedToken.role.length > 0 ? decodedToken.role[0] : "");
		}
	}, [role]);
	const canChooseTechnician = ["ROLE_ADMIN", "ROLE_MANAGER"].includes(role);

  const loadInterventions = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getMapInterventions({
        status,
        technicianId: canChooseTechnician ? technicianId : "",
        start: startDate ? `${startDate}T00:00:00` : "",
        // La borne de fin est exclusive côté backend.
        end: endDate ? nextDayAtMidnight(endDate) : "",
      });

      setInterventions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ??
          "Impossible de charger les interventions."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterventions();
    // Chargement initial uniquement.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Géocodage de démonstration : idéalement, stocker les coordonnées
  // en base et les renvoyer dans InterventionResponse.
  useEffect(() => {
    let cancelled = false;

    async function geocodeAll() {
      setGeocoding(true);
      setMarkers([]);

      try {
        const results = [];

        // Traitement séquentiel pour limiter les requêtes au service.
        for (const intervention of interventions) {
          const address = buildAddress(intervention);
          if (!intervention.street || !intervention.city) continue;

          try {
            const query = new URLSearchParams({
              q: [
                intervention.street,
                intervention.postalCode,
                intervention.city,
                intervention.country || "France",
              ]
                .filter(Boolean)
                .join(", "),
              limit: "1",
            });

            const response = await fetch(
              `https://data.geopf.fr/geocodage/search?${query}`
            );

            if (!response.ok) continue;

            const data = await response.json();
            const coordinates = data.features?.[0]?.geometry?.coordinates;

            if (coordinates?.length >= 2) {
              results.push({
                ...intervention,
                address,
                longitude: coordinates[0],
                latitude: coordinates[1],
              });
            }
          } catch (geocodeError) {
            console.warn(
              "Géocodage impossible pour l'intervention",
              intervention.id,
              geocodeError
            );
          }
        }

        if (!cancelled) setMarkers(results);
      } finally {
        if (!cancelled) setGeocoding(false);
      }
    }

    if (interventions.length) {
      geocodeAll();
    } else {
      setMarkers([]);
      setGeocoding(false);
    }

    return () => {
      cancelled = true;
    };
  }, [interventions]);

  useEffect(() => {
  if (!canChooseTechnician) return;

  const loadTechnicians = async () => {
    try {
      const users = await getUsers();

      setTechnicians(
        users.filter((user) => user.role === "TECHNICIAN")
      );
    } catch (err) {
      console.error("Impossible de charger les techniciens", err);
    }
  };

  loadTechnicians();
}, [canChooseTechnician]);

  const counts = useMemo(
    () => ({
      total: interventions.length,
      new: interventions.filter((item) => item.status === "NEW").length,
      inProgress: interventions.filter(
        (item) => item.status === "IN_PROGRESS"
      ).length,
      completed: interventions.filter(
        (item) => item.status === "COMPLETED"
      ).length,
    }),
    [interventions]
  );

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    loadInterventions();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Carte des interventions
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Visualisez les interventions et accédez à leur itinéraire.
          </p>
        </div>

        <button
          type="button"
          onClick={loadInterventions}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={16} />
          Actualiser
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total affiché" value={counts.total} />
        <StatCard label="Nouvelles" value={counts.new} />
        <StatCard label="En cours" value={counts.inProgress} />
        <StatCard label="Terminées" value={counts.completed} />
      </div>

      <form
        onSubmit={handleFilterSubmit}
        className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-2 xl:grid-cols-5"
      >
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Statut
          </label>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
          >
            <option value="">Tous les statuts</option>
            <option value="NEW">Nouvelle</option>
            <option value="IN_PROGRESS">En cours</option>
            <option value="COMPLETED">Terminée</option>
            <option value="CANCELED">Annulée</option>
          </select>
        </div>

        {canChooseTechnician && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Technicien
            </label>
            <select
              value={technicianId}
              onChange={(event) => setTechnicianId(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
            >
              <option value="">Tous les techniciens</option>
              {technicians.map((technician) => (
                <option key={technician.id} value={technician.id}>
                  {technician.firstName} {technician.lastName}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Du
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Au
          </label>
          <input
            type="date"
            value={endDate}
            min={startDate || undefined}
            onChange={(event) => setEndDate(event.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? "Chargement..." : "Appliquer les filtres"}
          </button>
        </div>
      </form>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3">
          <h2 className="font-semibold text-slate-900">
            Emplacements des interventions
          </h2>
          <span className="text-sm text-slate-500">
            {markers.length} position(s) trouvée(s)
            {geocoding ? " — recherche des adresses..." : ""}
          </span>
        </div>

        <div className="h-[65vh] min-h-[420px]">
          <MapContainer
            center={[46.603354, 1.888334]}
            zoom={6}
            scrollWheelZoom
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <FitMapToMarkers markers={markers} />

            {markers.map((item) => (
              <Marker
                key={item.id}
                position={[item.latitude, item.longitude]}
                eventHandlers={{
                  click: () => setSelectedIntervention(item),
                }}
              >
                <Popup>
                  <div className="min-w-48 space-y-2">
                    <strong>{item.title}</strong>
                    <p>{item.address}</p>
                    <p>
                      {statusLabels[item.status] ?? item.status}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/interventions/${item.id}`)
                      }
                      className="font-semibold text-blue-700 underline"
                    >
                      Voir le détail
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {selectedIntervention && (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {selectedIntervention.title}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                <MapPin size={14} className="mr-1 inline" />
                {selectedIntervention.address}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Statut :{" "}
                {statusLabels[selectedIntervention.status] ??
                  selectedIntervention.status}
              </p>
              <p className="text-sm text-slate-600">
                Date prévue : {formatDate(selectedIntervention.scheduledAt)}
              </p>
              <p className="text-sm text-slate-600">
                Technicien : {selectedIntervention.technicianName || "Non assigné"}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                  selectedIntervention.address
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
              >
                <Navigation size={16} />
                Itinéraire
                <ExternalLink size={14} />
              </a>
              <button
                type="button"
                onClick={() =>
                  navigate(`/interventions/${selectedIntervention.id}`)
                }
                className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Voir le détail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function nextDayAtMidnight(date) {
  const next = new Date(`${date}T00:00:00`);
  next.setDate(next.getDate() + 1);

  const year = next.getFullYear();
  const month = String(next.getMonth() + 1).padStart(2, "0");
  const day = String(next.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}T00:00:00`;
}

export default InterventionMap;
