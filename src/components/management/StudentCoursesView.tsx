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
  IndianRupee,
  Eye,
  X,
  CreditCard,
} from "lucide-react";
import { useManagement } from "@/lib/ManagementContext";
import { type Course } from "@/lib/managementData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function StudentCoursesView({ onStartTest }: { onStartTest?: () => void }) {
  const { courses, institutes, employees, currentStudent } = useManagement();
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Current logged in demo student enrolled course
  const enrolledCourse = courses.find((c) => c.id === currentStudent?.courseId) || courses[0];
  const institute = institutes.find((i) => i.id === enrolledCourse?.instituteId);
  const teacher = employees.find((e) => e.id === enrolledCourse?.teacherId);

  const otherCourses = courses.filter((c) => c.id !== enrolledCourse?.id);

  const handleOpenCourseDetails = (crs: Course) => {
    setSelectedCourse(crs);
    setDetailsModalOpen(true);
  };

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

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenCourseDetails(crs)}
                      className="w-full h-8 text-xs font-semibold rounded-lg mt-2 gap-1.5"
                    >
                      <Eye className="size-3.5" /> View Course Syllabus & Details
                    </Button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Course Details Modal */}
      {detailsModalOpen && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="glass-card w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-border/80 animate-rise bg-card max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <BookOpen className="size-5 text-primary" />
                <h3 className="text-sm font-bold text-foreground">Course Overview & Syllabus</h3>
              </div>
              <button
                type="button"
                onClick={() => setDetailsModalOpen(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="pt-4 space-y-4 text-xs">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-mono text-xs font-bold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                  {selectedCourse.code}
                </span>
                <span className="font-bold text-sm text-foreground">{selectedCourse.fee}</span>
              </div>

              <div>
                <h4 className="text-base font-bold text-foreground mb-1">{selectedCourse.name}</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedCourse.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-muted/40 p-3 rounded-xl">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                    Duration
                  </span>
                  <span className="font-semibold text-foreground">{selectedCourse.duration}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                    Campus Institute
                  </span>
                  <span className="font-semibold text-foreground">
                    {institutes.find((i) => i.id === selectedCourse.instituteId)?.name}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                    Start Date
                  </span>
                  <span className="font-semibold text-foreground">{selectedCourse.startDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                    End Date
                  </span>
                  <span className="font-semibold text-foreground">{selectedCourse.endDate}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-border/60 bg-card space-y-1.5">
                <span className="font-bold text-foreground block">Curriculum Highlights</span>
                <ul className="list-disc pl-4 space-y-1 text-muted-foreground text-[11px]">
                  <li>Weekly conceptual lectures with live problem solving</li>
                  <li>Full syllabus chapter-wise and mock tests</li>
                  <li>Detailed performance analysis and test rankings</li>
                  <li>Exclusive study notes, DPPs, and formula handbooks</li>
                </ul>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDetailsModalOpen(false)}
                  className="h-9 rounded-xl text-xs"
                >
                  Close
                </Button>
                {onStartTest && (
                  <Button
                    type="button"
                    onClick={() => {
                      setDetailsModalOpen(false);
                      onStartTest();
                    }}
                    className="btn-gradient h-9 rounded-xl text-xs font-semibold px-4 shadow-brand"
                  >
                    Take Practice Test
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
