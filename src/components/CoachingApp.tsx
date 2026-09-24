import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  ArrowLeft,
  ArrowRight,
  Clock3,
  Eye,
  EyeOff,
  FileBarChart,
  FileText,
  Flag,
  Gauge,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  MoreHorizontal,
  Search,
  Settings,
  Sparkles,
  Sun,
  Target,
  TrendingUp,
  Trophy,
  UserRound,
  Users,
  X,
  Zap,
  PanelLeftClose,
  PanelLeft,
  Plus,
  Download,
  Filter,
  Check,
  Award,
  RefreshCw,
  BarChart3,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Role = "admin" | "student";
type Theme = "light" | "dark";
type IconType = typeof Gauge;

const adminNav: Array<[string, IconType]> = [
  ["Dashboard", LayoutDashboard],
  ["Students", Users],
  ["Tests", ClipboardCheck],
  ["Question Bank", BookOpen],
  ["Results", Trophy],
  ["Reports", FileBarChart],
  ["Settings", Settings],
];

const studentNav: Array<[string, IconType]> = [
  ["Dashboard", LayoutDashboard],
  ["My Tests", ClipboardCheck],
  ["My Results", Trophy],
  ["Test Series", FileText],
  ["Study Material", BookOpen],
  ["Settings", Settings],
];

export function CoachingLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3" aria-label="CoachingApp">
      <div className="logo-symbol relative grid size-11 shrink-0 place-items-center rounded-[14px] bg-primary text-primary-foreground shadow-brand transition-transform duration-200 hover:scale-105">
        <GraduationCap className="size-6" strokeWidth={2.4} />
        <span className="absolute -bottom-1 -right-1 grid size-4 place-items-center rounded-full bg-brand-orange ring-[3px] ring-background">
          <BookOpen className="size-2.5 text-brand-orange-foreground" strokeWidth={2.6} />
        </span>
      </div>
      {!compact && (
        <span className="text-[21px] font-bold tracking-tight text-foreground">
          Coaching<span className="text-primary">App</span>
        </span>
      )}
    </div>
  );
}

function ThemeToggle({ theme, setTheme }: { theme: Theme; setTheme: (theme: Theme) => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-10 rounded-xl transition-all duration-200 hover:scale-105 hover:bg-primary/10 hover:text-primary"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <Sun className="size-5 text-amber-400" />
      ) : (
        <Moon className="size-5 text-blue-600" />
      )}
    </Button>
  );
}

/** Micro-animation: Count-up for statistics numbers */
function useCountUp(target: number, duration = 900) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // ease-out expo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setVal(Math.round(ease * target));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    const frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return val;
}

