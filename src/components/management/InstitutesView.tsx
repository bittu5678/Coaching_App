import { useState } from "react";
import {
  Building2,
  Plus,
  Search,
  MoreHorizontal,
  MapPin,
  Phone,
  Mail,
  User,
  BookOpen,
  Users,
  CheckCircle2,
  XCircle,
  Calendar,
  Eye,
  Edit2,
  Trash2,
  Power,
  X,
  CreditCard,
  ShieldCheck,
  QrCode,
} from "lucide-react";
import { useManagement } from "@/lib/ManagementContext";
import { type Institute } from "@/lib/managementData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { InstituteProfileView } from "./InstituteProfileView";

export function InstitutesView() {
  const {
    institutes,
    addInstitute,
    updateInstitute,
    deleteInstitute,
    toggleInstituteStatus,
    courses,
    students,
    employees,
  } = useManagement();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedInstitute, setSelectedInstitute] = useState<Institute | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    directorName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    status: "Active" as "Active" | "Inactive",
  });

  const filteredInstitutes = institutes.filter((inst) => {
    const matchesSearch =
      inst.name.toLowerCase().includes(search.toLowerCase()) ||
      inst.code.toLowerCase().includes(search.toLowerCase()) ||
      inst.directorName.toLowerCase().includes(search.toLowerCase()) ||
      inst.city.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "All" || inst.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      code: "",
      directorName: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      state: "",
      status: "Active",
    });
    setAddModalOpen(true);
  };

  const handleOpenEdit = (inst: Institute) => {
    setSelectedInstitute(inst);
    setFormData({
      name: inst.name,
      code: inst.code,
      directorName: inst.directorName,
      phone: inst.phone,
      email: inst.email,
      address: inst.address,
      city: inst.city,
      state: inst.state,
      status: inst.status,
    });
    setEditModalOpen(true);
  };

  const handleOpenView = (inst: Institute) => {
    setSelectedInstitute(inst);
    setViewModalOpen(true);
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) return;
    addInstitute(formData);
    setAddModalOpen(false);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInstitute || !formData.name.trim() || !formData.code.trim()) return;
    updateInstitute(selectedInstitute.id, formData);
    setEditModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${name}? This will remove associated institute records.`,
      )
    ) {
      deleteInstitute(id);
    }
  };

  return (
    <div className="animate-rise space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Institute Management
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure partner coaching institutes, assign branch directors, and supervise network
            branches.
          </p>
        </div>
        <Button
          type="button"
          onClick={handleOpenAdd}
          className="btn-gradient inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-xs font-semibold shadow-brand"
        >
          <Plus className="size-4" /> Add Institute
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <div className="glass-card p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Institutes</span>
            <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
              <Building2 className="size-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-foreground">{institutes.length}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Verified coaching branches</p>
        </div>

        <div className="glass-card p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Active Institutes</span>
            <div className="grid size-9 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-foreground">
            {institutes.filter((i) => i.status === "Active").length}
          </p>
          <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Currently operational
          </p>
        </div>

        <div className="glass-card p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Courses Offered</span>
            <div className="grid size-9 place-items-center rounded-xl bg-blue-500/10 text-blue-500">
              <BookOpen className="size-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-foreground">{courses.length}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Across all partner academies</p>
        </div>

        <div className="glass-card p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Enrolled Students</span>
            <div className="grid size-9 place-items-center rounded-xl bg-amber-500/10 text-amber-500">
              <Users className="size-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-foreground">{students.length}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Total learners across institutes</p>
        </div>
      </div>

      {/* Main Table & Filter Container */}
      <div className="glass-card p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(["All", "Active", "Inactive"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                className={cn(
                  "h-8 rounded-xl px-3 text-xs font-medium transition-all duration-200 shrink-0",
                  statusFilter === tab
                    ? "btn-gradient text-white shadow-sm font-semibold"
                    : "bg-muted/60 text-muted-foreground hover:text-foreground",
                )}
                onClick={() => setStatusFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="input-glow h-9 w-full rounded-xl bg-card pl-8 text-xs sm:w-64"
              placeholder="Search institute, code, director..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full text-left text-xs min-w-[650px] px-4">
            <thead>
              <tr className="border-b border-border/80 text-muted-foreground">
                <th className="pb-3 font-semibold pl-4 sm:pl-0">Institute Name</th>
                <th className="pb-3 font-semibold">Code / ID</th>
                <th className="pb-3 font-semibold">Director</th>
                <th className="pb-3 font-semibold">Location</th>
                <th className="pb-3 font-semibold">Courses / Students</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right pr-4 sm:pr-0">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredInstitutes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground text-xs">
                    No institutes found matching your query.
                  </td>
                </tr>
              ) : (
                filteredInstitutes.map((inst) => {
                  const instCourses = courses.filter((c) => c.instituteId === inst.id);
                  const instStudents = students.filter((s) => s.instituteId === inst.id);

                  return (
                    <tr key={inst.id} className="table-hover-row group">
                      <td className="py-3.5 pr-3 font-medium text-foreground pl-4 sm:pl-0">
                        <div className="flex items-center gap-2.5">
                          <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary font-bold text-xs shrink-0">
                            <Building2 className="size-4" />
                          </div>
                          <div>
                            <span className="font-semibold block">{inst.name}</span>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Mail className="size-2.5" /> {inst.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 pr-3 font-mono text-[11px] text-foreground">
                        <span className="rounded-md bg-muted px-2 py-0.5">{inst.code}</span>
                      </td>
                      <td className="py-3.5 pr-3 text-foreground">
                        <div className="flex items-center gap-1.5">
                          <User className="size-3 text-muted-foreground" />
                          <span>{inst.directorName}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground block pl-4.5">
                          {inst.phone}
                        </span>
                      </td>
                      <td className="py-3.5 pr-3 text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="size-3 text-muted-foreground shrink-0" />
                          <span>
                            {inst.city}, {inst.state}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 pr-3">
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                            {instCourses.length} Courses
                          </span>
                          <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                            {instStudents.length} Students
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 pr-3">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold",
                            inst.status === "Active"
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          <span
                            className={cn(
                              "size-1.5 rounded-full",
                              inst.status === "Active" ? "bg-emerald-500" : "bg-muted-foreground",
                            )}
                          />
                          {inst.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right pr-4 sm:pr-0">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-lg text-primary hover:bg-primary/10"
                            title="Institute Profile, Bank & UPI Settings"
                            onClick={() => {
                              setSelectedInstitute(inst);
                              setProfileModalOpen(true);
                            }}
                          >
                            <CreditCard className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
                            title="View Institute Details"
                            onClick={() => handleOpenView(inst)}
                          >
                            <Eye className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
                            title="Edit Institute"
                            onClick={() => handleOpenEdit(inst)}
                          >
                            <Edit2 className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
                            title={inst.status === "Active" ? "Deactivate" : "Activate"}
                            onClick={() => toggleInstituteStatus(inst.id)}
                          >
                            <Power
                              className={cn(
                                "size-3.5",
                                inst.status === "Active"
                                  ? "text-emerald-500"
                                  : "text-muted-foreground",
                              )}
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            title="Delete Institute"
                            onClick={() => handleDelete(inst.id, inst.name)}
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

      {/* Add Institute Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-overlay/70 p-4 backdrop-blur-sm animate-rise overflow-y-auto">
          <div className="glass-card w-full max-w-xl p-6 sm:p-7 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Building2 className="size-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Add New Institute</h3>
                  <p className="text-xs text-muted-foreground">
                    Register an accredited partner coaching center
                  </p>
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
                    Institute Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    required
                    placeholder="e.g. Apex IIT-JEE Academy"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Institute Code / ID <span className="text-destructive">*</span>
                  </label>
                  <Input
                    required
                    placeholder="e.g. APEX-DEL"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value.toUpperCase() })
                    }
                    className="h-9 text-xs uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Director / Owner Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    required
                    placeholder="e.g. Dr. Ramesh Verma"
                    value={formData.directorName}
                    onChange={(e) => setFormData({ ...formData, directorName: e.target.value })}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Phone Number <span className="text-destructive">*</span>
                  </label>
                  <Input
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Email Address <span className="text-destructive">*</span>
                  </label>
                  <Input
                    required
                    type="email"
                    placeholder="contact@apexacademy.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Address</label>
                <Input
                  placeholder="Plot 42, Institutional Area, Sector 14"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">City</label>
                  <Input
                    placeholder="New Delhi"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">State</label>
                  <Input
                    placeholder="Delhi"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="h-9 text-xs"
                  />
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
                  Save Institute
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Institute Modal */}
      {editModalOpen && selectedInstitute && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-overlay/70 p-4 backdrop-blur-sm animate-rise overflow-y-auto">
          <div className="glass-card w-full max-w-xl p-6 sm:p-7 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Edit2 className="size-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Edit Institute</h3>
                  <p className="text-xs text-muted-foreground">{selectedInstitute.name}</p>
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
                    Institute Name
                  </label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Institute Code
                  </label>
                  <Input
                    required
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value.toUpperCase() })
                    }
                    className="h-9 text-xs uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Director Name
                  </label>
                  <Input
                    required
                    value={formData.directorName}
                    onChange={(e) => setFormData({ ...formData, directorName: e.target.value })}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Phone Number
                  </label>
                  <Input
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
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
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Address</label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">City</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">State</label>
                  <Input
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="h-9 text-xs"
                  />
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
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Institute Details Modal */}
      {viewModalOpen && selectedInstitute && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-overlay/70 p-4 backdrop-blur-sm animate-rise overflow-y-auto">
          <div className="glass-card w-full max-w-2xl p-6 sm:p-7 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <Building2 className="size-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-foreground">{selectedInstitute.name}</h3>
                    <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                      {selectedInstitute.code}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Founded {selectedInstitute.createdAt}
                  </p>
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

            <div className="mt-5 space-y-5">
              {/* Info grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-muted/30 p-4 rounded-xl">
                <div>
                  <span className="text-[11px] text-muted-foreground block">
                    Director / Branch Head
                  </span>
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5 mt-0.5">
                    <User className="size-3 text-primary" /> {selectedInstitute.directorName}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground block">Status</span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 mt-0.5 text-xs font-semibold",
                      selectedInstitute.status === "Active"
                        ? "text-emerald-500"
                        : "text-muted-foreground",
                    )}
                  >
                    <CheckCircle2 className="size-3" /> {selectedInstitute.status}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground block">Contact Phone</span>
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5 mt-0.5">
                    <Phone className="size-3 text-primary" /> {selectedInstitute.phone}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground block">Contact Email</span>
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5 mt-0.5">
                    <Mail className="size-3 text-primary" /> {selectedInstitute.email}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-[11px] text-muted-foreground block">Campus Address</span>
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5 mt-0.5">
                    <MapPin className="size-3 text-primary shrink-0" />
                    {selectedInstitute.address}, {selectedInstitute.city}, {selectedInstitute.state}
                  </span>
                </div>
              </div>

              {/* Related counts & summary */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Academic Statistics
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-border/70 p-3 text-center bg-card">
                    <span className="text-lg font-bold text-foreground">
                      {courses.filter((c) => c.instituteId === selectedInstitute.id).length}
                    </span>
                    <span className="text-[10px] text-muted-foreground block">Active Courses</span>
                  </div>
                  <div className="rounded-xl border border-border/70 p-3 text-center bg-card">
                    <span className="text-lg font-bold text-foreground">
                      {students.filter((s) => s.instituteId === selectedInstitute.id).length}
                    </span>
                    <span className="text-[10px] text-muted-foreground block">
                      Enrolled Students
                    </span>
                  </div>
                  <div className="rounded-xl border border-border/70 p-3 text-center bg-card">
                    <span className="text-lg font-bold text-foreground">
                      {employees.filter((e) => e.instituteId === selectedInstitute.id).length}
                    </span>
                    <span className="text-[10px] text-muted-foreground block">Faculty & Staff</span>
                  </div>
                </div>
              </div>

              {/* Payment Receiving & Legal Details */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Payout Settlement & Legal Status
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-muted/30 p-3.5 rounded-xl text-xs">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                      GST Registration
                    </span>
                    <span className="font-mono text-foreground font-semibold">
                      {selectedInstitute.gstNumber || "Not registered / Exempted"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                      Payout Verification
                    </span>
                    {selectedInstitute.bankDetails?.isVerified ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <ShieldCheck className="size-3.5" /> OTP Verified
                      </span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 font-semibold">
                        Pending OTP Verification
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                      Receiving Bank
                    </span>
                    <span className="text-foreground">
                      {selectedInstitute.bankDetails?.bankName || "No bank details added"} ·{" "}
                      {selectedInstitute.bankDetails?.accountNumber
                        ? `••••${selectedInstitute.bankDetails.accountNumber.slice(-4)}`
                        : ""}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                      Receiving UPI ID
                    </span>
                    <span className="font-mono text-foreground">
                      {selectedInstitute.upiDetails?.upiId || "None"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl h-10 text-xs px-4 gap-1.5"
                onClick={() => {
                  setViewModalOpen(false);
                  setProfileModalOpen(true);
                }}
              >
                <CreditCard className="size-3.5" /> Full Profile & Payout Settings
              </Button>

              <div className="flex items-center gap-2">
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
                    handleOpenEdit(selectedInstitute);
                  }}
                  className="btn-gradient rounded-xl h-10 text-xs px-5 font-semibold"
                >
                  Edit Institute
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive Institute Profile Modal */}
      {profileModalOpen && selectedInstitute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="glass-card w-full max-w-4xl rounded-2xl p-6 sm:p-8 shadow-2xl border border-border/80 animate-rise bg-card max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-5">
              <div className="flex items-center gap-2">
                <Building2 className="size-5 text-primary" />
                <h3 className="text-base font-bold text-foreground">
                  Institute Profile, GST & Payment Gateways
                </h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-lg"
                onClick={() => setProfileModalOpen(false)}
              >
                <X className="size-4" />
              </Button>
            </div>

            <InstituteProfileView selectedInstituteId={selectedInstitute.id} />
          </div>
        </div>
      )}
    </div>
  );
}
