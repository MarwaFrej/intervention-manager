import { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { createIntervention } from "../services/interventionService";
import { getClients } from "../services/clientService";

const priorities = [
  { value: "LOW", label: "Faible" },
  { value: "MEDIUM", label: "Moyenne" },
  { value: "HIGH", label: "Haute" },
  { value: "URGENT", label: "Urgente" },
];

function InterventionCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    scheduledAt: "",
    clientId: "",
  });

  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadClients = async () => {
      try {
        setLoadingClients(true);
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
        setLoadingClients(false);
      }
    };

    loadClients();
  }, []);

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

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        clientId: Number(form.clientId),
        scheduledAt: form.scheduledAt
          ? `${form.scheduledAt}:00`
          : null,
      };

      await createIntervention(payload);

      navigate("/interventions");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ??
          "Impossible de créer l'intervention.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-8">
      {/* Header */}
      <div>
        <Link
          to="/interventions"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft size={18} />
          Retour aux interventions
        </Link>

        <div className="mt-4">
          <h1 className="text-2xl font-semibold text-slate-900">
            Nouvelle intervention
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Créez une nouvelle intervention pour un client.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="space-y-6 p-6">
          {/* Client */}
          <div>
            <label
              htmlFor="clientId"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Client
            </label>

            <select
              id="clientId"
              name="clientId"
              value={form.clientId}
              onChange={handleChange}
              required
              disabled={loadingClients}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50"
            >
              <option value="">
                {loadingClients
                  ? "Chargement des clients..."
                  : "Sélectionnez un client"}
              </option>

              {clients.map((client) => (
                <option
                  key={client.id}
                  value={client.id}
                >
                  {client.firstName} {client.lastName} — {client.email}
                </option>
              ))}
            </select>

            {!loadingClients && clients.length === 0 && (
              <p className="mt-1.5 text-xs text-slate-500">
                Aucun client disponible. Créez d'abord un client.
              </p>
            )}
          </div>

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
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
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
              className="w-full resize-y rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>

          {/* Priority + date */}
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
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
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
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <Link
            to="/interventions"
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Annuler
          </Link>

          <button
            type="submit"
            disabled={saving || loadingClients || clients.length === 0}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={17} />

            {saving ? "Création..." : "Créer l'intervention"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default InterventionCreate;

