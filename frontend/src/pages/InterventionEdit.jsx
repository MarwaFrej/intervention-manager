import { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  getIntervention,
  updateIntervention,
} from "../services/interventionService";

const priorities = [
  { value: "LOW", label: "Faible" },
  { value: "MEDIUM", label: "Moyenne" },
  { value: "HIGH", label: "Haute" },
  { value: "URGENT", label: "Urgente" },
];

function toDateTimeLocal(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);

  return localDate.toISOString().slice(0, 16);
}

function InterventionEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

	const [form, setForm] = useState({
		title: "",
		description: "",
		priority: "MEDIUM",
		scheduledAt: "",
		clientId: null,
		technicianId: null,
		technicianName: null,
	});

  useEffect(() => {
    const loadIntervention = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getIntervention(id);

       setForm({
					title: data.title ?? "",
					description: data.description ?? "",
					priority: data.priority ?? "MEDIUM",
					scheduledAt: toDateTimeLocal(data.scheduledAt),
					clientId: data.clientId ?? null,
					technicianId: data.technicianId ?? null,
					technicianName: data.technicianName ?? null,
				});
      } catch (err) {
        console.error(err);

        setError(
          "Impossible de charger les informations de l'intervention.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadIntervention();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        scheduledAt: form.scheduledAt
          ? `${form.scheduledAt}:00`
          : null,
      };

      await updateIntervention(id, payload);

      setSuccess("Intervention modifiée avec succès.");

      setTimeout(() => {
        navigate(`/interventions/${id}`);
      }, 700);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ??
          "Impossible de modifier l'intervention.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-52 animate-pulse rounded bg-slate-200" />

        <div className="h-[500px] animate-pulse rounded-xl bg-white shadow-sm" />
      </div>
    );
  }

  if (error && !form.title) {
    return (
      <div className="space-y-4">
        <Link
          to={`/interventions/${id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft size={18} />
          Retour
        </Link>

        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-8">
      {/* Header */}
      <div>
        <Link
          to={`/interventions/${id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft size={18} />
          Retour au détail
        </Link>

        <div className="mt-4">
          <h1 className="text-2xl font-semibold text-slate-900">
            Modifier l'intervention
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Modifiez les informations de l'intervention #{id}.
          </p>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="space-y-6 p-6">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Titre
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              required
              maxLength={255}
              placeholder="Ex. Réparation chaudière"
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={6}
              placeholder="Décrivez le problème ou l'intervention à réaliser..."
              className="w-full resize-y rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>

          {/* Priority + Date */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="priority"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Priorité
              </label>

              <select
                id="priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              >
                {priorities.map((priority) => (
                  <option
                    key={priority.value}
                    value={priority.value}
                  >
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="scheduledAt"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Date prévue
              </label>

              <input
                id="scheduledAt"
                name="scheduledAt"
                type="datetime-local"
                value={form.scheduledAt}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              />
            </div>
          </div>

          {/* Read-only information */}
					<div className="rounded-lg bg-slate-50 p-4">
						<p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
							Informations non modifiables
						</p>

						<div className="mt-3 grid gap-4 text-sm sm:grid-cols-2">
							<div>
								<span className="text-slate-500">Client</span>

								<p className="mt-1 font-medium text-slate-800">
									{form.clientId
										? `Client #${form.clientId}`
										: "Non renseigné"}
								</p>
							</div>

							<div>
								<span className="text-slate-500">Technicien</span>

								<p className="mt-1 font-medium text-slate-800">
									{form.technicianName ?? "Non assigné"}
								</p>
							</div>
						</div>
					</div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <Link
            to={`/interventions/${id}`}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Annuler
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={17} />

            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default InterventionEdit;

