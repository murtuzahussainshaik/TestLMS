// src/layouts/MainLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-secondary-900">
      <Navbar />
      <main className="flex-grow bg-secondary-50 dark:bg-secondary-950">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