function CountUpMetric({ value }: { value: string }) {
  // Parse numeric portion e.g., "1,248" -> 1248, "86" -> 86, "74.4%" -> 74, "98%" -> 98
  const parsed = parseInt(value.replace(/[^0-9]/g, ""), 10);
  const suffix = value.includes("%")
    ? "%"
    : value.includes("+")
      ? "+"
      : value.includes("k")
        ? "k+"
        : "";
  const prefix = value.startsWith("#") ? "#" : value.includes("/") ? "" : "";
  const hasComma = value.includes(",");
  const animatedNumber = useCountUp(isNaN(parsed) ? 0 : parsed);

  if (isNaN(parsed) || value.includes("/")) {
    return <span className="tabular-nums">{value}</span>;
  }

  const formatted = hasComma ? animatedNumber.toLocaleString() : animatedNumber;
  return (
    <span className="tabular-nums">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

/** Micro-animation: Animated progress bar */
function AnimatedProgressBar({ value, className }: { value: number; className?: string }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setWidth(value), 120);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className={cn("h-2.5 w-full overflow-hidden rounded-full bg-muted/60 p-0.5", className)}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-1000 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, width))}%` }}
      />
    </div>
  );
}

export default function CoachingApp() {
  const [role, setRole] = useState<Role>("admin");
  const [session, setSession] = useState<Role | null>(null);
  const [theme, setTheme] = useState<Theme>("dark");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storedRole = window.localStorage.getItem("coachingapp-session");
    const storedTheme = window.localStorage.getItem("coachingapp-theme") as Theme | null;
    if (storedRole === "admin" || storedRole === "student") setSession(storedRole);
    if (storedTheme === "light" || storedTheme === "dark") setTheme(storedTheme);
    setReady(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("coachingapp-theme", theme);
  }, [theme]);

  const login = () => {
    window.localStorage.setItem("coachingapp-session", role);
    setSession(role);
  };
  const logout = () => {
    window.localStorage.removeItem("coachingapp-session");
    setSession(null);
  };

  if (!ready) return <div className="min-h-screen bg-background" />;
  return session ? (
    <Dashboard role={session} theme={theme} setTheme={setTheme} logout={logout} />
  ) : (
    <Login role={role} setRole={setRole} theme={theme} setTheme={setTheme} login={login} />
  );
}

function Login({
  role,
  setRole,
  theme,
  setTheme,
  login,
}: {
  role: Role;
  setRole: (role: Role) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  login: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [forgot, setForgot] = useState(false);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    login();
  };

  return (
    <main className="login-shell relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <CoachingLogo />
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_.95fr]">
        <section className="login-art relative hidden overflow-hidden bg-sidebar lg:flex lg:flex-col lg:justify-end lg:p-14 xl:p-20">
          <div className="visual-grid absolute inset-0 opacity-60" />
          <div className="relative z-10 max-w-xl pb-8">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary backdrop-blur-md">
              <Sparkles className="size-4 animate-spin-slow" /> Smart learning, simplified
            </span>
            <h1 className="text-5xl font-bold leading-[1.12] text-foreground xl:text-6xl">
              Everything your coaching institute needs.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground">
              Manage students, conduct online tests and turn performance data into better learning
              outcomes.
            </p>
            <div className="mt-10 flex gap-8">
              <LoginMetric value="98%" label="Student satisfaction" />
              <LoginMetric value="10k+" label="Tests completed" />
              <LoginMetric value="24/7" label="Learning access" />
            </div>
          </div>
          <div className="login-glow animate-pulse-glow absolute -right-28 top-28 size-[430px] rounded-full" />
        </section>

        <section className="flex items-center justify-center px-5 pb-10 pt-28 sm:px-10 lg:pt-24">
          <div className="glass-card w-full max-w-md animate-rise p-8 sm:p-10">
            <div className="mb-6 lg:hidden">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                <Zap className="size-3.5" /> Learn. Test. Grow.
              </span>
            </div>
            <p className="text-xs font-bold tracking-wider text-primary uppercase">Welcome Back</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Sign in to CoachingApp
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Enter your details to access your workspace.
            </p>

            <div
              className="mt-7 grid grid-cols-2 rounded-2xl bg-muted/70 p-1.5"
              aria-label="Choose account role"
            >
              {(["admin", "student"] as Role[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  className={cn(
                    "flex h-11 items-center justify-center gap-2 rounded-xl text-xs font-semibold capitalize transition-all duration-200",
                    role === item
                      ? "btn-gradient shadow-md"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  onClick={() => setRole(item)}
                >
                  {item === "admin" ? (
                    <Gauge className="size-4" />
                  ) : (
                    <GraduationCap className="size-4" />
                  )}
                  {item}
                </button>
              ))}
            </div>

            <form className="mt-7 space-y-4" onSubmit={submit}>
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-foreground">
                  Email or mobile number
                </span>
                <div className="relative">
                  <UserRound className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="input-glow h-12 rounded-xl bg-card/60 pl-11 shadow-none backdrop-blur-sm"
                    placeholder={
                      role === "admin" ? "admin@coachingapp.com" : "student@coachingapp.com"
                    }
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-foreground">Password</span>
                <div className="relative">
                  <Input
                    className="input-glow h-12 rounded-xl bg-card/60 pr-12 shadow-none backdrop-blur-sm"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    minLength={4}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 size-10 rounded-lg text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </Button>
                </div>
              </label>

              <div className="flex items-center justify-between text-xs">
                <label className="flex cursor-pointer items-center gap-2 text-muted-foreground hover:text-foreground">
                  <input type="checkbox" defaultChecked className="size-4 rounded accent-primary" />
                  Remember me
                </label>
                <button
                  type="button"
                  className="font-medium text-primary hover:underline"
                  onClick={() => setForgot(true)}
                >
                  Forgot password?
                </button>
              </div>

              {forgot && (
                <div className="animate-rise rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-xs text-foreground">
                  Demo mode: password recovery will be available when accounts are connected.
                </div>
              )}

              <button
                type="submit"
                className="btn-gradient flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold"
              >
                Sign in as {role} <ChevronRight className="size-4" />
              </button>
            </form>
            <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
              Demo access · Use any email and password
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function LoginMetric({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function Dashboard({
  role,
  theme,
  setTheme,
  logout,
}: {
  role: Role;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  logout: () => void;
}) {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("Dashboard");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const nav = role === "admin" ? adminNav : studentNav;
  const title =
    active === "Dashboard" ? `Good morning, ${role === "admin" ? "Amar" : "Aarav"}` : active;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setRefreshKey((k) => k + 1);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Desktop Sidebar with smooth collapse / expand */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r border-sidebar-border bg-sidebar/95 backdrop-blur-2xl transition-all duration-300 ease-in-out lg:flex lg:flex-col",
          collapsed ? "w-[84px] px-3 py-6" : "w-[264px] px-4 py-6",
        )}
      >
        <div className="flex items-center justify-between px-2">
          <CoachingLogo compact={collapsed} />
        </div>

        <nav className="mt-9 flex-1 space-y-1.5">
          {nav.map(([label, Icon]) => (
            <NavItem
              key={label}
              label={label}
              Icon={Icon}
              compact={collapsed}
              active={active === label}
              onClick={() => setActive(label)}
            />
          ))}
        </nav>

        {!collapsed && (
          <div className="glass-card mb-2 p-4 text-left">
            <div className="mb-2.5 grid size-9 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md">
              <Sparkles className="size-4" />
            </div>
            <p className="text-xs font-semibold">
              {role === "admin" ? "Grow your institute" : "Keep your streak alive"}
            </p>
            <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
              {role === "admin"
                ? "Explore smart reports and student test metrics."
                : "You’ve studied 5 days in a row!"}
            </p>
          </div>
        )}

        <div className="pt-2">
          <Button
            variant="ghost"
            className={cn(
              "sidebar-nav-item h-11 w-full rounded-xl text-xs text-muted-foreground hover:text-foreground",
              collapsed ? "justify-center px-0" : "justify-start px-3",
            )}
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeft className="size-4" />
            ) : (
              <>
                <PanelLeftClose className="size-4 mr-2" /> Collapse view
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            className={cn(
              "sidebar-nav-item mt-1 h-11 w-full rounded-xl text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10",
              collapsed ? "justify-center px-0" : "justify-start px-3",
            )}
            onClick={logout}
          >
            <LogOut className="size-4" />
            {!collapsed && <span className="ml-2 font-medium">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Mobile Drawer Menu */}
      {mobileMenu && (
        <div
          className="fixed inset-0 z-50 bg-overlay/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
          onClick={() => setMobileMenu(false)}
        >
          <aside
            className="animate-rise h-full w-[290px] border-r border-sidebar-border bg-sidebar p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-sidebar-border">
              <CoachingLogo />
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl"
                onClick={() => setMobileMenu(false)}
              >
                <X className="size-5" />
              </Button>
            </div>
            <nav className="mt-6 space-y-1.5">
              {nav.map(([label, Icon]) => (
                <NavItem
                  key={label}
                  label={label}
                  Icon={Icon}
                  compact={false}
                  active={active === label}
                  onClick={() => {
                    setActive(label);
                    setMobileMenu(false);
                  }}
                />
              ))}
            </nav>
            <Button
              variant="ghost"
              className="mt-8 w-full justify-start rounded-xl text-muted-foreground hover:text-destructive"
              onClick={logout}
            >
              <LogOut className="size-4 mr-2" /> Logout
            </Button>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          collapsed ? "lg:pl-[84px]" : "lg:pl-[264px]",
        )}
      >
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-7 lg:px-10">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="size-10 rounded-xl lg:hidden"
              onClick={() => setMobileMenu(true)}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                {title}
              </h1>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Here’s what’s happening with your coaching workspace today.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <div className="relative hidden md:block">
              <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="input-glow h-10 w-48 rounded-xl bg-card/60 pl-9 pr-3 text-xs shadow-none backdrop-blur-sm lg:w-60"
                placeholder="Search tests, students, questions..."
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "size-10 rounded-xl text-muted-foreground hover:text-foreground",
                isRefreshing && "animate-spin",
              )}
              onClick={handleRefresh}
              title="Refresh statistics and reload micro-animations"
            >
              <RefreshCw className="size-4" />
            </Button>

            <ThemeToggle theme={theme} setTheme={setTheme} />

            <Button
              variant="ghost"
              size="icon"
              className="relative size-10 rounded-xl text-muted-foreground hover:text-foreground"
              aria-label="Notifications"
            >
              <Bell className="size-4" />
              <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-brand-orange ring-2 ring-background" />
            </Button>

            <div className="ml-1 flex items-center gap-2 rounded-xl bg-primary/10 p-1.5 pl-2.5 text-xs font-semibold text-primary">
              <span className="hidden sm:inline font-medium text-foreground">
                {role === "admin" ? "Admin Amar" : "Student Aarav"}
              </span>
              <div className="grid size-7 place-items-center rounded-lg bg-primary text-[11px] font-bold text-primary-foreground shadow-sm">
                {role === "admin" ? "AK" : "AS"}
              </div>
            </div>
          </div>
        </header>

        <main
          key={refreshKey}
          className="mx-auto max-w-[1500px] px-4 py-6 pb-24 sm:px-7 lg:px-10 lg:py-8"
        >
          <SectionRouter active={active} role={role} onStartTest={() => setActive("Tests")} />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed inset-x-3 bottom-3 z-40 flex h-16 items-center justify-around rounded-[20px] border border-border bg-card/90 px-2 shadow-card backdrop-blur-2xl lg:hidden">
        {nav.slice(0, 4).map(([label, Icon]) => (
          <button
            key={label}
            className={cn(
              "flex h-12 min-w-14 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-medium transition-all duration-200",
              active === label
                ? "bg-primary/15 text-primary font-semibold shadow-sm"
                : "text-muted-foreground",
            )}
            onClick={() => setActive(label)}
          >
            <Icon className="size-4" />
            {label.replace("My ", "")}
          </button>
        ))}
      </nav>
    </div>
  );
}

function NavItem({
  label,
  Icon,
  active,
  compact,
  onClick,
}: {
  label: string;
  Icon: IconType;
  active: boolean;
  compact: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "sidebar-nav-item flex h-11 w-full items-center rounded-xl px-3 text-xs font-medium transition-all duration-200",
        compact ? "justify-center px-0" : "gap-3",
        active
          ? "btn-gradient active text-white shadow-brand"
          : "text-muted-foreground hover:text-foreground",
      )}
      onClick={onClick}
      title={compact ? label : undefined}
    >
      <Icon className="size-4 shrink-0" />
      {!compact && <span className="truncate">{label}</span>}
    </button>
  );
}

function SectionRouter({
  active,
  role,
  onStartTest,
}: {
  active: string;
  role: Role;
  onStartTest: () => void;
}) {
  if (active === "Dashboard") {
    return role === "admin" ? <AdminDashboard /> : <StudentDashboard />;
  }
  if (active === "Students") {
    return <StudentsView />;
  }
  if (active === "Tests" || active === "My Tests") {
    return <TestsView role={role} />;
  }
  if (active === "Question Bank") {
    return <QuestionBankView />;
  }
  if (active === "Results" || active === "My Results") {
    return <ResultsView role={role} />;
  }
  if (active === "Reports") {
    return <ReportsView />;
  }
  if (active === "Test Series") {
    return <TestSeriesView onStartTest={onStartTest} />;
  }
  if (active === "Study Material") {
    return <StudyMaterialView />;
  }
  if (active === "Settings") {
    return <SettingsView role={role} />;
  }
  return <AdminDashboard />;
}

function AdminDashboard() {
  const cards = [
    ["Total Students", "1,248", "+12.5%", Users, "primary"],
    ["Total Tests", "86", "+8 this month", FileText, "orange"],
    ["Completed Tests", "64", "74.4% rate", CheckCircle2, "green"],
    ["Pending Tests", "22", "4 due this week", CalendarDays, "pink"],
  ] as const;

  return (
    <div className="animate-rise space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, note, Icon, color]) => (
          <StatCard key={label} label={label} value={value} note={note} Icon={Icon} color={color} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
        <Panel
          title="Test Performance"
          subtitle="Average institute score across all subjects"
          action="Last 6 months"
        >
          <PerformanceChart />
        </Panel>
        <Panel title="Recent Activity" subtitle="Latest student and test actions">
          <ActivityList />
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.65fr]">
        <Panel title="Upcoming Tests" subtitle="Scheduled for this week across classes">
          <UpcomingTests />
        </Panel>
        <Panel title="Student Growth" subtitle="New enrollments and active learners in batch">
          <GrowthChart />
        </Panel>
      </div>
    </div>
  );
}

function StudentDashboard() {
  const [testOpen, setTestOpen] = useState(false);

  if (testOpen) {
    return <TestFlow onExit={() => setTestOpen(false)} />;
  }

  return (
    <div className="animate-rise space-y-6">
      <section className="student-banner glass-card relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 text-white shadow-brand sm:p-8">
        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
            <Trophy className="size-3.5" /> Your Weekly Target
          </span>
          <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
            You’re making great progress, Aarav!
          </h2>
          <p className="mt-2 text-sm text-blue-100/90">
            Complete two more mock tests to qualify for the JEE Advanced batch ranking.
          </p>
          <div className="mt-6 flex items-center gap-4">
            <div className="w-full max-w-sm">
              <AnimatedProgressBar value={72} className="bg-white/20" />
            </div>
            <span className="text-sm font-bold tabular-nums">72%</span>
          </div>
        </div>
        <Trophy className="absolute -bottom-8 right-6 size-44 text-white opacity-10 sm:right-12" />
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="My Tests"
          value="12"
          note="3 pending"
          Icon={ClipboardCheck}
          color="primary"
        />
        <StatCard
          label="My Results"
          value="84%"
          note="+6% this month"
          Icon={Trophy}
          color="orange"
        />
        <StatCard
          label="Test Series"
          value="5"
          note="2 in progress"
          Icon={FileText}
          color="green"
        />
        <StatCard
          label="Study Material"
          value="28"
          note="6 new resources"
          Icon={BookOpen}
          color="pink"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <Panel
          title="Performance Overview"
          subtitle="Your scores across recent timed mock tests"
          action="All Subjects"
        >
          <PerformanceChart student />
        </Panel>
        <Panel title="Overall Accuracy" subtitle="Derived from your recent 400+ attempts">
          <div className="flex flex-col items-center py-2">
            <ScoreRing value={84} />
            <div className="mt-6 grid w-full grid-cols-3 gap-2 text-center">
              <MiniMetric value="82%" label="Accuracy" />
              <MiniMetric value="428" label="Questions" />
              <MiniMetric value="#12" label="Batch Rank" />
            </div>
          </div>
        </Panel>
      </div>

      <Panel
        title="Upcoming Examinations"
        subtitle="Stay prepared for your next challenges"
        action="Full Calendar"
      >
        <StudentExams onStart={() => setTestOpen(true)} />
      </Panel>
    </div>
  );
}

function StatCard({
  label,
  value,
  note,
  Icon,
  color,
}: {
  label: string;
  value: string;
  note: string;
  Icon: IconType;
  color: string;
}) {
  return (
    <article className="glass-card glass-card-interactive group p-5">
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "grid size-11 place-items-center rounded-[14px] transition-transform duration-300 group-hover:scale-110",
            `stat-${color}`,
          )}
        >
          <Icon className="size-5" />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </div>
      <p className="mt-4 text-xs font-medium text-muted-foreground">{label}</p>
      <div className="mt-1 flex items-baseline justify-between gap-2">
        <strong className="text-3xl font-bold tracking-tight text-foreground">
          <CountUpMetric value={value} />
        </strong>
        <span className="text-[11px] font-semibold text-positive">{note}</span>
      </div>
    </article>
  );
}

function Panel({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle: string;
  action?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="glass-card p-5 sm:p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-bold tracking-tight text-foreground">{title}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
        </div>
        {action && (
          <Button
            variant="outline"
            className="h-8 rounded-xl px-3 text-xs font-medium transition-all duration-200 hover:scale-105 hover:border-primary/50"
          >
            {action} <ChevronRight className="ml-1 size-3 text-primary" />
          </Button>
        )}
      </div>
      {children}
    </section>
  );
}

function PerformanceChart({ student = false }: { student?: boolean }) {
  const values = student ? [42, 55, 49, 68, 72, 84] : [48, 64, 58, 74, 69, 86, 81];
  const labels = student
    ? ["Test 1", "Test 2", "Test 3", "Test 4", "Test 5", "Test 6"]
    : ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];

  return (
    <div>
      <div className="flex h-52 items-end gap-3 border-b border-border/80 px-2 sm:gap-5">
        {values.map((value, index) => (
          <div key={index} className="group relative flex h-full flex-1 items-end">
            <div
              className="animate-bar-grow relative w-full rounded-t-xl bg-gradient-to-t from-primary/30 to-primary/10 transition-all duration-300 group-hover:from-primary/50 group-hover:to-primary/20"
              style={{ height: `${value}%` }}
            >
              <div
                className="absolute inset-x-0 bottom-0 rounded-t-xl bg-gradient-to-t from-blue-700 to-primary transition-all duration-300"
                style={{ height: `${Math.max(22, value - 16)}%` }}
              />
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 rounded-md bg-card px-1.5 py-0.5 text-[10px] font-bold text-foreground shadow-sm ring-1 ring-border opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {value}%
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-between px-1 text-[11px] font-medium text-muted-foreground">
        {labels.map((x) => (
          <span key={x}>{x}</span>
        ))}
      </div>
    </div>
  );
}

function ActivityList() {
  const items = [
    ["Riya completed Physics Mock Test", "2 min ago", CheckCircle2, "green"],
    ["New student enrolled: Kabir Shah", "18 min ago", UserRound, "primary"],
    ["Maths Weekly Test was published", "1 hour ago", FileText, "orange"],
    ["Class XII report generated", "3 hours ago", FileBarChart, "pink"],
  ] as const;

  return (
    <div className="space-y-1.5">
      {items.map(([title, time, Icon, color]) => (
        <div key={title} className="table-hover-row flex items-center gap-3 rounded-xl p-3">
          <div
            className={cn("grid size-9 shrink-0 place-items-center rounded-xl", `stat-${color}`)}
          >
            <Icon className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-foreground sm:text-sm">{title}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{time}</p>
          </div>
          <ChevronRight className="size-4 text-muted-foreground/50" />
        </div>
      ))}
    </div>
  );
}

function UpcomingTests() {
  const tests = [
    ["25", "SEP", "Physics Mock Test", "Class XII · 10:00 AM · 60 Qs"],
    ["27", "SEP", "Mathematics Weekly", "Class XI · 11:30 AM · 50 Qs"],
    ["30", "SEP", "Chemistry Chapter 6", "Class XII · 09:00 AM · 45 Qs"],
  ] as const;

  return (
    <div className="space-y-3">
      {tests.map(([day, mon, title, meta]) => (
        <div
          key={title}
          className="table-hover-row flex items-center gap-3.5 rounded-[16px] border border-border/80 bg-muted/40 p-3.5 transition-all duration-200 hover:border-primary/30"
        >
          <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-card text-center shadow-sm border border-border/60">
            <span className="text-base font-bold leading-3 text-foreground">{day}</span>
            <span className="text-[9px] font-bold tracking-wider text-primary">{mon}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">{title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{meta}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:inline-flex h-8 rounded-lg text-xs"
          >
            Details
          </Button>
        </div>
      ))}
    </div>
  );
}

function GrowthChart() {
  const points = "0,120 60,104 120,110 180,76 240,82 300,45 360,54 420,20 480,28 540,10";
  return (
    <div className="h-52 w-full pt-4">
      <svg
        viewBox="0 0 540 145"
        className="h-full w-full overflow-visible text-primary"
        preserveAspectRatio="none"
        aria-label="Student growth line chart"
      >
        <defs>
          <linearGradient id="royalGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity=".35" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`M ${points} L 540 145 L 0 145 Z`} fill="url(#royalGlow)" />
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          className="animate-chart-line"
        />
        {points.split(" ").map((p, i) => {
          const [cx, cy] = p.split(",");
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r="4.5"
              fill="var(--card)"
              stroke="currentColor"
              strokeWidth="3"
              className="transition-transform duration-200 hover:scale-150"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>
    </div>
  );
}

function ScoreRing({ value }: { value: number }) {
  const animatedScore = useCountUp(value);
  return (
    <div className="relative grid size-40 place-items-center rounded-full bg-[conic-gradient(var(--primary)_0_84%,var(--muted)_84%_100%)] shadow-brand">
      <div className="grid size-[128px] place-items-center rounded-full bg-card text-center shadow-inner">
        <div>
          <strong className="text-4xl font-bold tracking-tight text-foreground tabular-nums">
            {animatedScore}%
          </strong>
          <p className="mt-0.5 text-xs text-muted-foreground font-medium">Average score</p>
        </div>
      </div>
    </div>
  );
}

function MiniMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-muted/40 p-2.5">
      <p className="text-sm font-bold text-foreground">
        <CountUpMetric value={value} />
      </p>
      <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">{label}</p>
    </div>
  );
}

function StudentExams({ onStart }: { onStart: () => void }) {
  const exams = [
    ["Physics", "Full syllabus mock test", "Available now", "15 min", true],
    ["Mathematics", "Calculus & algebra drill", "27 Sep · 11:30 AM", "60 min", false],
    ["Chemistry", "Organic reaction mechanism", "30 Sep · 09:00 AM", "75 min", false],
  ] as const;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {exams.map(([subject, title, date, time, available]) => (
        <div key={subject} className="glass-card glass-card-interactive p-4">
          <div className="flex items-center justify-between">
            <span className="rounded-lg bg-primary/15 px-2.5 py-1 text-[11px] font-bold text-primary">
              {subject}
            </span>
            <span className="text-[11px] font-medium text-muted-foreground">{time}</span>
          </div>
          <h4 className="mt-3.5 text-sm font-bold text-foreground">{title}</h4>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5 text-primary" /> {date}
          </p>
          <button
            type="button"
            className={cn(
              "mt-5 h-9 w-full rounded-xl text-xs font-semibold transition-all duration-200",
              available
                ? "btn-gradient"
                : "border border-border bg-card hover:bg-muted text-foreground",
            )}
            onClick={available ? onStart : undefined}
          >
            {available ? "Start test now" : "View schedule"}
          </button>
        </div>
      ))}
    </div>
  );
}

/* =========================================================================
   TIMED TEST FLOW & EXAM INTERFACE
   ========================================================================= */

type DemoQuestion = {
  id: number;
  section: string;
  text: string;
  options: string[];
  answer: number;
};
const demoQuestions: DemoQuestion[] = [
  {
    id: 1,
    section: "Physics",
    text: "Which physical quantity is measured in newtons?",
    options: ["Energy", "Force", "Power", "Pressure"],
    answer: 1,
  },
  {
    id: 2,
    section: "Physics",
    text: "The speed of light in vacuum is approximately:",
    options: ["3 × 10⁶ m/s", "3 × 10⁷ m/s", "3 × 10⁸ m/s", "3 × 10⁹ m/s"],
    answer: 2,
  },
  {
    id: 3,
    section: "Physics",
    text: "Which law explains action and reaction forces?",
    options: [
      "Newton’s first law",
      "Newton’s second law",
      "Newton’s third law",
      "Law of gravitation",
    ],
    answer: 2,
  },
  {
    id: 4,
    section: "Mathematics",
    text: "What is the derivative of x² with respect to x?",
    options: ["x", "2x", "x³", "2"],
    answer: 1,
  },
  {
    id: 5,
    section: "Mathematics",
    text: "If 3x + 5 = 20, what is the value of x?",
    options: ["3", "4", "5", "6"],
    answer: 2,
  },
  {
    id: 6,
    section: "Mathematics",
    text: "What is the exact mathematical value of sin 90°?",
    options: ["0", "0.5", "1", "Undefined"],
    answer: 2,
  },
];

function TestFlow({ onExit }: { onExit: () => void }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [review, setReview] = useState<number[]>([]);
  const [seconds, setSeconds] = useState(15 * 60);
  const [confirm, setConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const question = demoQuestions[index] || demoQuestions[0]!;
  const score = useMemo(
    () => demoQuestions.filter((q) => answers[q.id] === q.answer).length,
    [answers],
  );

  useEffect(() => {
    if (submitted) return;
    if (seconds <= 0) {
      setSubmitted(true);
      return;
    }
    const timer = window.setInterval(() => setSeconds((val) => val - 1), 1000);
    return () => window.clearInterval(timer);
  }, [seconds, submitted]);

  if (submitted) {
    return <TestResults answers={answers} score={score} seconds={seconds} onExit={onExit} />;
  }

  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainingSecs = (seconds % 60).toString().padStart(2, "0");
  const answered = Object.keys(answers).length;
  const sectionNames = ["Physics", "Mathematics"];

  return (
    <div className="animate-rise space-y-5">
      <div className="glass-card flex items-center justify-between p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl"
            onClick={onExit}
            aria-label="Exit test"
          >
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <h2 className="text-base font-bold text-foreground sm:text-lg">
              Full Syllabus Mock Test · JEE Standard
            </h2>
            <p className="text-xs text-muted-foreground">
              6 questions · 6 marks · Positive +1 / Negative 0
            </p>
          </div>
        </div>

        <div
          className={cn(
            "flex items-center gap-2 rounded-xl px-3.5 py-2 font-bold text-sm shadow-sm transition-colors",
            seconds < 300
              ? "bg-destructive/15 text-destructive ring-1 ring-destructive/30"
              : "bg-primary/15 text-primary ring-1 ring-primary/30",
          )}
        >
          <Clock3 className="size-4" />
          <span className="tabular-nums">
            {minutes}:{remainingSecs}
          </span>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {sectionNames.map((sec) => {
          const first = demoQuestions.findIndex((q) => q.section === sec);
          const activeSec = question.section === sec;
          return (
            <button
              key={sec}
              type="button"
              className={cn(
                "flex h-10 items-center gap-2 rounded-xl px-4 text-xs font-semibold transition-all duration-200",
                activeSec
                  ? "btn-gradient shadow-md"
                  : "glass-card hover:bg-muted text-muted-foreground",
              )}
              onClick={() => setIndex(first)}
            >
              {sec} <span className="opacity-70 text-[10px]">3 Qs</span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="glass-card p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-border/80 pb-4">
            <span className="text-xs font-bold tracking-wider text-primary uppercase">
              Question {index + 1} of {demoQuestions.length}
            </span>
            <span className="rounded-lg bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              +1.0 Marks
            </span>
          </div>

          <h3 className="mt-6 text-lg font-bold leading-8 text-foreground sm:text-xl">
            {question.text}
          </h3>

          <div className="mt-8 space-y-3">
            {question.options.map((option, optIdx) => {
              const isSelected = answers[question.id] === optIdx;
              return (
                <button
                  key={option}
                  type="button"
                  className={cn(
                    "table-hover-row grid w-full grid-cols-[38px_minmax(0,1fr)] items-center gap-3.5 rounded-[16px] border p-3.5 text-left text-sm transition-all duration-200 sm:p-4",
                    isSelected
                      ? "border-primary bg-primary/10 text-foreground ring-2 ring-primary/20 shadow-sm"
                      : "border-border/80 bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground",
                  )}
                  onClick={() => setAnswers((curr) => ({ ...curr, [question.id]: optIdx }))}
                >
                  <span
                    className={cn(
                      "grid size-9 place-items-center rounded-xl border text-xs font-bold transition-colors",
                      isSelected
                        ? "btn-gradient border-primary text-white"
                        : "border-border bg-card text-foreground",
                    )}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="font-medium text-foreground">{option}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-10 flex items-center justify-between border-t border-border/80 pt-5">
            <Button
              variant="outline"
              className="rounded-xl px-4 text-xs font-semibold"
              disabled={index === 0}
              onClick={() => setIndex(index - 1)}
            >
              <ArrowLeft className="size-4 mr-1.5" /> Previous
            </Button>

            <Button
              variant="ghost"
              className={cn(
                "rounded-xl px-3 text-xs font-semibold",
                review.includes(question.id) && "bg-brand-orange/15 text-brand-orange",
              )}
              onClick={() =>
                setReview((items) =>
                  items.includes(question.id)
                    ? items.filter((id) => id !== question.id)
                    : [...items, question.id],
                )
              }
            >
              <Flag className="size-4 mr-1.5" />
              {review.includes(question.id) ? "Marked for review" : "Mark for review"}
            </Button>

            {index < demoQuestions.length - 1 ? (
              <button
                type="button"
                className="btn-gradient flex h-10 items-center gap-2 rounded-xl px-5 text-xs font-semibold"
                onClick={() => setIndex(index + 1)}
              >
                Next <ArrowRight className="size-4" />
              </button>
            ) : (
              <button
                type="button"
                className="btn-gradient flex h-10 items-center gap-2 rounded-xl bg-positive px-6 text-xs font-semibold"
                onClick={() => setConfirm(true)}
              >
                Submit Exam
              </button>
            )}
          </div>
        </section>

        <aside className="glass-card h-fit p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground">Question Palette</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">{answered} of 6 answered</p>
            </div>
            <span className="text-xl font-bold text-primary tabular-nums">
              {Math.round((answered / 6) * 100)}%
            </span>
          </div>

          <div className="mt-4">
            <AnimatedProgressBar value={(answered / 6) * 100} />
          </div>

          {sectionNames.map((sec) => (
            <div key={sec} className="mt-6">
              <p className="mb-2.5 text-xs font-bold text-muted-foreground uppercase">{sec}</p>
              <div className="grid grid-cols-3 gap-2.5">
                {demoQuestions.map(
                  (q, qIdx) =>
                    q.section === sec && (
                      <button
                        key={q.id}
                        type="button"
                        className={cn(
                          "grid size-11 place-items-center rounded-xl border text-xs font-bold transition-all duration-200",
                          index === qIdx && "ring-2 ring-primary border-primary",
                          answers[q.id] !== undefined
                            ? "btn-gradient border-transparent text-white"
                            : "border-border bg-card hover:bg-muted text-foreground",
                          review.includes(q.id) && "ring-2 ring-brand-orange border-brand-orange",
                        )}
                        onClick={() => setIndex(qIdx)}
                      >
                        {q.id}
                      </button>
                    ),
                )}
              </div>
            </div>
          ))}

          <div className="mt-6 space-y-2 border-t border-border/80 pt-4 text-xs text-muted-foreground">
            <p className="flex items-center gap-2">
              <span className="size-3 rounded-md bg-primary" /> Answered
            </p>
            <p className="flex items-center gap-2">
              <span className="size-3 rounded-md border-2 border-brand-orange" /> Marked for review
            </p>
          </div>

          <button
            type="button"
            className="btn-gradient mt-6 flex h-11 w-full items-center justify-center rounded-xl text-xs font-semibold"
            onClick={() => setConfirm(true)}
          >
            Submit test
          </button>
        </aside>
      </div>

      {confirm && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-overlay/70 p-4 backdrop-blur-md animate-rise">
          <div className="glass-card w-full max-w-md p-6 sm:p-7 shadow-2xl">
            <div className="grid size-12 place-items-center rounded-2xl bg-brand-orange/15 text-brand-orange">
              <ClipboardCheck className="size-6" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-foreground">Submit your examination?</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              You answered {answered} of 6 questions. Once submitted, answers cannot be edited.
            </p>
            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-xl h-11"
                onClick={() => setConfirm(false)}
              >
                Keep reviewing
              </Button>
              <button
                type="button"
                className="btn-gradient flex-1 h-11 rounded-xl text-xs font-semibold"
                onClick={() => {
                  setConfirm(false);
                  setSubmitted(true);
                }}
              >
                Submit now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TestResults({
  answers,
  score,
  seconds,
  onExit,
}: {
  answers: Record<number, number>;
  score: number;
  seconds: number;
  onExit: () => void;
}) {
  const answered = Object.keys(answers).length;
  const percentage = Math.round((score / demoQuestions.length) * 100);
  const used = 15 * 60 - seconds;

  return (
    <div className="animate-rise space-y-6">
      <section className="glass-card relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 text-white shadow-brand sm:p-8">
        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
            <CheckCircle2 className="size-4" /> Attempt Evaluated
          </span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Great effort, Aarav!</h2>
          <p className="mt-2 text-sm text-blue-100">
            Your results are synchronized with the national coaching percentile rank.
          </p>
        </div>
        <Trophy className="absolute -bottom-8 right-6 size-44 text-white opacity-10" />
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Final Score"
          value={`${score}/6`}
          note={`${percentage}%`}
          Icon={Trophy}
          color="primary"
        />
        <StatCard
          label="Accuracy"
          value={`${percentage}%`}
          note={`${score} correct`}
          Icon={Target}
          color="green"
        />
        <StatCard
          label="Attempted"
          value={`${answered}/6`}
          note={`${6 - answered} skipped`}
          Icon={ClipboardCheck}
          color="orange"
        />
        <StatCard
          label="Time Used"
          value={`${Math.floor(used / 60)}m ${used % 60}s`}
          note="of 15 min"
          Icon={Clock3}
          color="pink"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
        <Panel title="Section Breakdown" subtitle="Subject-wise accuracy and marks">
          <div className="space-y-5">
            {["Physics", "Mathematics"].map((sec) => {
              const qs = demoQuestions.filter((q) => q.section === sec);
              const correct = qs.filter((q) => answers[q.id] === q.answer).length;
              const pct = Math.round((correct / 3) * 100);
              return (
                <div key={sec} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>{sec}</span>
                    <span className="text-primary tabular-nums">
                      {correct}/3 ({pct}%)
                    </span>
                  </div>
                  <AnimatedProgressBar value={pct} />
                </div>
              );
            })}
          </div>

          <button
            type="button"
            className="btn-gradient mt-8 flex h-11 w-full items-center justify-center gap-2 rounded-xl text-xs font-semibold"
            onClick={onExit}
          >
            <ArrowLeft className="size-4" /> Back to Dashboard
          </button>
        </Panel>

        <Panel title="Answer Review" subtitle="Step-by-step key and your chosen options">
          <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
            {demoQuestions.map((q) => {
              const sel = answers[q.id];
              const isCorrect = sel === q.answer;
              return (
                <div
                  key={q.id}
                  className="rounded-[16px] border border-border/80 bg-muted/30 p-4 transition-all duration-200"
                >
                  <div className="flex gap-3">
                    <span
                      className={cn(
                        "grid size-7 shrink-0 place-items-center rounded-lg text-xs font-bold",
                        isCorrect ? "stat-green" : "stat-pink",
                      )}
                    >
                      {q.id}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-foreground sm:text-sm">{q.text}</p>
                      <p
                        className={cn(
                          "mt-1.5 text-xs font-medium",
                          isCorrect ? "text-positive" : "text-destructive",
                        )}
                      >
                        {sel === undefined ? "Not attempted" : `Your answer: ${q.options[sel]}`}
                      </p>
                      {!isCorrect && (
                        <p className="mt-0.5 text-xs font-semibold text-positive">
                          Correct: {q.options[q.answer]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* =========================================================================
   NEW PREMIUM SAAS INTERFACES FOR ALL OTHER NAV SECTIONS
   ========================================================================= */

function StudentsView() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const students = [
    {
      name: "Aarav Sharma",
      roll: "ST-101",
      batch: "Class XII (JEE)",
      attend: "96%",
      score: "88%",
      status: "Active",
    },
    {
      name: "Riya Verma",
      roll: "ST-102",
      batch: "Class XII (JEE)",
      attend: "94%",
      score: "92%",
      status: "Active",
    },
    {
      name: "Kabir Shah",
      roll: "ST-103",
      batch: "Class XI (NEET)",
      attend: "91%",
      score: "81%",
      status: "Active",
    },
    {
      name: "Ananya Iyer",
      roll: "ST-104",
      batch: "Class XII (JEE)",
      attend: "89%",
      score: "85%",
      status: "Active",
    },
    {
      name: "Dev Patel",
      roll: "ST-105",
      batch: "Class XI (NEET)",
      attend: "78%",
      score: "74%",
      status: "Pending",
    },
    {
      name: "Meera Nair",
      roll: "ST-106",
      batch: "Foundation",
      attend: "98%",
      score: "95%",
      status: "Active",
    },
  ];

  const filtered = students.filter((s) => {
    const matchFilter = filter === "All" || s.batch.includes(filter);
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.roll.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="animate-rise space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Students Directory
          </h2>
          <p className="text-xs text-muted-foreground">
            Manage student batches, monitor attendance, and track exam performance.
          </p>
        </div>
        <button
          type="button"
          className="btn-gradient inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-xs font-semibold shadow-brand"
        >
          <Plus className="size-4" /> Add New Student
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Enrolled"
          value="1,248"
          note="+14 this week"
          Icon={Users}
          color="primary"
        />
        <StatCard
          label="Active Today"
          value="1,180"
          note="94.5% rate"
          Icon={CheckCircle2}
          color="green"
        />
        <StatCard label="Avg Test Score" value="84%" note="+3.2%" Icon={Trophy} color="orange" />
        <StatCard
          label="Pending Attention"
          value="18"
          note="Low attendance"
          Icon={AlertCircle}
          color="pink"
        />
      </div>

      <div className="glass-card p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4">
          <div className="flex flex-wrap gap-2">
            {["All", "Class XII", "Class XI", "Foundation"].map((tab) => (
              <button
                key={tab}
                type="button"
                className={cn(
                  "h-8 rounded-xl px-3 text-xs font-semibold transition-all duration-200",
                  filter === tab
                    ? "btn-gradient shadow-sm"
                    : "bg-muted/60 text-muted-foreground hover:text-foreground",
                )}
                onClick={() => setFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="input-glow h-9 w-full rounded-xl bg-card pl-8 text-xs sm:w-64"
              placeholder="Search name or roll no..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/80 text-muted-foreground">
                <th className="pb-3 font-semibold">Student</th>
                <th className="pb-3 font-semibold">Roll No</th>
                <th className="pb-3 font-semibold">Batch</th>
                <th className="pb-3 font-semibold">Attendance</th>
                <th className="pb-3 font-semibold">Avg Score</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((s) => (
                <tr key={s.roll} className="table-hover-row group">
                  <td className="py-3.5 pr-3 font-medium text-foreground">
                    <div className="flex items-center gap-2.5">
                      <div className="grid size-8 place-items-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                        {s.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span>{s.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 pr-3 text-muted-foreground font-mono">{s.roll}</td>
                  <td className="py-3.5 pr-3 text-foreground">{s.batch}</td>
                  <td className="py-3.5 pr-3 font-semibold text-foreground">{s.attend}</td>
                  <td className="py-3.5 pr-3 font-semibold text-primary">{s.score}</td>
                  <td className="py-3.5 pr-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        s.status === "Active"
                          ? "bg-positive/15 text-positive"
                          : "bg-destructive/15 text-destructive",
                      )}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TestsView({ role }: { role: Role }) {
  const [filter, setFilter] = useState("Active");

  const tests = [
    {
      title: "Full Syllabus JEE Mock Test 1",
      subject: "Physics & Maths",
      duration: "15 min",
      qs: "6 Qs",
      marks: "6 Marks",
      date: "Available Now",
      status: "Active",
    },
    {
      title: "Electrostatics & Current Electricity",
      subject: "Physics",
      duration: "45 min",
      qs: "30 Qs",
      marks: "120 Marks",
      date: "Tomorrow, 10:00 AM",
      status: "Scheduled",
    },
    {
      title: "Differential Calculus Master Test",
      subject: "Mathematics",
      duration: "60 min",
      qs: "40 Qs",
      marks: "160 Marks",
      date: "28 Sep, 11:00 AM",
      status: "Scheduled",
    },
    {
      title: "Organic Chemistry Complete Diagnostic",
      subject: "Chemistry",
      duration: "50 min",
      qs: "35 Qs",
      marks: "140 Marks",
      date: "Completed on 22 Sep",
      status: "Completed",
    },
  ];

  return (
    <div className="animate-rise space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {role === "admin" ? "Test Management" : "My Scheduled & Practice Tests"}
          </h2>
          <p className="text-xs text-muted-foreground">
            Browse examination papers, review syllabus topics, and view timed question distribution.
          </p>
        </div>
        {role === "admin" && (
          <button
            type="button"
            className="btn-gradient inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-xs font-semibold shadow-brand"
          >
            <Plus className="size-4" /> Create Online Test
          </button>
        )}
      </div>

      <div className="flex gap-2 border-b border-border/80 pb-3">
        {["Active", "Scheduled", "Completed"].map((tab) => (
          <button
            key={tab}
            type="button"
            className={cn(
              "rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200",
              filter === tab
                ? "btn-gradient shadow-sm"
                : "bg-muted/60 text-muted-foreground hover:text-foreground",
            )}
            onClick={() => setFilter(tab)}
          >
            {tab} Tests
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {tests.map((test) => (
          <div key={test.title} className="glass-card glass-card-interactive p-5">
            <div className="flex items-center justify-between">
              <span className="rounded-lg bg-primary/15 px-2.5 py-1 text-[11px] font-bold text-primary">
                {test.subject}
              </span>
              <span className="text-[11px] font-semibold text-muted-foreground">
                {test.duration}
              </span>
            </div>
            <h3 className="mt-3.5 text-base font-bold text-foreground">{test.title}</h3>
            <div className="mt-2.5 flex items-center gap-4 text-xs text-muted-foreground">
              <span>{test.qs}</span>
              <span>·</span>
              <span>{test.marks}</span>
              <span>·</span>
              <span className="text-primary font-medium">{test.date}</span>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                className="btn-gradient flex-1 h-9 rounded-xl text-xs font-semibold"
                onClick={() => window.location.reload()}
              >
                {role === "admin" ? "Edit Test" : "Start Online Test"}
              </button>
              <Button variant="outline" className="h-9 rounded-xl px-3 text-xs">
                Syllabus
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuestionBankView() {
  const [subject, setSubject] = useState("Physics");

  const questions = [
    {
      id: 1,
      sub: "Physics",
      topic: "Mechanics",
      q: "Which physical quantity is measured in newtons?",
      diff: "Easy",
      ans: "Force",
    },
    {
      id: 2,
      sub: "Physics",
      topic: "Optics",
      q: "The speed of light in vacuum is approximately 3 × 10⁸ m/s.",
      diff: "Medium",
      ans: "3 × 10⁸ m/s",
    },
    {
      id: 3,
      sub: "Mathematics",
      topic: "Calculus",
      q: "What is the derivative of x² with respect to x?",
      diff: "Easy",
      ans: "2x",
    },
    {
      id: 4,
      sub: "Chemistry",
      topic: "Inorganic",
      q: "Which element has the highest electronegativity on the Pauling scale?",
      diff: "Medium",
      ans: "Fluorine",
    },
  ];

  return (
    <div className="animate-rise space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Question Bank Repository
          </h2>
          <p className="text-xs text-muted-foreground">
            Centralized repository of verified questions with step-by-step solutions.
          </p>
        </div>
        <button
          type="button"
          className="btn-gradient inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-xs font-semibold shadow-brand"
        >
          <Plus className="size-4" /> Add Question
        </button>
      </div>

      <div className="glass-card p-5 sm:p-6">
        <div className="flex flex-wrap gap-2 pb-5 border-b border-border/80">
          {["All", "Physics", "Chemistry", "Mathematics", "Biology"].map((sub) => (
            <button
              key={sub}
              type="button"
              className={cn(
                "rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200",
                subject === sub
                  ? "btn-gradient shadow-sm"
                  : "bg-muted/60 text-muted-foreground hover:text-foreground",
              )}
              onClick={() => setSubject(sub)}
            >
              {sub}
            </button>
          ))}
        </div>

        <div className="mt-5 space-y-3.5">
          {questions.map((item) => (
            <div
              key={item.id}
              className="table-hover-row rounded-[16px] border border-border/80 bg-card/60 p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary">
                  {item.sub} · {item.topic}
                </span>
                <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  {item.diff}
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-foreground">{item.q}</p>
              <p className="mt-2 text-xs font-medium text-positive">Answer Key: {item.ans}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResultsView({ role }: { role: Role }) {
  const leaders = [
    { rank: "#1", name: "Riya Verma", score: "98%", time: "11m 40s", badge: "Gold" },
    { rank: "#2", name: "Aarav Sharma", score: "94%", time: "12m 15s", badge: "Silver" },
    { rank: "#3", name: "Meera Nair", score: "92%", time: "13m 05s", badge: "Bronze" },
    { rank: "#4", name: "Kabir Shah", score: "88%", time: "14m 20s", badge: "" },
  ];

  return (
    <div className="animate-rise space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {role === "admin" ? "Institute Leaderboard & Test Results" : "My Results & Ranking"}
        </h2>
        <p className="text-xs text-muted-foreground">
          Comprehensive evaluation analytics and rank percentiles.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {leaders.slice(0, 3).map((l, i) => (
          <div key={l.name} className="glass-card glass-card-interactive p-5 text-center">
            <div
              className={cn(
                "mx-auto grid size-12 place-items-center rounded-2xl text-lg font-bold shadow-md",
                i === 0 ? "btn-gradient text-white" : "bg-muted text-foreground",
              )}
            >
              {l.rank}
            </div>
            <h4 className="mt-3 text-sm font-bold text-foreground">{l.name}</h4>
            <p className="mt-1 text-2xl font-bold text-primary">{l.score}</p>
            <p className="mt-1 text-xs text-muted-foreground">Time: {l.time}</p>
          </div>
        ))}
      </div>

      <div className="glass-card p-5 sm:p-6">
        <h3 className="text-base font-bold text-foreground">Top Rankers Across All Batches</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/80 text-muted-foreground">
                <th className="pb-3 font-semibold">Rank</th>
                <th className="pb-3 font-semibold">Student Name</th>
                <th className="pb-3 font-semibold">Score</th>
                <th className="pb-3 font-semibold">Time Taken</th>
                <th className="pb-3 font-semibold text-right">Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {leaders.map((l) => (
                <tr key={l.name} className="table-hover-row">
                  <td className="py-3 font-bold text-primary font-mono">{l.rank}</td>
                  <td className="py-3 font-medium text-foreground">{l.name}</td>
                  <td className="py-3 font-bold text-foreground">{l.score}</td>
                  <td className="py-3 text-muted-foreground font-mono">{l.time}</td>
                  <td className="py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-primary hover:text-primary"
                    >
                      Download PDF
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ReportsView() {
  return (
    <div className="animate-rise space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Institute Analytics & Reports
          </h2>
          <p className="text-xs text-muted-foreground">
            Export attendance statements, batch metrics, and question difficulty indexes.
          </p>
        </div>
        <button
          type="button"
          className="btn-gradient inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-xs font-semibold shadow-brand"
        >
          <Download className="size-4" /> Export All (CSV)
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Panel title="Attendance Velocity" subtitle="Weekly student physical and online check-ins">
          <PerformanceChart />
        </Panel>
        <Panel
          title="Score Distribution"
          subtitle="Normalized Gaussian score spread across batches"
        >
          <GrowthChart />
        </Panel>
      </div>
    </div>
  );
}

function TestSeriesView({ onStartTest }: { onStartTest: () => void }) {
  const series = [
    {
      title: "JEE Advanced 2026 Grand Master Series",
      tests: "24 Mock Tests",
      enr: "420 Students",
      tag: "Comprehensive",
    },
    {
      title: "NEET Medical Precision Test Series",
      tests: "18 Full Tests",
      enr: "380 Students",
      tag: "NCERT Grounded",
    },
    {
      title: "Class XI Foundation Booster Drill",
      tests: "12 Unit Tests",
      enr: "210 Students",
      tag: "Conceptual",
    },
  ];

  return (
    <div className="animate-rise space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Curated Test Series
        </h2>
        <p className="text-xs text-muted-foreground">
          Comprehensive multi-stage test packages designed by top faculty.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {series.map((s) => (
          <div
            key={s.title}
            className="glass-card glass-card-interactive p-5 flex flex-col justify-between"
          >
            <div>
              <span className="rounded-lg bg-primary/15 px-2.5 py-1 text-[11px] font-bold text-primary">
                {s.tag}
              </span>
              <h3 className="mt-3 text-base font-bold text-foreground">{s.title}</h3>
              <p className="mt-2 text-xs text-muted-foreground">
                {s.tests} · {s.enr}
              </p>
            </div>
            <button
              type="button"
              className="btn-gradient mt-6 h-10 w-full rounded-xl text-xs font-semibold"
              onClick={onStartTest}
            >
              Enroll & Take Test
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function StudyMaterialView() {
  const materials = [
    { title: "Physics: Rotational Motion Formula Sheet", type: "PDF Guide", size: "2.4 MB" },
    {
      title: "Mathematics: Integration Shortcuts & Hacks",
      type: "Handwritten Notes",
      size: "4.1 MB",
    },
    { title: "Chemistry: Organic Name Reactions Handbook", type: "Cheat Sheet", size: "1.8 MB" },
    {
      title: "Biology: Human Physiology Illustrated Summary",
      type: "Color Diagrams",
      size: "6.2 MB",
    },
  ];

  return (
    <div className="animate-rise space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Study Material & Reference Library
        </h2>
        <p className="text-xs text-muted-foreground">
          Download curated revision notes, mind maps, and formula handbooks.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {materials.map((m) => (
          <div
            key={m.title}
            className="glass-card glass-card-interactive flex items-center justify-between p-4 sm:p-5"
          >
            <div className="flex items-center gap-3.5">
              <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <BookOpen className="size-5" />
              </div>
              <div className="min-w-0">
                <h4 className="truncate text-sm font-bold text-foreground">{m.title}</h4>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {m.type} · {m.size}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="h-9 rounded-xl text-xs shrink-0">
              <Download className="size-3.5 mr-1.5" /> Download
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsView({ role }: { role: Role }) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="animate-rise max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Workspace Settings
        </h2>
        <p className="text-xs text-muted-foreground">
          Configure institute profile, test preferences, and notifications.
        </p>
      </div>

      <div className="glass-card p-6 space-y-5">
        <h3 className="text-sm font-bold text-foreground border-b border-border/80 pb-3">
          Institute & Account Profile
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-foreground">
              Institute Name
            </span>
            <Input
              className="input-glow h-11 rounded-xl bg-card"
              defaultValue="Apex Coaching Academy"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-foreground">
              Registered Email
            </span>
            <Input
              className="input-glow h-11 rounded-xl bg-card"
              defaultValue={role === "admin" ? "admin@coachingapp.com" : "aarav@student.com"}
            />
          </label>
        </div>

        <h3 className="text-sm font-bold text-foreground border-b border-border/80 pb-3 pt-4">
          Exam Defaults
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-foreground">
              Default Test Duration (Minutes)
            </span>
            <Input className="input-glow h-11 rounded-xl bg-card" defaultValue="60" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-foreground">
              Negative Marking Penalty
            </span>
            <Input className="input-glow h-11 rounded-xl bg-card" defaultValue="-0.25" />
          </label>
        </div>

        <div className="pt-4 flex items-center justify-between">
          {saved && (
            <span className="text-xs font-semibold text-positive">
              Settings saved successfully!
            </span>
          )}
          <button
            type="button"
            className="btn-gradient ml-auto h-11 rounded-xl px-6 text-xs font-semibold shadow-brand"
            onClick={() => {
              setSaved(true);
              setTimeout(() => setSaved(false), 2500);
            }}
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
