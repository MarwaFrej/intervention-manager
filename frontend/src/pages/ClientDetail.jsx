import { useEffect, useState } from "react";
import { ArrowLeft, Mail, Pencil, User } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { getClient } from "../services/clientService";

function ClientDetail() {
  const { id } = useParams();

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadClient = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getClient(id);
        setClient(data);
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.message ??
            "Impossible de charger le client.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadClient();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 p-8">
        <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div className="h-6 w-48 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-64 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-56 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 p-8">
        <Link
          to="/clients"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft size={18} />
          Retour aux clients
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
          to="/clients"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft size={18} />
          Retour aux clients
        </Link>

        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              {client.firstName} {client.lastName}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Informations du client
            </p>
          </div>

          <Link
            to={`/clients/${client.id}/edit`}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Pencil size={17} />
            Modifier
          </Link>
        </div>
      </div>

      {/* Client information */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">
            Informations personnelles
          </h2>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          {/* Name */}
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <User size={19} />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Nom complet
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-900">
                {client.firstName} {client.lastName}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <Mail size={19} />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Adresse email
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-900">
                {client.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Client ID */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="px-6 py-5">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Identifiant client
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-900">
            #{client.id}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ClientDetail;

