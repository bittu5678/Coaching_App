import { useState } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Calendar,
  Building2,
  User,
  Users,
  CheckCircle2,
  Eye,
  Edit2,
  Trash2,
  Power,
  X,
  Clock,
  IndianRupee,
  FileText,
} from "lucide-react";
import { useManagement } from "@/lib/ManagementContext";
import { type Course } from "@/lib/managementData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CoursesView({
  allowedInstituteId,
  teacherEmployeeId,
}: {
  allowedInstituteId?: string | null;
  teacherEmployeeId?: string | null;
}) {
  const {
    courses,
    institutes,
    employees,
    students,
    addCourse,
    updateCourse,
    deleteCourse,
    toggleCourseStatus,
  } = useManagement();

  const [search, setSearch] = useState("");
  const [instituteFilter, setInstituteFilter] = useState<string>(allowedInstituteId || "All");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All");

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    duration: "12 Months",
    fee: "₹45,000",
    startDate: "2024-05-01",
    endDate: "2025-04-30",
    instituteId: allowedInstituteId || institutes[0]?.id || "",
    teacherId: "",
    status: "Active" as "Active" | "Inactive",
  });

  // Filter available teachers according to selected institute in form
  const availableTeachers = employees.filter(
    (e) =>
      (e.role === "Teacher" || e.role === "Institute Admin") &&
      e.instituteId === formData.instituteId,
  );

  const filteredCourses = courses.filter((crs) => {
    if (allowedInstituteId && crs.instituteId !== allowedInstituteId) {
      return false;
    }
    if (teacherEmployeeId && crs.teacherId !== teacherEmployeeId) {
      return false;
    }

    const matchesSearch =
      crs.name.toLowerCase().includes(search.toLowerCase()) ||
      crs.code.toLowerCase().includes(search.toLowerCase()) ||
      crs.description.toLowerCase().includes(search.toLowerCase());

    const matchesInstitute = instituteFilter === "All" || crs.instituteId === instituteFilter;
    const matchesStatus = statusFilter === "All" || crs.status === statusFilter;

    return matchesSearch && matchesInstitute && matchesStatus;
  });

  const handleOpenAdd = () => {
    const instId = allowedInstituteId || institutes[0]?.id || "";
    const firstTeacher = employees.find(
      (e) => (e.role === "Teacher" || e.role === "Institute Admin") && e.instituteId === instId,
    );

    setFormData({
      name: "",
      code: `CRS-${Math.floor(100 + Math.random() * 900)}`,
      description: "",
      duration: "12 Months",
      fee: "₹40,000",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "2025-05-31",
      instituteId: instId,
      teacherId: firstTeacher?.id || "",
      status: "Active",
    });
    setAddModalOpen(true);
  };

  const handleOpenEdit = (crs: Course) => {
    setSelectedCourse(crs);
    setFormData({
      name: crs.name,
      code: crs.code,
      description: crs.description,
      duration: crs.duration,
      fee: crs.fee,
      startDate: crs.startDate,
      endDate: crs.endDate,
      instituteId: crs.instituteId,
      teacherId: crs.teacherId || "",
      status: crs.status,
    });
    setEditModalOpen(true);
  };

  const handleOpenView = (crs: Course) => {
    setSelectedCourse(crs);
    setViewModalOpen(true);
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim() || !formData.instituteId) return;
    addCourse(formData);
    setAddModalOpen(false);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !formData.name.trim() || !formData.instituteId) return;
    updateCourse(selectedCourse.id, formData);
    setEditModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete course ${name}?`)) {
      deleteCourse(id);
    }
  };

  return (
    <div className="animate-rise space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Course Curriculum & Programs
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Organize academic batches, assign lead instructors, and track course enrollments.
          </p>
        </div>
        <Button
          type="button"
          onClick={handleOpenAdd}
          className="btn-gradient inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-xs font-semibold shadow-brand"
        >
          <Plus className="size-4" /> Add Course
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <div className="glass-card p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Active Courses</span>
            <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
              <BookOpen className="size-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-foreground">
            {
              courses.filter(
                (c) =>
                  c.status === "Active" &&
                  (!allowedInstituteId || c.instituteId === allowedInstituteId),
              ).length
            }
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">Running curricula</p>
        </div>

        <div className="glass-card p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Enrollments</span>
            <div className="grid size-9 place-items-center rounded-xl bg-blue-500/10 text-blue-500">
              <Users className="size-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-foreground">
            {
              students.filter((s) => !allowedInstituteId || s.instituteId === allowedInstituteId)
                .length
            }
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">Students across all courses</p>
        </div>

        <div className="glass-card p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Assigned Faculty</span>
            <div className="grid size-9 place-items-center rounded-xl bg-amber-500/10 text-amber-500">
              <User className="size-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-foreground">
            {new Set(courses.map((c) => c.teacherId).filter(Boolean)).size}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">Lead educators</p>
        </div>

        <div className="glass-card p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Partner Institutes</span>
            <div className="grid size-9 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <Building2 className="size-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-foreground">{institutes.length}</p>
          <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Delivering courses
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="glass-card p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
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
              placeholder="Search course title, code..."
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
                <th className="pb-3 font-semibold pl-4 sm:pl-0">Course Name</th>
                <th className="pb-3 font-semibold">Course Code</th>
                <th className="pb-3 font-semibold">Institute</th>
                <th className="pb-3 font-semibold">Instructor</th>
                <th className="pb-3 font-semibold">Duration & Fee</th>
                <th className="pb-3 font-semibold">Enrolled</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right pr-4 sm:pr-0">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-muted-foreground text-xs">
                    No courses found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredCourses.map((crs) => {
                  const inst = institutes.find((i) => i.id === crs.instituteId);
                  const teacher = employees.find((e) => e.id === crs.teacherId);
                  const enrolledCount = students.filter((s) => s.courseId === crs.id).length;

                  return (
                    <tr key={crs.id} className="table-hover-row group">
                      <td className="py-3.5 pr-3 font-medium text-foreground pl-4 sm:pl-0">
                        <div className="flex items-center gap-2.5">
                          <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary font-bold text-xs shrink-0">
                            <BookOpen className="size-4" />
                          </div>
                          <div>
                            <span className="font-semibold block truncate max-w-[220px]">
                              {crs.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground truncate block max-w-[200px]">
                              {crs.description}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 pr-3 font-mono text-[11px] text-foreground">
                        <span className="rounded-md bg-muted px-2 py-0.5">{crs.code}</span>
                      </td>
                      <td className="py-3.5 pr-3 text-foreground">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="size-3 text-muted-foreground shrink-0" />
                          <span className="truncate max-w-[150px]">{inst?.name || "Unknown"}</span>
                        </div>
                      </td>
                      <td className="py-3.5 pr-3 text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <User className="size-3 text-primary shrink-0" />
                          <span className="text-foreground font-medium">
                            {teacher?.fullName || "Unassigned"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 pr-3">
                        <span className="block text-foreground font-semibold">{crs.fee}</span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Clock className="size-2.5" /> {crs.duration}
                        </span>
                      </td>
                      <td className="py-3.5 pr-3">
                        <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                          {enrolledCount} Students
                        </span>
                      </td>
                      <td className="py-3.5 pr-3">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold",
                            crs.status === "Active"
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          <span
                            className={cn(
                              "size-1.5 rounded-full",
                              crs.status === "Active" ? "bg-emerald-500" : "bg-muted-foreground",
                            )}
                          />
                          {crs.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right pr-4 sm:pr-0">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
                            title="View Course & Enrolled Students"
                            onClick={() => handleOpenView(crs)}
                          >
                            <Eye className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
                            title="Edit Course"
                            onClick={() => handleOpenEdit(crs)}
                          >
                            <Edit2 className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
                            title={crs.status === "Active" ? "Deactivate" : "Activate"}
                            onClick={() => toggleCourseStatus(crs.id)}
                          >
                            <Power
                              className={cn(
                                "size-3.5",
                                crs.status === "Active"
                                  ? "text-emerald-500"
                                  : "text-muted-foreground",
                              )}
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            title="Delete Course"
                            onClick={() => handleDelete(crs.id, crs.name)}
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

      {/* Add Course Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-overlay/70 p-4 backdrop-blur-sm animate-rise overflow-y-auto">
          <div className="glass-card w-full max-w-xl p-6 sm:p-7 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                  <BookOpen className="size-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Add New Course</h3>
                  <p className="text-xs text-muted-foreground">
                    Create course offering for institute
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
                    Course Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    required
                    placeholder="e.g. Class 12 Advanced Physics"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Course Code <span className="text-destructive">*</span>
                  </label>
                  <Input
                    required
                    placeholder="e.g. PHY-12-ADV"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value.toUpperCase() })
                    }
                    className="h-9 text-xs uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Course Description
                </label>
                <Input
                  placeholder="Overview of syllabus, modules, and target exam"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Institute <span className="text-destructive">*</span>
                  </label>
                  <select
                    required
                    disabled={Boolean(allowedInstituteId)}
                    value={formData.instituteId}
                    onChange={(e) => {
                      const newInstId = e.target.value;
                      const teacher = employees.find(
                        (emp) =>
                          (emp.role === "Teacher" || emp.role === "Institute Admin") &&
                          emp.instituteId === newInstId,
                      );
                      setFormData({
                        ...formData,
                        instituteId: newInstId,
                        teacherId: teacher?.id || "",
                      });
                    }}
                    className="h-9 w-full rounded-xl border border-input bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-75"
                  >
                    {institutes.map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        {inst.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Lead Instructor / Teacher
                  </label>
                  <select
                    value={formData.teacherId}
                    onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                    className="h-9 w-full rounded-xl border border-input bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Unassigned</option>
                    {availableTeachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.fullName} ({t.specialization || t.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Duration
                  </label>
                  <Input
                    placeholder="e.g. 12 Months / 40 Weeks"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Course Fee
                  </label>
                  <Input
                    placeholder="e.g. ₹45,000"
                    value={formData.fee}
                    onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    End Date
                  </label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
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
                  Save Course
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {editModalOpen && selectedCourse && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-overlay/70 p-4 backdrop-blur-sm animate-rise overflow-y-auto">
          <div className="glass-card w-full max-w-xl p-6 sm:p-7 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Edit2 className="size-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Edit Course</h3>
                  <p className="text-xs text-muted-foreground">{selectedCourse.name}</p>
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
                    Course Name
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
                    Course Code
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

              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Course Description
                </label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Lead Instructor
                  </label>
                  <select
                    value={formData.teacherId}
                    onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                    className="h-9 w-full rounded-xl border border-input bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Unassigned</option>
                    {availableTeachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.fullName} ({t.specialization || t.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Duration
                  </label>
                  <Input
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Course Fee
                  </label>
                  <Input
                    value={formData.fee}
                    onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    End Date
                  </label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
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

      {/* View Course & Enrolled Students Modal */}
      {viewModalOpen && selectedCourse && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-overlay/70 p-4 backdrop-blur-sm animate-rise overflow-y-auto">
          <div className="glass-card w-full max-w-2xl p-6 sm:p-7 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <BookOpen className="size-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-foreground">{selectedCourse.name}</h3>
                    <span className="font-mono text-xs rounded-md bg-muted px-2 py-0.5 text-muted-foreground">
                      {selectedCourse.code}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {institutes.find((i) => i.id === selectedCourse.instituteId)?.name}
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

            <div className="mt-5 space-y-4">
              <div className="bg-muted/30 p-4 rounded-xl space-y-2.5">
                <p className="text-xs text-foreground leading-relaxed">
                  {selectedCourse.description}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-border/60">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Duration</span>
                    <span className="text-xs font-semibold text-foreground">
                      {selectedCourse.duration}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Tuition Fee</span>
                    <span className="text-xs font-semibold text-foreground">
                      {selectedCourse.fee}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Schedule</span>
                    <span className="text-xs font-semibold text-foreground">
                      {selectedCourse.startDate} to {selectedCourse.endDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Instructor</span>
                    <span className="text-xs font-semibold text-primary">
                      {employees.find((e) => e.id === selectedCourse.teacherId)?.fullName ||
                        "Unassigned"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Enrolled Students in this course */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center justify-between">
                  <span>Enrolled Students</span>
                  <span className="text-primary font-semibold">
                    {students.filter((s) => s.courseId === selectedCourse.id).length} registered
                  </span>
                </h4>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {students.filter((s) => s.courseId === selectedCourse.id).length === 0 ? (
                    <p className="text-xs text-muted-foreground italic py-3 text-center">
                      No students currently enrolled in this course.
                    </p>
                  ) : (
                    students
                      .filter((s) => s.courseId === selectedCourse.id)
                      .map((stu) => (
                        <div
                          key={stu.id}
                          className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-card text-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="grid size-8 place-items-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                              {stu.fullName.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <span className="font-semibold block">{stu.fullName}</span>
                              <span className="text-[10px] text-muted-foreground">{stu.email}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-mono text-[10px] text-muted-foreground block">
                              {stu.studentId}
                            </span>
                            <span className="text-[10px] text-emerald-500 font-semibold">
                              {stu.attendanceRate}% Attendance
                            </span>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
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
                  handleOpenEdit(selectedCourse);
                }}
                className="btn-gradient rounded-xl h-10 text-xs px-5 font-semibold"
              >
                Edit Course
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
