import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, Users, Mail, Building2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    department: ""
  });

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/employees`);
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.full_name || !formData.email || !formData.department) {
      toast.error("All fields are required");
      return;
    }

    try {
      setSubmitting(true);
      await axios.post(`${API}/employees`, formData);
      toast.success("Employee added successfully");
      setShowAddDialog(false);
      setFormData({ full_name: "", email: "", department: "" });
      fetchEmployees();
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error(error.response?.data?.detail || "Failed to add employee");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (employeeId) => {
    if (!window.confirm("Are you sure you want to delete this employee? This will also delete all their attendance records.")) {
      return;
    }

    try {
      await axios.delete(`${API}/employees/${employeeId}`);
      toast.success("Employee deleted successfully");
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Failed to delete employee");
    }
  };

    useEffect(() => {
    fetchEmployees();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div data-testid="employees-page">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Employee Management</h1>
          <p className="text-gray-600 mt-1">Manage your organization's employees</p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          data-testid="add-employee-button"
          className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>

      <div className="section-card">
        {employees.length === 0 ? (
          <div className="empty-state" data-testid="no-employees">
            <Users className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p className="text-lg font-medium">No employees added yet</p>
            <p className="text-sm mt-1">Click the "Add Employee" button to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table" data-testid="employees-table">
              <thead className="table-header">
                <tr>
                  <th className="table-cell text-left">Employee ID</th>
                  <th className="table-cell text-left">Full Name</th>
                  <th className="table-cell text-left">Email</th>
                  <th className="table-cell text-left">Department</th>
                  <th className="table-cell text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee, index) => (
                  <tr key={employee.employee_id} className="table-row" data-testid={`employee-row-${index}`}>
                    <td className="table-cell font-medium">{employee.employee_id}</td>
                    <td className="table-cell">{employee.full_name}</td>
                    <td className="table-cell">{employee.email}</td>
                    <td className="table-cell">{employee.department}</td>
                    <td className="table-cell">
                      <button
                        onClick={() => handleDelete(employee.employee_id)}
                        data-testid={`delete-employee-${employee.employee_id}`}
                        className="btn-danger text-sm"
                      >
                        <Trash2 className="h-4 w-4 inline mr-1" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent data-testid="add-employee-dialog">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  data-testid="input-full-name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  data-testid="input-email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div>
                <Label htmlFor="department">Department *</Label>
                <Input
                  id="department"
                  data-testid="input-department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Enter department"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddDialog(false)}
                data-testid="cancel-add-employee"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                data-testid="submit-add-employee"
                disabled={submitting}
                className="bg-[#1e3a8a] hover:bg-[#1e40af]"
              >
                {submitting ? "Adding..." : "Add Employee"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Employees;