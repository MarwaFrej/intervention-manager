
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import timeGridPlugin from "@fullcalendar/react/timegrid";
import interactionPlugin from "@fullcalendar/react/interaction";
import frLocale from "@fullcalendar/react/locales/fr";
import { CalendarDays, RefreshCw } from "lucide-react";
import { getPlanningInterventions } from "../services/interventionService";
import themePlugin from "@fullcalendar/react/themes/classic";
import { X } from "lucide-react";
import InterventionCreate from "../pages/InterventionCreate";

import "@fullcalendar/react/skeleton.css";
import "@fullcalendar/react/themes/classic/theme.css";
import "@fullcalendar/react/themes/classic/palette.css";


const getStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case "NEW":
    case "NOUVELLE":
      return "#3B82F6"; // Bleu

    case "IN_PROGRESS":
    case "IN PROGRESS":
    case "EN_COURS":
    case "EN COURS":
      return "#F59E0B"; // Orange

    case "COMPLETED":
    case "FINISHED":
    case "TERMINEE":
    case "TERMINÉE":
    case "TERMINE":
    case "TERMINÉ":
      return "#10B981"; // Vert

    case "CANCELED":
    case "ANNULEE":
    case "ANNULÉE":
      return "#EF4444"; // Rouge

    default:
      return "#6B7280"; // Gris
  }
};

function toLocalDateTime(date) {
  const pad = (value) => String(value).padStart(2, "0");

  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  );
}

