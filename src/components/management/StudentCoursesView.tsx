import { useState } from "react";
import {
  BookOpen,
  Calendar,
  Clock,
  User,
  Building2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  FileText,
  Search,
} from "lucide-react";
import { useManagement } from "@/lib/ManagementContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function StudentCoursesView({ onStartTest }: { onStartTest?: () => void }) {
  const { courses, institutes, employees, students } = useManagement();
  const [search, setSearch] = useState("");

  // Current logged in demo student is Rahul Kumar (stu-1) or first student
  const currentStudent = students[0];
  const enrolledCourse = courses.find((c) => c.id === currentStudent?.courseId) || courses[0];
  const institute = institutes.find((i) => i.id === enrolledCourse?.instituteId);
  const teacher = employees.find((e) => e.id === enrolledCourse?.teacherId);

  const otherCourses = courses.filter((c) => c.id !== enrolledCourse?.id);

  return (
    <div className="animate-rise space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          My Enrolled Courses & Study Tracks
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Access your active syllabus, batch schedule, lecture materials, and assigned faculty.
        </p>
      </div>

      {/* Featured Enrolled Course Hero Card */}
      {enrolledCourse && (
        <div className="glass-card relative overflow-hidden rounded-2xl p-5 sm:p-7 border border-primary/20 bg-gradient-to-r from-card via-card to-primary/5 shadow-card">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-emerald-500/15 px-3 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5" /> Currently Enrolled
            </span>
            <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
              Batch 2024-25
            </span>
            <span className="font-mono text-xs text-muted-foreground ml-auto">
              {enrolledCourse.code}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
            {enrolledCourse.name}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed mb-5">
            {enrolledCourse.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-muted/40 p-4 rounded-xl mb-5">
            <div>
              <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-wider">
                Institute Campus
              </span>
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5 mt-0.5">
                <Building2 className="size-3.5 text-primary shrink-0" />
                <span className="truncate">{institute?.name}</span>
              </span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-wider">
                Lead Educator
              </span>
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5 mt-0.5">
                <User className="size-3.5 text-primary shrink-0" />
                <span className="truncate">{teacher?.fullName || "Senior Faculty"}</span>
              </span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-wider">
                Program Duration
              </span>
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5 mt-0.5">
                <Clock className="size-3.5 text-primary shrink-0" />
                {enrolledCourse.duration}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-wider">
                Active Term
              </span>
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5 mt-0.5">
                <Calendar className="size-3.5 text-primary shrink-0" />
                Till March 2025
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-muted-foreground">Course Completion & Syllabus Covered</span>
              <span className="text-primary font-bold">68% Finished</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"
                style={{ width: "68%" }}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              onClick={onStartTest}
              className="btn-gradient rounded-xl h-10 px-5 text-xs font-semibold gap-2 shadow-brand"
            >
              Take Practice Exam <ArrowRight className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-xl h-10 px-4 text-xs font-semibold gap-2"
            >
              <FileText className="size-3.5" /> Download Syllabus PDF
            </Button>
          </div>
        </div>
      )}

      {/* Explore More Courses */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-foreground">Explore Other Available Programs</h3>
            <p className="text-xs text-muted-foreground">
              Additional specialized coaching curricula offered by our institute network.
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search course title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full sm:w-56 text-xs pl-8"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {otherCourses
            .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
            .map((crs) => {
              const inst = institutes.find((i) => i.id === crs.instituteId);
              const instr = employees.find((e) => e.id === crs.teacherId);

              return (
                <div
                  key={crs.id}
                  className="glass-card p-5 flex flex-col justify-between hover:border-primary/40 transition-all duration-200"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-2">
                      <span className="font-mono bg-muted px-2 py-0.5 rounded-md">{crs.code}</span>
                      <span className="font-bold text-primary">{crs.fee}</span>
                    </div>
                    <h4 className="font-bold text-sm text-foreground mb-1.5">{crs.name}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                      {crs.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border/60 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Building2 className="size-3" /> {inst?.name}
                      </span>
                      <span className="font-medium text-foreground">{crs.duration}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <User className="size-3" /> {instr?.fullName || "Faculty"}
                      </span>
                      <span className="text-emerald-500 font-semibold">{crs.status}</span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
