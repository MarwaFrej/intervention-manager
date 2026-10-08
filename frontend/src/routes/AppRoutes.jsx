import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import Clients from "../pages/Clients";
import Dashboard from "../pages/Dashboard";
import Interventions from "../pages/Interventions";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Users from "../pages/Users";
import ProtectedRoute from "./ProtectedRoute";
import InterventionDetail from "../pages/InterventionDetail";
import InterventionEdit from "../pages/InterventionEdit";
import InterventionCreate from "../pages/InterventionCreate";
import ClientCreate from "../pages/ClientCreate";
import ClientEdit from "../pages/ClientEdit";
import ClientDetail from "../pages/ClientDetail";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/interventions" element={<Interventions />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/users" element={<Users />} />
        </Route>
      </Route>
      <Route path="/interventions/:id" element={<InterventionDetail />}/>
      <Route path="/interventions/:id/edit" element={<InterventionEdit />}/>
      <Route path="/interventions/new" element={<InterventionCreate />}/>

      <Route path="/clients" element={<Clients />} />
      <Route path="/clients/new" element={<ClientCreate />} />
      <Route path="/clients/:id/edit" element={<ClientEdit />} />
      <Route path="/clients/:id" element={<ClientDetail />} />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;