export default function Planning() {
  const navigate = useNavigate();

  const [interventions, setInterventions] = useState([]);
  const [period, setPeriod] = useState(null);
  const [technicianFilter, setTechnicianFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
	const [createModalOpen, setCreateModalOpen] = useState(false);
	const [selectedDateTime, setSelectedDateTime] = useState("");

  const loadPlanning = useCallback(async () => {
    if (!period) return;

    try {
      setLoading(true);
      setError("");

      const data = await getPlanningInterventions(
        toLocalDateTime(period.start),
        toLocalDateTime(period.end)
      );

      setInterventions(data);
    } catch (err) {
      console.error("Erreur chargement planning :", err);
      setError("Impossible de charger les interventions du planning.");
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    loadPlanning();
  }, [loadPlanning]);

  const technicians = useMemo(() => {
    const unique = new Map();

    interventions.forEach((intervention) => {
      if (intervention.technicianId != null) {
        unique.set(
          String(intervention.technicianId),
          intervention.technicianName || `Technicien ${intervention.technicianId}`
        );
      }
    });

    return Array.from(unique, ([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name, "fr"));
  }, [interventions]);
	
	const events = useMemo(() => {
		return interventions
			.filter((intervention) => {
				if (technicianFilter === "ALL") return true;

				if (technicianFilter === "UNASSIGNED") {
					return intervention.technicianId == null;
				}

				return String(intervention.technicianId) === technicianFilter;
			})
			.map((intervention) => {
				const color = getStatusColor(intervention.status);

				return {
					id: String(intervention.id),
					title: intervention.title,
					start: intervention.scheduledAt,
					backgroundColor: color,
					borderColor: color,
					textColor: "#FFFFFF",
					classNames: [`status-${intervention.status.toLowerCase()}`],
					extendedProps: {
						technicianName: intervention.technicianName || "Non assignée",
						status: intervention.status,
						technicianId: intervention.technicianId,
						color,
					},
				};
			});
	}, [interventions, technicianFilter]);

  const handleDatesSet = useCallback((info) => {
    setPeriod((previous) => {
      if (
        previous &&
        previous.start.getTime() === info.start.getTime() &&
        previous.end.getTime() === info.end.getTime()
      ) {
        return previous;
      }

      return {
        start: new Date(info.start),
        end: new Date(info.end),
      };
    });
  }, []);

  const handleEventClick = useCallback(
    (info) => {
      info.jsEvent.preventDefault();
      navigate(`/interventions/${info.event.id}`);
    },
    [navigate]
  );

	const handleDateClick = useCallback((info) => {
  const date = info.date;
  const pad = (value) => String(value).padStart(2, "0");

  const formattedDate =
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`;

		setSelectedDateTime(formattedDate);
		setCreateModalOpen(true);
	}, []);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
     <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Planning des interventions
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Consultez les interventions par date, heure et technicien.
          </p>
        </div>

        <button
          type="button"
          onClick={loadPlanning}
          disabled={loading || !period}
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Actualiser
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label
          htmlFor="technicianFilter"
          className="text-sm font-medium text-gray-700"
        >
          Filtrer par technicien
        </label>

        <select
          id="technicianFilter"
          value={technicianFilter}
          onChange={(event) => setTechnicianFilter(event.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
        >
          <option value="ALL">Tous les techniciens</option>
          <option value="UNASSIGNED">Interventions non assignées</option>

          {technicians.map((technician) => (
            <option key={technician.id} value={technician.id}>
              {technician.name}
            </option>
          ))}
        </select>

       
			<div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
				<div className="flex items-center gap-2">
					<span className="h-3 w-3 rounded-sm bg-blue-500" />
					Nouvelle
				</div>

				<div className="flex items-center gap-2">
					<span className="h-3 w-3 rounded-sm bg-amber-500" />
					En cours
				</div>

				<div className="flex items-center gap-2">
					<span className="h-3 w-3 rounded-sm bg-emerald-500" />
					Terminée
				</div>

				<div className="flex items-center gap-2">
					<span className="h-3 w-3 rounded-sm bg-red-500" />
					Annulée
				</div>
			</div>

      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {loading && (
        <p className="text-sm text-gray-500">
          Chargement des interventions…
        </p>
      )}

<div className="w-full min-w-0 rounded-xl border border-gray-200 bg-white p-2 shadow-sm sm:p-3 md:p-5">
  <FullCalendar
    plugins={[
      themePlugin,
      dayGridPlugin,
      timeGridPlugin,
      interactionPlugin,
    ]}
    initialView={isMobile ? "timeGridDay" : "timeGridWeek"}
    locale={frLocale}
    firstDay={1}
    height="auto"
    handleWindowResize={true}
    headerToolbar={
      isMobile
        ? {
            left: "prev,next",
            center: "title",
            right: "dayGridMonth,timeGridDay",
          }
        : {
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }
    }
    datesSet={handleDatesSet}
    events={events}
    eventClick={handleEventClick}
    eventDisplay="block"
    displayEventTime
    slotMinTime="07:00:00"
    slotMaxTime="20:00:00"
    allDaySlot={false}
    nowIndicator
    noEventsContent="Aucune intervention sur cette période"
    dateClick={handleDateClick}
    eventContent={(arg) => {
      const color = getStatusColor(arg.event.extendedProps.status);

      return {
        html: `
          <div style="
            background: ${color} !important;
            color: white;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            padding: 4px;
            border-radius: 4px;
            overflow: hidden;
          ">
            <div style="
              font-weight: 600;
              font-size: 12px;
              overflow: hidden;
              text-overflow: ellipsis;
            ">
              ${arg.event.title}
            </div>
            <div style="font-size: 11px; overflow: hidden; text-overflow: ellipsis;">
              ${arg.event.extendedProps.technicianName || ""}
            </div>
          </div>
        `,
      };
    }}
    eventDidMount={(info) => {
      const color = getStatusColor(info.event.extendedProps.status);

      info.el.style.setProperty("background", color, "important");
      info.el.style.setProperty("background-color", color, "important");
      info.el.style.setProperty("border-color", color, "important");

      info.el.querySelectorAll(
        ".fc-event-main, .fc-event-main-frame"
      ).forEach((element) => {
        element.style.setProperty("background", color, "important");
        element.style.setProperty("background-color", color, "important");
        element.style.setProperty("color", "#FFFFFF", "important");
      });
    }}
  />
</div>

{createModalOpen && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    onMouseDown={(event) => {
      if (event.target === event.currentTarget) {
        setCreateModalOpen(false);
      }
    }}
  >
    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">
          Nouvelle intervention
        </h2>

        <button
          type="button"
          onClick={() => setCreateModalOpen(false)}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          aria-label="Fermer"
        >
          <X size={20} />
        </button>
      </div>

      <InterventionCreate
        isModal
        initialScheduledAt={selectedDateTime}
        onCancel={() => setCreateModalOpen(false)}
        onCreated={() => {
          setCreateModalOpen(false);
          loadPlanning();
        }}
      />
    </div>
  </div>
)}

    </div>
  );

	
}
