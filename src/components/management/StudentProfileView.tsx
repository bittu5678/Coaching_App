import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Building2,
  BookOpen,
  Save,
  CheckCircle2,
  ShieldCheck,
  Award,
  Sparkles,
  Camera,
} from "lucide-react";
import { useManagement } from "@/lib/ManagementContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function StudentProfileView() {
  const { currentStudent, updateStudent, courses, institutes } = useManagement();

  const enrolledCourse = courses.find((c) => c.id === currentStudent?.courseId);
  const institute = institutes.find((i) => i.id === currentStudent?.instituteId);

  const [formData, setFormData] = useState({
    fullName: currentStudent?.fullName || "Rahul Kumar",
    studentId: currentStudent?.studentId || "STU-2024-001",
    email: currentStudent?.email || "rahul.kumar@gmail.com",
    phone: currentStudent?.phone || "+91 98711 00223",
    dob: currentStudent?.dob || "2007-03-14",
    gender: (currentStudent?.gender || "Male") as "Male" | "Female" | "Other",
    address: currentStudent?.address || "44 Model Town, Phase 2",
    city: currentStudent?.city || "New Delhi",
    state: currentStudent?.state || "Delhi",
    guardianName: currentStudent?.guardianName || "Suresh Kumar",
    guardianPhone: currentStudent?.guardianPhone || "+91 98711 99887",
    avatarUrl:
      currentStudent?.avatarUrl ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!currentStudent) {
    return (
      <div className="glass-card p-8 text-center text-muted-foreground">
        No student profile found.
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudent(currentStudent.id, {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      dob: formData.dob,
      gender: formData.gender,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      guardianName: formData.guardianName,
      guardianPhone: formData.guardianPhone,
      avatarUrl: formData.avatarUrl,
    });

    setSuccessMessage("Your profile information has been saved successfully.");
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <div className="animate-rise space-y-6">
      {/* Header Banner */}
      <div className="glass-card relative overflow-hidden rounded-2xl p-5 sm:p-7 border border-primary/20 bg-gradient-to-r from-card via-card to-primary/5 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative size-16 sm:size-20 rounded-2xl bg-white p-1 shadow-md ring-1 ring-border/50 shrink-0 overflow-hidden">
              <img
                src={formData.avatarUrl}
                alt={formData.fullName}
                className="size-full object-cover rounded-xl"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary font-mono">
                  {formData.studentId}
                </span>
                <span className="rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 text-[11px] font-semibold flex items-center gap-1">
                  <ShieldCheck className="size-3" /> Active Enrolled Student
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
                {formData.fullName}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {enrolledCourse?.name || "Senior Curriculum"} ·{" "}
                {institute?.name || "Coaching Campus"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold shrink-0">
            <div className="bg-card border border-border/80 px-3 py-2 rounded-xl text-center shadow-xs">
              <span className="text-[10px] text-muted-foreground block uppercase font-bold">
                Attendance
              </span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {currentStudent.attendanceRate}%
              </span>
            </div>
            <div className="bg-card border border-border/80 px-3 py-2 rounded-xl text-center shadow-xs">
              <span className="text-[10px] text-muted-foreground block uppercase font-bold">
                Avg Score
              </span>
              <span className="text-sm font-bold text-primary">{currentStudent.averageScore}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Success alert */}
      {successMessage && (
        <div className="flex items-center gap-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-xs font-medium text-emerald-700 dark:text-emerald-300 animate-rise">
          <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="glass-card p-5 sm:p-7 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-border/60">
          <div>
            <h3 className="text-base font-bold text-foreground">Personal Details & Contacts</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Keep your contact information up to date for SMS test notifications and admit cards.
            </p>
          </div>
          <Button
            type="submit"
            className="btn-gradient inline-flex h-9 items-center gap-2 rounded-xl px-4 text-xs font-semibold shadow-brand"
          >
            <Save className="size-3.5" /> Save Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">Full Name *</label>
            <Input
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
              className="rounded-xl text-xs h-10"
              placeholder="e.g., Rahul Kumar"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">
              Student ID / Enrollment Roll Number
            </label>
            <Input
              value={formData.studentId}
              disabled
              className="rounded-xl text-xs h-10 font-mono bg-muted/40 cursor-not-allowed"
            />
            <span className="text-[10px] text-muted-foreground mt-1 block">
              Assigned permanently by your institute administration.
            </span>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">
              Email Address *
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="rounded-xl text-xs h-10"
              placeholder="rahul.kumar@gmail.com"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">
              Mobile Number *
            </label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              className="rounded-xl text-xs h-10 font-mono"
              placeholder="+91 98711 00223"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">
              Date of Birth *
            </label>
            <Input
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              required
              className="rounded-xl text-xs h-10"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">Gender *</label>
            <select
              value={formData.gender}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  gender: e.target.value as "Male" | "Female" | "Other",
                })
              }
              className="w-full h-10 rounded-xl border border-input bg-card px-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-foreground mb-1 block">
              Residential Address *
            </label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
              className="rounded-xl text-xs h-10"
              placeholder="44 Model Town, Phase 2"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">City *</label>
            <Input
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
              className="rounded-xl text-xs h-10"
              placeholder="New Delhi"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">State *</label>
            <Input
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              required
              className="rounded-xl text-xs h-10"
              placeholder="Delhi"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">
              Parent / Guardian Name
            </label>
            <Input
              value={formData.guardianName}
              onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
              className="rounded-xl text-xs h-10"
              placeholder="Suresh Kumar"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">
              Parent Emergency Phone
            </label>
            <Input
              value={formData.guardianPhone}
              onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
              className="rounded-xl text-xs h-10 font-mono"
              placeholder="+91 98711 99887"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-foreground mb-1 block">
              Profile Photo URL
            </label>
            <Input
              value={formData.avatarUrl}
              onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
              className="rounded-xl text-xs h-10"
              placeholder="https://... (direct image link)"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
