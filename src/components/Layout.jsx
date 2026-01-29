import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Calendar } from "lucide-react";

const Layout = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[#1e3a8a] border-b border-[#1e40af] shadow-sm">
        <div className="mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white">
                <LayoutDashboard className="h-6 w-6 text-[#1e3a8a]" />
              </div>
              <span className="text-xl font-bold text-white">HRMS Lite</span>
            </div>
            <div className="flex gap-1">
              <Link
                to="/dashboard"
                data-testid="nav-dashboard"
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/dashboard")
                    ? "bg-white text-[#1e3a8a]"
                    : "text-white hover:bg-[#1e40af]"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                to="/employees"
                data-testid="nav-employees"
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/employees")
                    ? "bg-white text-[#1e3a8a]"
                    : "text-white hover:bg-[#1e40af]"
                }`}
              >
                <Users className="h-4 w-4" />
                Employees
              </Link>
              <Link
                to="/attendance"
                data-testid="nav-attendance"
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/attendance")
                    ? "bg-white text-[#1e3a8a]"
                    : "text-white hover:bg-[#1e40af]"
                }`}
              >
                <Calendar className="h-4 w-4" />
                Attendance
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;