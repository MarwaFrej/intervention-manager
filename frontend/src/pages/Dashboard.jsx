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
import { jwtDecode } from "jwt-decode";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [allowClients, setAllowClients] = useState(false);

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

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        const role = decodedToken.role;
        
        if (role?.length > 0 && role[0] === "ROLE_ADMIN") {
          setAllowClients(true);
        } else {
          setAllowClients(false);
        }
      }
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

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 ">
        {allowClients && (
          <StatCard
          title="Total clients"
          value={stats.totalClients}
          icon={Users}
          description="Clients enregistrés"
          color="bg-blue-100 text-blue-700"
        />)}

        <StatCard
          title="Total interventions"
          value={stats.totalInterventions}
          icon={BriefcaseBusiness}
          description="Interventions enregistrées"
          color="bg-purple-100 text-purple-700"
        />

        <StatCard
          title="Nouvelles"
          value={stats.newInterventions}
          icon={Zap}
          description="À traiter"
          color="bg-yellow-100 text-yellow-700"
        />

        <StatCard
          title="En cours"
          value={stats.inProgressInterventions}
          icon={Clock3}
          description="Interventions en cours"
          color="bg-orange-100 text-orange-700"
        />

        <StatCard
          title="Terminées"
          value={stats.completedInterventions}
          icon={CheckCircle2}
          description="Interventions terminées"
          color="bg-green-100 text-green-700"
        />

        <StatCard
          title="Annulées"
          value={stats.cancelledInterventions}
          icon={XCircle}
          description="Interventions annulées"
          color="bg-red-100 text-red-700"
        />
      </div>
    </div>
  );
}

export default Dashboard;