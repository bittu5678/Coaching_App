import { useState, useMemo } from "react";
import {
  Users,
  Plus,
  Search,
  CheckCircle2,
  Trophy,
  AlertCircle,
  Building2,
  BookOpen,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Eye,
  Edit2,
  Trash2,
  Power,
  X,
  User,
} from "lucide-react";
import { useManagement } from "@/lib/ManagementContext";
import { type Student } from "@/lib/managementData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function StudentsManagementView({
  allowedInstituteId,
}: {
  allowedInstituteId?: string | null;
}) {
  const {
    students,
    institutes,
    courses,
    employees,
    addStudent,
    updateStudent,
    deleteStudent,
    toggleStudentStatus,
  } = useManagement();

  const [search, setSearch] = useState("");
  const [instituteFilter, setInstituteFilter] = useState<string>(allowedInstituteId || "All");
  const [courseFilter, setCourseFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All");

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Form State
  const initialInst = allowedInstituteId || institutes[0]?.id || "";
  const initialCourse = courses.find((c) => c.instituteId === initialInst)?.id || "";

  const [formData, setFormData] = useState({
    fullName: "",
    studentId: "",
    email: "",
    phone: "",
    dob: "2007-05-15",
    gender: "Male" as "Male" | "Female" | "Other",
    address: "",
    city: "",
    state: "",
    instituteId: initialInst,
    courseId: initialCourse,
    enrollmentDate: new Date().toISOString().split("T")[0],
    status: "Active" as "Active" | "Inactive",
    attendanceRate: 95,
    averageScore: 85,
  });

  // Courses available for currently selected institute in form
  const formAvailableCourses = useMemo(() => {
    return courses.filter((c) => c.instituteId === formData.instituteId);
  }, [courses, formData.instituteId]);

  // Courses available for list filtering based on instituteFilter
  const listAvailableCourses = useMemo(() => {
    if (instituteFilter === "All") return courses;
    return courses.filter((c) => c.instituteId === instituteFilter);
  }, [courses, instituteFilter]);

  const filteredStudents = students.filter((stu) => {
    if (allowedInstituteId && stu.instituteId !== allowedInstituteId) {
      return false;
    }

    const matchesSearch =
      stu.fullName.toLowerCase().includes(search.toLowerCase()) ||
      stu.studentId.toLowerCase().includes(search.toLowerCase()) ||
      stu.email.toLowerCase().includes(search.toLowerCase());

    const matchesInstitute = instituteFilter === "All" || stu.instituteId === instituteFilter;

    const matchesCourse = courseFilter === "All" || stu.courseId === courseFilter;

    const matchesStatus = statusFilter === "All" || stu.status === statusFilter;

    return matchesSearch && matchesInstitute && matchesCourse && matchesStatus;
  });

  const handleOpenAdd = () => {
    const instId = allowedInstituteId || institutes[0]?.id || "";
    const firstCourse = courses.find((c) => c.instituteId === instId)?.id || "";

    setFormData({
      fullName: "",
      studentId: `STU-2024-${Math.floor(100 + Math.random() * 900)}`,
      email: "",
      phone: "+91 ",
      dob: "2007-06-15",
      gender: "Male",
      address: "",
      city: "",
      state: "",
      instituteId: instId,
      courseId: firstCourse,
      enrollmentDate: new Date().toISOString().split("T")[0],
      status: "Active",
      attendanceRate: 95,
      averageScore: 85,
    });
    setAddModalOpen(true);
  };

  const handleOpenEdit = (stu: Student) => {
    setSelectedStudent(stu);
    setFormData({
      fullName: stu.fullName,
      studentId: stu.studentId,
      email: stu.email,
      phone: stu.phone,
      dob: stu.dob,
      gender: stu.gender,
      address: stu.address,
      city: stu.city,
      state: stu.state,
      instituteId: stu.instituteId,
      courseId: stu.courseId,
      enrollmentDate: stu.enrollmentDate,
      status: stu.status,
      attendanceRate: stu.attendanceRate,
      averageScore: stu.averageScore,
    });
    setEditModalOpen(true);
  };

  const handleOpenView = (stu: Student) => {
    setSelectedStudent(stu);
    setViewModalOpen(true);
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.instituteId ||
      !formData.courseId
    ) {
      return;
    }
    addStudent(formData);
    setAddModalOpen(false);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !selectedStudent ||
      !formData.fullName.trim() ||
      !formData.instituteId ||
      !formData.courseId
    ) {
      return;
    }
    updateStudent(selectedStudent.id, formData);
    setEditModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove student ${name}?`)) {
      deleteStudent(id);
    }
  };

  return (
    <div className="animate-rise space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Students Management
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Administer student enrollments across Institutes and assigned Courses.
          </p>
        </div>
        <Button
          type="button"
          onClick={handleOpenAdd}
          className="btn-gradient inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-xs font-semibold shadow-brand"
        >
          <Plus className="size-4" /> Add Student
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <div className="glass-card p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Enrolled</span>
            <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
              <Users className="size-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-foreground">
            {allowedInstituteId
              ? students.filter((s) => s.instituteId === allowedInstituteId).length
              : students.length}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">Active in coaching batches</p>
        </div>

        <div className="glass-card p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Active Students</span>
            <div className="grid size-9 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-foreground">
            {
              students.filter(
                (s) =>
                  s.status === "Active" &&
                  (!allowedInstituteId || s.instituteId === allowedInstituteId),
              ).length
            }
          </p>
          <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Regular attendance
          </p>
        </div>

        <div className="glass-card p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Avg Test Score</span>
            <div className="grid size-9 place-items-center rounded-xl bg-amber-500/10 text-amber-500">
              <Trophy className="size-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-foreground">
            {students.length > 0
              ? Math.round(
                  students
                    .filter((s) => !allowedInstituteId || s.instituteId === allowedInstituteId)
                    .reduce((acc, curr) => acc + curr.averageScore, 0) /
                    (students.filter(
                      (s) => !allowedInstituteId || s.instituteId === allowedInstituteId,
                    ).length || 1),
                )
              : 88}
            %
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">Overall performance</p>
        </div>

        <div className="glass-card p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Attention Needed</span>
            <div className="grid size-9 place-items-center rounded-xl bg-rose-500/10 text-rose-500">
              <AlertCircle className="size-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-foreground">
            {
              students.filter(
                (s) =>
                  (s.attendanceRate < 80 || s.status === "Inactive") &&
                  (!allowedInstituteId || s.instituteId === allowedInstituteId),
              ).length
            }
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">Low score / attendance</p>
        </div>
      </div>

      {/* Main Container */}
      <div className="glass-card p-4 sm:p-6">
        {/* Filters */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between pb-4">
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
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

            {/* Institute Filter */}
            {!allowedInstituteId && (
              <select
                value={instituteFilter}
                onChange={(e) => {
                  setInstituteFilter(e.target.value);
                  setCourseFilter("All");
                }}
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

            {/* Course Filter */}
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="h-8 rounded-xl border border-input bg-card px-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="All">All Courses</option>
              {listAvailableCourses.map((crs) => (
                <option key={crs.id} value={crs.id}>
                  {crs.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="input-glow h-9 w-full rounded-xl bg-card pl-8 text-xs sm:w-64"
              placeholder="Search student, roll, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full text-left text-xs min-w-[720px] px-4">
            <thead>
              <tr className="border-b border-border/80 text-muted-foreground">
                <th className="pb-3 font-semibold pl-4 sm:pl-0">Student</th>
                <th className="pb-3 font-semibold">Student ID</th>
                <th className="pb-3 font-semibold">Institute & Course</th>
                <th className="pb-3 font-semibold">Attendance</th>
                <th className="pb-3 font-semibold">Avg Score</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right pr-4 sm:pr-0">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground text-xs">
                    No students found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((stu) => {
                  const inst = institutes.find((i) => i.id === stu.instituteId);
                  const crs = courses.find((c) => c.id === stu.courseId);

                  return (
                    <tr key={stu.id} className="table-hover-row group">
                      <td className="py-3.5 pr-3 font-medium text-foreground pl-4 sm:pl-0">
                        <div className="flex items-center gap-2.5">
                          <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary font-bold text-xs shrink-0">
                            {stu.fullName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-semibold block">{stu.fullName}</span>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Mail className="size-2.5" /> {stu.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 pr-3 font-mono text-[11px] text-foreground">
                        <span className="rounded-md bg-muted px-2 py-0.5">{stu.studentId}</span>
                      </td>
                      <td className="py-3.5 pr-3">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-foreground text-xs truncate max-w-[200px]">
                            {crs?.name || "General Course"}
                          </span>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Building2 className="size-2.5 text-primary shrink-0" />
                            {inst?.name || "Institute"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 pr-3">
                        <span className="font-semibold text-foreground">{stu.attendanceRate}%</span>
                        <div className="h-1.5 w-16 rounded-full bg-muted mt-1 overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              stu.attendanceRate >= 90 ? "bg-emerald-500" : "bg-amber-500",
                            )}
                            style={{ width: `${stu.attendanceRate}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3.5 pr-3">
                        <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                          {stu.averageScore}%
                        </span>
                      </td>
                      <td className="py-3.5 pr-3">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold",
                            stu.status === "Active"
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          <span
                            className={cn(
                              "size-1.5 rounded-full",
                              stu.status === "Active" ? "bg-emerald-500" : "bg-muted-foreground",
                            )}
                          />
                          {stu.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right pr-4 sm:pr-0">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
                            title="View Student Dossier"
                            onClick={() => handleOpenView(stu)}
                          >
                            <Eye className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
                            title="Edit Student"
                            onClick={() => handleOpenEdit(stu)}
                          >
                            <Edit2 className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
                            title={stu.status === "Active" ? "Deactivate" : "Activate"}
                            onClick={() => toggleStudentStatus(stu.id)}
                          >
                            <Power
                              className={cn(
                                "size-3.5",
                                stu.status === "Active"
                                  ? "text-emerald-500"
                                  : "text-muted-foreground",
                              )}
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            title="Delete Student"
                            onClick={() => handleDelete(stu.id, stu.fullName)}
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

      {/* Add Student Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-overlay/70 p-4 backdrop-blur-sm animate-rise overflow-y-auto">
          <div className="glass-card w-full max-w-xl p-6 sm:p-7 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Users className="size-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Add New Student</h3>
                  <p className="text-xs text-muted-foreground">
                    Register learner under Institute → Course
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
                    Full Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    required
                    placeholder="e.g. Rahul Kumar"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Student ID <span className="text-destructive">*</span>
                  </label>
                  <Input
                    required
                    placeholder="STU-2024-001"
                    value={formData.studentId}
                    onChange={(e) =>
                      setFormData({ ...formData, studentId: e.target.value.toUpperCase() })
                    }
                    className="h-9 text-xs uppercase"
                  />
                </div>
              </div>

              {/* Dependent Dropdowns: Institute -> Course */}
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
                      const nextCourse = courses.find((c) => c.instituteId === newInstId)?.id || "";
                      setFormData({
                        ...formData,
                        instituteId: newInstId,
                        courseId: nextCourse,
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
                    Assigned Course <span className="text-destructive">*</span>
                  </label>
                  <select
                    required
                    value={formData.courseId}
                    onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                    className="h-9 w-full rounded-xl border border-input bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {formAvailableCourses.map((crs) => (
                      <option key={crs.id} value={crs.id}>
                        {crs.name} ({crs.code})
                      </option>
                    ))}
                    {formAvailableCourses.length === 0 && (
                      <option value="" disabled>
                        No courses available in this institute
                      </option>
                    )}
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
                    placeholder="rahul.kumar@gmail.com"
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
                    placeholder="+91 98711 00223"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Date of Birth
                  </label>
                  <Input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        gender: e.target.value as "Male" | "Female" | "Other",
                      })
                    }
                    className="h-9 w-full rounded-xl border border-input bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
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

              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Address</label>
                <Input
                  placeholder="Street / Flat / Colony"
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
                  Enroll Student
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {editModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-overlay/70 p-4 backdrop-blur-sm animate-rise overflow-y-auto">
          <div className="glass-card w-full max-w-xl p-6 sm:p-7 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Edit2 className="size-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Edit Student Record</h3>
                  <p className="text-xs text-muted-foreground">{selectedStudent.fullName}</p>
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
                    Student ID
                  </label>
                  <Input
                    required
                    value={formData.studentId}
                    onChange={(e) =>
                      setFormData({ ...formData, studentId: e.target.value.toUpperCase() })
                    }
                    className="h-9 text-xs uppercase"
                  />
                </div>
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
                    onChange={(e) => {
                      const newInstId = e.target.value;
                      const nextCourse = courses.find((c) => c.instituteId === newInstId)?.id || "";
                      setFormData({
                        ...formData,
                        instituteId: newInstId,
                        courseId: nextCourse,
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
                  <label className="text-xs font-semibold text-foreground mb-1 block">Course</label>
                  <select
                    required
                    value={formData.courseId}
                    onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                    className="h-9 w-full rounded-xl border border-input bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {formAvailableCourses.map((crs) => (
                      <option key={crs.id} value={crs.id}>
                        {crs.name}
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Date of Birth
                  </label>
                  <Input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        gender: e.target.value as "Male" | "Female" | "Other",
                      })
                    }
                    className="h-9 w-full rounded-xl border border-input bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
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
                  Update Record
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Student Dossier Modal */}
      {viewModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-overlay/70 p-4 backdrop-blur-sm animate-rise overflow-y-auto">
          <div className="glass-card w-full max-w-lg p-6 sm:p-7 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary font-bold text-base">
                  {selectedStudent.fullName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{selectedStudent.fullName}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {selectedStudent.studentId}
                    </span>
                    <span
                      className={cn(
                        "rounded-md px-2 py-0.2 text-[10px] font-semibold",
                        selectedStudent.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {selectedStudent.status}
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
                    Institute & Program
                  </span>
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5 mt-0.5">
                    <Building2 className="size-3 text-primary" />
                    {institutes.find((i) => i.id === selectedStudent.instituteId)?.name}
                  </span>
                  <span className="text-xs text-primary font-medium flex items-center gap-1.5 mt-1 pl-4.5">
                    <BookOpen className="size-3" />
                    {courses.find((c) => c.id === selectedStudent.courseId)?.name}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/60">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Email</span>
                    <span className="text-xs text-foreground flex items-center gap-1 mt-0.5">
                      <Mail className="size-3 text-muted-foreground" /> {selectedStudent.email}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Phone</span>
                    <span className="text-xs text-foreground flex items-center gap-1 mt-0.5">
                      <Phone className="size-3 text-muted-foreground" /> {selectedStudent.phone}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">
                      Date of Birth & Gender
                    </span>
                    <span className="text-xs text-foreground mt-0.5 block">
                      {selectedStudent.dob} ({selectedStudent.gender})
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Enrollment Date</span>
                    <span className="text-xs text-foreground mt-0.5 flex items-center gap-1">
                      <Calendar className="size-3 text-muted-foreground" />{" "}
                      {selectedStudent.enrollmentDate}
                    </span>
                  </div>
                </div>

                {selectedStudent.address && (
                  <div className="pt-1">
                    <span className="text-[10px] text-muted-foreground block">Location</span>
                    <span className="text-xs text-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="size-3 text-muted-foreground" />
                      {selectedStudent.address}, {selectedStudent.city}, {selectedStudent.state}
                    </span>
                  </div>
                )}
              </div>

              {/* Performance snapshot */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border/70 p-3 text-center bg-card">
                  <span className="text-xl font-bold text-foreground">
                    {selectedStudent.attendanceRate}%
                  </span>
                  <span className="text-[10px] text-muted-foreground block">
                    Classroom Attendance
                  </span>
                </div>
                <div className="rounded-xl border border-border/70 p-3 text-center bg-card">
                  <span className="text-xl font-bold text-primary">
                    {selectedStudent.averageScore}%
                  </span>
                  <span className="text-[10px] text-muted-foreground block">
                    Average Exam Score
                  </span>
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
                  handleOpenEdit(selectedStudent);
                }}
                className="btn-gradient rounded-xl h-10 text-xs px-5 font-semibold"
              >
                Edit Student
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
