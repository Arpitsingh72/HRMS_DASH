import { useEffect, useState, useCallback  } from "react";
import axios from "axios";
import { Calendar, Filter, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Attendance = () => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMarkDialog, setShowMarkDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [formData, setFormData] = useState({
    employee_id: "",
    date: new Date().toISOString().split('T')[0],
    status: "Present"
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterAttendance();
  }, [filterAttendance]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [employeesRes, attendanceRes] = await Promise.all([
        axios.get(`${API}/employees`),
        axios.get(`${API}/attendance`)
      ]);
      setEmployees(employeesRes.data);
      setAttendance(attendanceRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // const filterAttendance = () => {
  //   if (!selectedDate) {
  //     setFilteredAttendance(attendance);
  //   } else {
  //     const filtered = attendance.filter(record => record.date === selectedDate);
  //     setFilteredAttendance(filtered);
  //   }
  // };


  const filterAttendance = useCallback(() => {
  if (!selectedDate) {
    setFilteredAttendance(attendance);
  } else {
    const filtered = attendance.filter(
      (record) => record.date === selectedDate
    );
    setFilteredAttendance(filtered);
  }
}, [attendance, selectedDate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.employee_id || !formData.date || !formData.status) {
      toast.error("All fields are required");
      return;
    }

    try {
      setSubmitting(true);
      await axios.post(`${API}/attendance`, formData);
      toast.success("Attendance marked successfully");
      setShowMarkDialog(false);
      setFormData({
        employee_id: "",
        date: new Date().toISOString().split('T')[0],
        status: "Present"
      });
      fetchData();
    } catch (error) {
      console.error("Error marking attendance:", error);
      toast.error(error.response?.data?.detail || "Failed to mark attendance");
    } finally {
      setSubmitting(false);
    }
  };

  const getTotalPresentDays = (employeeId) => {
    return attendance.filter(record => 
      record.employee_id === employeeId && record.status === "Present"
    ).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div data-testid="attendance-page">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Attendance Management</h1>
          <p className="text-gray-600 mt-1">Track and manage employee attendance</p>
        </div>
        <Button
          onClick={() => setShowMarkDialog(true)}
          data-testid="mark-attendance-button"
          disabled={employees.length === 0}
          className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Mark Attendance
        </Button>
      </div>

      <div className="section-card mb-6">
        <div className="flex items-center gap-4">
          <Filter className="h-5 w-5 text-[#1e3a8a]" />
          <Label htmlFor="date-filter" className="font-medium">Filter by Date:</Label>
          <input
            id="date-filter"
            type="date"
            data-testid="date-filter-input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="form-input max-w-xs"
          />
          {selectedDate && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate("")}
              data-testid="clear-date-filter"
            >
              Clear Filter
            </Button>
          )}
        </div>
      </div>

      <div className="section-card">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Attendance Records</h2>
        
        {filteredAttendance.length === 0 ? (
          <div className="empty-state" data-testid="no-attendance-records">
            <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p className="text-lg font-medium">
              {selectedDate ? "No attendance records for this date" : "No attendance records yet"}
            </p>
            <p className="text-sm mt-1">
              {employees.length === 0 
                ? "Please add employees first before marking attendance"
                : "Click 'Mark Attendance' to add records"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table" data-testid="attendance-table">
              <thead className="table-header">
                <tr>
                  <th className="table-cell text-left">Employee ID</th>
                  <th className="table-cell text-left">Employee Name</th>
                  <th className="table-cell text-left">Date</th>
                  <th className="table-cell text-left">Status</th>
                  <th className="table-cell text-left">Total Present Days</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.map((record, index) => (
                  <tr key={index} className="table-row" data-testid={`attendance-record-${index}`}>
                    <td className="table-cell font-medium">{record.employee_id}</td>
                    <td className="table-cell">{record.employee_name}</td>
                    <td className="table-cell">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="table-cell">
                      <span
                        className={`badge ${
                          record.status === "Present" ? "badge-present" : "badge-absent"
                        }`}
                        data-testid={`status-${record.status.toLowerCase()}`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="table-cell font-semibold text-[#1e3a8a]">
                      {getTotalPresentDays(record.employee_id)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={showMarkDialog} onOpenChange={setShowMarkDialog}>
        <DialogContent data-testid="mark-attendance-dialog">
          <DialogHeader>
            <DialogTitle>Mark Attendance</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="employee">Select Employee *</Label>
                <Select
                  value={formData.employee_id}
                  onValueChange={(value) => setFormData({ ...formData, employee_id: value })}
                  required
                >
                  <SelectTrigger data-testid="select-employee">
                    <SelectValue placeholder="Select an employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.employee_id} value={emp.employee_id}>
                        {emp.employee_id} - {emp.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="date">Date *</Label>
                <input
                  id="date"
                  type="date"
                  data-testid="input-attendance-date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                  required
                >
                  <SelectTrigger data-testid="select-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Present">Present</SelectItem>
                    <SelectItem value="Absent">Absent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowMarkDialog(false)}
                data-testid="cancel-mark-attendance"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                data-testid="submit-mark-attendance"
                disabled={submitting}
                className="bg-[#1e3a8a] hover:bg-[#1e40af]"
              >
                {submitting ? "Marking..." : "Mark Attendance"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Attendance;