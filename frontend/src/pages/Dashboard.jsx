
import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";

import StatCard from "../components/dashboard/StatCard";
import { getDashboard } from "../services/dashboardService";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [allowClients, setAllowClients] = useState(false);

  useEffect(() => {
    // Déterminer le rôle de l'utilisateur
    try {
      const token = localStorage.getItem("token");

      if (token) {
        const decodedToken = jwtDecode(token);
        const role = decodedToken.role;

        setAllowClients(
          Array.isArray(role)
            ? role.includes("ROLE_ADMIN")
            : role === "ROLE_ADMIN"
        );
      }
    } catch (err) {
      console.error("Erreur lors de la lecture du token :", err);
      setAllowClients(false);
    }

    // Charger les statistiques
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
      <div className="w-full min-w-0">
        <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Dashboard
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Vue d'ensemble de votre activité.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
          {Array.from({ length: allowClients ? 6 : 5 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-xl border border-slate-200 bg-white sm:h-32"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-w-0">
        <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Dashboard
        </h2>

        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 sm:p-5">
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  const cards = [
    ...(allowClients
      ? [
          {
            title: "Total clients",
            value: stats.totalClients,
            icon: Users,
            description: "Clients enregistrés",
            color: "bg-blue-100 text-blue-700",
          },
        ]
      : []),
    {
      title: "Total interventions",
      value: stats.totalInterventions,
      icon: BriefcaseBusiness,
      description: "Interventions enregistrées",
      color: "bg-purple-100 text-purple-700",
    },
    {
      title: "Nouvelles",
      value: stats.newInterventions,
      icon: Zap,
      description: "À traiter",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      title: "En cours",
      value: stats.inProgressInterventions,
      icon: Clock3,
      description: "Interventions en cours",
      color: "bg-orange-100 text-orange-700",
    },
    {
      title: "Terminées",
      value: stats.completedInterventions,
      icon: CheckCircle2,
      description: "Interventions terminées",
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Annulées",
      value: stats.cancelledInterventions,
      icon: XCircle,
      description: "Interventions annulées",
      color: "bg-red-100 text-red-700",
    },
  ];

  return (
    <div className="w-full min-w-0">
      {/* En-tête */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Dashboard
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Vue d'ensemble de votre activité.
        </p>
      </div>

      {/* Statistiques responsive */}
      <div className="mt-5 grid w-full min-w-0 grid-cols-1 gap-4 sm:mt-6 sm:grid-cols-2 2xl:grid-cols-3">
        {cards.map((card) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            description={card.description}
            color={card.color}
          />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
