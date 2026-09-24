import { useState } from "react";
import {
  Briefcase,
  Plus,
  Search,
  Mail,
  Phone,
  Building2,
  CheckCircle2,
  Calendar,
  Eye,
  Edit2,
  Trash2,
  Power,
  X,
  GraduationCap,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { useManagement } from "@/lib/ManagementContext";
import { type Employee, type EmployeeRole } from "@/lib/managementData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ALL_ROLES: EmployeeRole[] = ["Admin", "Institute Admin", "Teacher", "Employee", "Staff"];

export function EmployeesView({ allowedInstituteId }: { allowedInstituteId?: string | null }) {
  const {
    employees,
    institutes,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    toggleEmployeeStatus,
    courses,
  } = useManagement();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [instituteFilter, setInstituteFilter] = useState<string>(allowedInstituteId || "All");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All");

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    employeeId: "",
    role: "Teacher" as EmployeeRole,
    instituteId: allowedInstituteId || institutes[0]?.id || "",
    status: "Active" as "Active" | "Inactive",
    specialization: "",
    joinDate: new Date().toISOString().split("T")[0],
  });

  const filteredEmployees = employees.filter((emp) => {
    // If institute-scoped user, restrict to allowedInstituteId
    if (allowedInstituteId && emp.instituteId !== allowedInstituteId) {
      return false;
    }

    const matchesSearch =
      emp.fullName.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      (emp.specialization && emp.specialization.toLowerCase().includes(search.toLowerCase()));

    const matchesRole = roleFilter === "All" || emp.role === roleFilter;
    const matchesInstitute = instituteFilter === "All" || emp.instituteId === instituteFilter;
    const matchesStatus = statusFilter === "All" || emp.status === statusFilter;

    return matchesSearch && matchesRole && matchesInstitute && matchesStatus;
  });

  const handleOpenAdd = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      role: "Teacher",
      instituteId: allowedInstituteId || institutes[0]?.id || "",
      status: "Active",
      specialization: "",
      joinDate: new Date().toISOString().split("T")[0],
    });
    setAddModalOpen(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setSelectedEmployee(emp);
    setFormData({
      fullName: emp.fullName,
      email: emp.email,
      phone: emp.phone,
      employeeId: emp.employeeId,
      role: emp.role,
      instituteId: emp.instituteId,
      status: emp.status,
      specialization: emp.specialization || "",
      joinDate: emp.joinDate,
    });
    setEditModalOpen(true);
  };

  const handleOpenView = (emp: Employee) => {
    setSelectedEmployee(emp);
    setViewModalOpen(true);
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.instituteId) return;
    addEmployee(formData);
    setAddModalOpen(false);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee || !formData.fullName.trim() || !formData.instituteId) return;
    updateEmployee(selectedEmployee.id, formData);
    setEditModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove employee ${name}?`)) {
      deleteEmployee(id);
    }
  };

  return (
    <div className="animate-rise space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Employee & Faculty Management
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Administer teaching faculty, branch administrators, and administrative staff across
            institutes.
          </p>
        </div>
        <Button
          type="button"
          onClick={handleOpenAdd}
          className="btn-gradient inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-xs font-semibold shadow-brand"
        >
          <Plus className="size-4" /> Add Employee
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <div className="glass-card p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Staff</span>
            <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
              <Briefcase className="size-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-foreground">
            {allowedInstituteId
              ? employees.filter((e) => e.instituteId === allowedInstituteId).length
              : employees.length}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">Employed personnel</p>
        </div>

        <div className="glass-card p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Faculty / Teachers</span>
            <div className="grid size-9 place-items-center rounded-xl bg-blue-500/10 text-blue-500">
              <GraduationCap className="size-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-foreground">
            {
              employees.filter(
                (e) =>
                  e.role === "Teacher" &&
                  (!allowedInstituteId || e.instituteId === allowedInstituteId),
              ).length
            }
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">Active instructors</p>
        </div>

        <div className="glass-card p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Institute Admins</span>
            <div className="grid size-9 place-items-center rounded-xl bg-amber-500/10 text-amber-500">
              <ShieldCheck className="size-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-foreground">
            {
              employees.filter(
                (e) =>
                  e.role === "Institute Admin" &&
                  (!allowedInstituteId || e.instituteId === allowedInstituteId),
              ).length
            }
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">Branch leaders</p>
        </div>

        <div className="glass-card p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Active Status</span>
            <div className="grid size-9 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-foreground">
            {
              employees.filter(
                (e) =>
                  e.status === "Active" &&
                  (!allowedInstituteId || e.instituteId === allowedInstituteId),
              ).length
            }
          </p>
          <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Verified active
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="glass-card p-4 sm:p-6">
        {/* Filters and Search Bar */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between pb-4">
          <div className="flex flex-wrap items-center gap-2">
            {/* Role Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {["All", ...ALL_ROLES].map((role) => (
                <button
                  key={role}
                  type="button"
                  className={cn(
                    "h-8 rounded-xl px-2.5 text-xs font-medium transition-all duration-200 shrink-0",
                    roleFilter === role
                      ? "btn-gradient text-white shadow-sm font-semibold"
                      : "bg-muted/60 text-muted-foreground hover:text-foreground",
                  )}
                  onClick={() => setRoleFilter(role)}
                >
                  {role}
                </button>
              ))}
            </div>

            {/* Institute dropdown filter (only if not scoped) */}
            {!allowedInstituteId && (
              <select
                value={instituteFilter}
                onChange={(e) => setInstituteFilter(e.target.value)}
                className="h-8 rounded-xl border border-input bg-card px-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="All">All Institutes</option>
                {institutes.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="input-glow h-9 w-full rounded-xl bg-card pl-8 text-xs sm:w-64"
              placeholder="Search name, ID, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full text-left text-xs min-w-[700px] px-4">
            <thead>
              <tr className="border-b border-border/80 text-muted-foreground">
                <th className="pb-3 font-semibold pl-4 sm:pl-0">Employee</th>
                <th className="pb-3 font-semibold">Employee ID</th>
                <th className="pb-3 font-semibold">Role</th>
                <th className="pb-3 font-semibold">Assigned Institute</th>
                <th className="pb-3 font-semibold">Specialization</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right pr-4 sm:pr-0">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground text-xs">
                    No employees found matching current criteria.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => {
                  const inst = institutes.find((i) => i.id === emp.instituteId);

                  return (
                    <tr key={emp.id} className="table-hover-row group">
                      <td className="py-3.5 pr-3 font-medium text-foreground pl-4 sm:pl-0">
                        <div className="flex items-center gap-2.5">
                          <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary font-bold text-xs shrink-0">
                            {emp.fullName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-semibold block">{emp.fullName}</span>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Mail className="size-2.5" /> {emp.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 pr-3 font-mono text-[11px] text-foreground">
                        <span className="rounded-md bg-muted px-2 py-0.5">{emp.employeeId}</span>
                      </td>
                      <td className="py-3.5 pr-3">
                        <span
                          className={cn(
                            "rounded-md px-2 py-0.5 text-[10px] font-semibold",
                            emp.role === "Teacher" &&
                              "bg-blue-500/10 text-blue-600 dark:text-blue-400",
                            emp.role === "Institute Admin" &&
                              "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                            emp.role === "Admin" &&
                              "bg-purple-500/10 text-purple-600 dark:text-purple-400",
                            emp.role === "Staff" &&
                              "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                            emp.role === "Employee" && "bg-muted text-muted-foreground",
                          )}
                        >
                          {emp.role}
                        </span>
                      </td>
                      <td className="py-3.5 pr-3 text-foreground font-medium">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="size-3 text-primary shrink-0" />
                          <span className="truncate max-w-[180px]">
                            {inst?.name || "Unassigned"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 pr-3 text-muted-foreground">
                        <span className="truncate block max-w-[160px] text-[11px]">
                          {emp.specialization || "General Academic"}
                        </span>
                      </td>
                      <td className="py-3.5 pr-3">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold",
                            emp.status === "Active"
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          <span
                            className={cn(
                              "size-1.5 rounded-full",
                              emp.status === "Active" ? "bg-emerald-500" : "bg-muted-foreground",
                            )}
                          />
                          {emp.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right pr-4 sm:pr-0">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
                            title="View Employee Profile"
                            onClick={() => handleOpenView(emp)}
                          >
                            <Eye className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
                            title="Edit Employee"
                            onClick={() => handleOpenEdit(emp)}
                          >
                            <Edit2 className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
                            title={emp.status === "Active" ? "Deactivate" : "Activate"}
                            onClick={() => toggleEmployeeStatus(emp.id)}
                          >
                            <Power
                              className={cn(
                                "size-3.5",
                                emp.status === "Active"
                                  ? "text-emerald-500"
                                  : "text-muted-foreground",
                              )}
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            title="Delete Employee"
                            onClick={() => handleDelete(emp.id, emp.fullName)}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-overlay/70 p-4 backdrop-blur-sm animate-rise overflow-y-auto">
          <div className="glass-card w-full max-w-xl p-6 sm:p-7 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                  <UserCheck className="size-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Add Employee</h3>
                  <p className="text-xs text-muted-foreground">Register faculty or staff member</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-lg"
                onClick={() => setAddModalOpen(false)}
              >
                <X className="size-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmitAdd} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Full Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    required
                    placeholder="e.g. Dr. Ananya Sen"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Employee ID <span className="text-destructive">*</span>
                  </label>
                  <Input
                    required
                    placeholder="EMP-2024-01"
                    value={formData.employeeId}
                    onChange={(e) =>
                      setFormData({ ...formData, employeeId: e.target.value.toUpperCase() })
                    }
                    className="h-9 text-xs uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Role <span className="text-destructive">*</span>
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value as EmployeeRole })
                    }
                    className="h-9 w-full rounded-xl border border-input bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {ALL_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Assigned Institute <span className="text-destructive">*</span>
                  </label>
                  <select
                    required
                    disabled={Boolean(allowedInstituteId)}
                    value={formData.instituteId}
                    onChange={(e) => setFormData({ ...formData, instituteId: e.target.value })}
                    className="h-9 w-full rounded-xl border border-input bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-75"
                  >
                    {institutes.map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        {inst.name} ({inst.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Email Address <span className="text-destructive">*</span>
                  </label>
                  <Input
                    required
                    type="email"
                    placeholder="ananya.sen@apexacademy.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Phone Number
                  </label>
                  <Input
                    placeholder="+91 98765 11223"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Subject / Specialization
                  </label>
                  <Input
                    placeholder="e.g. Physics, Advanced Calculus, Admin"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as "Active" | "Inactive" })
                    }
                    className="h-9 w-full rounded-xl border border-input bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl h-10 text-xs px-4"
                  onClick={() => setAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="btn-gradient rounded-xl h-10 text-xs px-5 font-semibold"
                >
                  Save Employee
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {editModalOpen && selectedEmployee && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-overlay/70 p-4 backdrop-blur-sm animate-rise overflow-y-auto">
          <div className="glass-card w-full max-w-xl p-6 sm:p-7 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Edit2 className="size-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Edit Employee</h3>
                  <p className="text-xs text-muted-foreground">{selectedEmployee.fullName}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-lg"
                onClick={() => setEditModalOpen(false)}
              >
                <X className="size-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmitEdit} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Full Name
                  </label>
                  <Input
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Employee ID
                  </label>
                  <Input
                    required
                    value={formData.employeeId}
                    onChange={(e) =>
                      setFormData({ ...formData, employeeId: e.target.value.toUpperCase() })
                    }
                    className="h-9 text-xs uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value as EmployeeRole })
                    }
                    className="h-9 w-full rounded-xl border border-input bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {ALL_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Institute
                  </label>
                  <select
                    required
                    disabled={Boolean(allowedInstituteId)}
                    value={formData.instituteId}
                    onChange={(e) => setFormData({ ...formData, instituteId: e.target.value })}
                    className="h-9 w-full rounded-xl border border-input bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-75"
                  >
                    {institutes.map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        {inst.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Email</label>
                  <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Phone</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Specialization
                  </label>
                  <Input
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as "Active" | "Inactive" })
                    }
                    className="h-9 w-full rounded-xl border border-input bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl h-10 text-xs px-4"
                  onClick={() => setEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="btn-gradient rounded-xl h-10 text-xs px-5 font-semibold"
                >
                  Update Employee
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Employee Modal */}
      {viewModalOpen && selectedEmployee && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-overlay/70 p-4 backdrop-blur-sm animate-rise overflow-y-auto">
          <div className="glass-card w-full max-w-lg p-6 sm:p-7 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary font-bold text-base">
                  {selectedEmployee.fullName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{selectedEmployee.fullName}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {selectedEmployee.employeeId}
                    </span>
                    <span className="rounded-md bg-primary/10 px-2 py-0.2 text-[10px] font-semibold text-primary">
                      {selectedEmployee.role}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-lg"
                onClick={() => setViewModalOpen(false)}
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="mt-5 space-y-4">
              <div className="bg-muted/30 p-4 rounded-xl space-y-2.5">
                <div>
                  <span className="text-[11px] text-muted-foreground block">
                    Assigned Institute
                  </span>
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5 mt-0.5">
                    <Building2 className="size-3 text-primary" />
                    {institutes.find((i) => i.id === selectedEmployee.instituteId)?.name ||
                      "Unassigned"}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground block">
                    Specialization / Domain
                  </span>
                  <span className="text-xs font-semibold text-foreground block mt-0.5">
                    {selectedEmployee.specialization || "General Academic"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/60">
                  <div>
                    <span className="text-[11px] text-muted-foreground block">Email</span>
                    <span className="text-xs text-foreground flex items-center gap-1 mt-0.5">
                      <Mail className="size-3 text-muted-foreground" /> {selectedEmployee.email}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground block">Phone</span>
                    <span className="text-xs text-foreground flex items-center gap-1 mt-0.5">
                      <Phone className="size-3 text-muted-foreground" /> {selectedEmployee.phone}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-[11px] text-muted-foreground block">Joined Date</span>
                    <span className="text-xs text-foreground flex items-center gap-1 mt-0.5">
                      <Calendar className="size-3 text-muted-foreground" />{" "}
                      {selectedEmployee.joinDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground block">Account Status</span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 text-xs font-semibold mt-0.5",
                        selectedEmployee.status === "Active"
                          ? "text-emerald-500"
                          : "text-muted-foreground",
                      )}
                    >
                      <CheckCircle2 className="size-3" /> {selectedEmployee.status}
                    </span>
                  </div>
                </div>
              </div>

              {selectedEmployee.role === "Teacher" && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Courses Taught
                  </h4>
                  <div className="space-y-1.5">
                    {courses
                      .filter((c) => c.teacherId === selectedEmployee.id)
                      .map((c) => (
                        <div
                          key={c.id}
                          className="flex items-center justify-between p-2.5 rounded-xl border border-border/70 bg-card text-xs"
                        >
                          <span className="font-semibold">{c.name}</span>
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {c.code}
                          </span>
                        </div>
                      ))}
                    {courses.filter((c) => c.teacherId === selectedEmployee.id).length === 0 && (
                      <p className="text-xs text-muted-foreground italic">
                        No courses currently assigned.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl h-10 text-xs px-4"
                onClick={() => setViewModalOpen(false)}
              >
                Close
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setViewModalOpen(false);
                  handleOpenEdit(selectedEmployee);
                }}
                className="btn-gradient rounded-xl h-10 text-xs px-5 font-semibold"
              >
                Edit Employee
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
