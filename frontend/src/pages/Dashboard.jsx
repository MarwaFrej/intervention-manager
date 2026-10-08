import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Users,
  XCircle,
  Zap,
} from "lucide-react";

import StatCard from "../components/dashboard/StatCard";
import { getDashboard } from "../services/dashboardService";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getDashboard();
        setStats(data);
      } catch (err) {
        console.error("Erreur lors du chargement du dashboard :", err);
        setError("Impossible de charger les statistiques.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div>
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Dashboard
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Vue d'ensemble de votre activité.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-xl border border-slate-200 bg-white"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">
          Dashboard
        </h2>

        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">
          Dashboard
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Vue d'ensemble de votre activité.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Total clients"
          value={stats.totalClients}
          icon={Users}
          description="Clients enregistrés"
        />

        <StatCard
          title="Total interventions"
          value={stats.totalInterventions}
          icon={BriefcaseBusiness}
          description="Interventions enregistrées"
        />

        <StatCard
          title="Nouvelles"
          value={stats.newInterventions}
          icon={Zap}
          description="À traiter"
        />

        <StatCard
          title="En cours"
          value={stats.inProgressInterventions}
          icon={Clock3}
          description="Interventions en cours"
        />

        <StatCard
          title="Terminées"
          value={stats.completedInterventions}
          icon={CheckCircle2}
          description="Interventions terminées"
        />

        <StatCard
          title="Annulées"
          value={stats.cancelledInterventions}
          icon={XCircle}
          description="Interventions annulées"
        />
      </div>
    </div>
  );
}

export default Dashboard;