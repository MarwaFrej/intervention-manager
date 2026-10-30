import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

function DashboardLayout() {
  return (
    <div className="min-h-screen min-w-0 md:pl-64">
      <Sidebar />

      <div className="min-w-0 w-full">
        {/* Ton header existant */}
        <Header />

        <main className="w-full min-w-0 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>

  );
}

export default DashboardLayout;