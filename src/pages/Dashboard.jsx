import { useEffect, useState } from "react";
import axios from "axios";
import { Users, UserCheck, UserX, TrendingUp } from "lucide-react";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, attendanceRes] = await Promise.all([
        axios.get(`${API}/dashboard/stats`),
        axios.get(`${API}/attendance`)
      ]);
      setStats(statsRes.data);
      setRecentAttendance(attendanceRes.data.slice(0, 10));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div data-testid="dashboard-page">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your HR management system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="stat-card" data-testid="stat-total-employees">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Total Employees</p>
              <p className="text-3xl font-bold text-[#1e3a8a]">{stats?.total_employees || 0}</p>
            </div>
            <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="h-7 w-7 text-[#1e3a8a]" />
            </div>
          </div>
        </div>

        <div className="stat-card" data-testid="stat-present-today">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Present Today</p>
              <p className="text-3xl font-bold text-green-600">{stats?.total_present_today || 0}</p>
            </div>
            <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center">
              <UserCheck className="h-7 w-7 text-green-600" />
            </div>
          </div>
        </div>

        <div className="stat-card" data-testid="stat-absent-today">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Absent Today</p>
              <p className="text-3xl font-bold text-red-600">{stats?.total_absent_today || 0}</p>
            </div>
            <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center">
              <UserX className="h-7 w-7 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="section-card">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-5 w-5 text-[#1e3a8a]" />
          <h2 className="text-xl font-bold text-gray-800">Recent Attendance Records</h2>
        </div>

        {recentAttendance.length === 0 ? (
          <div className="empty-state" data-testid="no-attendance-records">
            <TrendingUp className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p className="text-lg font-medium">No attendance records yet</p>
            <p className="text-sm mt-1">Start marking attendance to see records here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table" data-testid="recent-attendance-table">
              <thead className="table-header">
                <tr>
                  <th className="table-cell text-left">Employee ID</th>
                  <th className="table-cell text-left">Employee Name</th>
                  <th className="table-cell text-left">Date</th>
                  <th className="table-cell text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAttendance.map((record, index) => (
                  <tr key={index} className="table-row" data-testid={`attendance-row-${index}`}>
                    <td className="table-cell font-medium">{record.employee_id}</td>
                    <td className="table-cell">{record.employee_name}</td>
                    <td className="table-cell">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="table-cell">
                      <span
                        className={`badge ${
                          record.status === "Present" ? "badge-present" : "badge-absent"
                        }`}
                        data-testid={`status-badge-${record.status.toLowerCase()}`}
                      >
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;