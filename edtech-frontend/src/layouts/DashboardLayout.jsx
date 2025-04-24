// src/layouts/DashboardLayout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";

const DashboardLayout = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar user={user} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader user={user} openSidebar={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto bg-secondary-50 p-4">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
