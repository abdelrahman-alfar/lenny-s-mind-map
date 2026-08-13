import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  ChevronRight,
  Dumbbell,
  Flame,
  Trophy,
  Settings,
} from "lucide-react";
import { PHASES, PROGRAM, Week } from "@/data/kettlebell/program";
import { useWorkoutProgress } from "@/hooks/useWorkoutProgress";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const phaseAccent: Record<string, string> = {
  foundation: "text-emerald-400 border-emerald-400/30 bg-emerald-400/5",
  strength: "text-amber-400 border-amber-400/30 bg-amber-400/5",
  peak: "text-rose-400 border-rose-400/30 bg-rose-400/5",
};

const phaseDot: Record<string, string> = {
  foundation: "bg-emerald-400",
  strength: "bg-amber-400",
  peak: "bg-rose-400",
};

export default function Dashboard() {
  const progress = useWorkoutProgress();
  const {
    percentComplete,
    completedCount,
    totalSessions,
    currentWeek,
    streak,
    unit,
    setUnit,
    resetAll,
    isSessionComplete,
  } = progress;

  // Default the accordion open on the phase containing the current week.
  const currentPhaseId = useMemo(
    () => PROGRAM.find((w) => w.number === currentWeek)?.phaseId ?? "foundation",
    [currentWeek]
  );

  return (
    <div className="min-h-screen bg-[image:var(--gradient-hero)] pb-16">
      <div className="mx-auto max-w-2xl px-4">
        {/* Header */}
        <header className="flex items-center justify-between pb-6 pt-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[var(--glow-soft)]">
              <Dumbbell className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold leading-none">Kettlebell 12</h1>
              <p className="text-xs text-muted-foreground">3-month program</p>
            </div>
          </div>
          <SettingsDialog unit={unit} setUnit={setUnit} resetAll={resetAll} />
        </header>

        {/* Progress hero */}
        <ProgressHero
          percent={percentComplete}
          completed={completedCount}
          total={totalSessions}
          streak={streak}
          currentWeek={currentWeek}
        />

        {/* Phases + weeks */}
        <section className="mt-8">
          <Accordion type="multiple" defaultValue={[currentPhaseId]} className="space-y-4">
            {PHASES.map((phase) => {
              const weeks = PROGRAM.filter((w) => w.phaseId === phase.id);
              const done = weeks.reduce(
                (n, w) => n + w.sessions.filter((s) => isSessionComplete(w.number, s.id)).length,
                0
              );
              const total = weeks.reduce((n, w) => n + w.sessions.length, 0);
              return (
                <AccordionItem
                  key={phase.id}
                  value={phase.id}
                  className={cn("overflow-hidden rounded-2xl border", phaseAccent[phase.id])}
                >
                  <AccordionTrigger className="px-4 py-4 hover:no-underline">
                    <div className="flex flex-1 items-center gap-3 text-left">
                      <span className={cn("h-2.5 w-2.5 rounded-full", phaseDot[phase.id])} />
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="font-display font-semibold text-foreground">
                            {phase.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Weeks {phase.weeks[0]}–{phase.weeks[phase.weeks.length - 1]}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">{phase.summary}</p>
                      </div>
                      <span className="mr-1 text-xs font-medium tabular-nums text-muted-foreground">
                        {done}/{total}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-3 pb-3">
                    <div className="space-y-2">
                      {weeks.map((week) => (
                        <WeekRow
                          key={week.number}
                          week={week}
                          isCurrent={week.number === currentWeek}
                          isSessionComplete={isSessionComplete}
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </section>

        <footer className="mt-10 text-center text-xs text-muted-foreground">
          Progress is saved on this device only. Train hard. 💪
        </footer>
      </div>
    </div>
  );
}

function ProgressHero({
  percent,
  completed,
  total,
  streak,
  currentWeek,
}: {
  percent: number;
  completed: number;
  total: number;
  streak: number;
  currentWeek: number;
}) {
  const allDone = completed === total;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-[image:var(--gradient-card)] p-5"
    >
      <div className="flex items-center gap-5">
        <ProgressRing percent={percent} />
        <div className="flex-1">
          <div className="text-sm text-muted-foreground">
            {allDone ? "Program complete!" : `You're on Week ${currentWeek}`}
          </div>
          <div className="mt-1 font-display text-2xl font-bold">
            {completed}
            <span className="text-base font-normal text-muted-foreground"> / {total} sessions</span>
          </div>
          <div className="mt-3 flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5 text-primary">
              <Flame className="h-4 w-4" />
              <span className="font-semibold tabular-nums">{streak}</span>
              <span className="text-muted-foreground">day streak</span>
            </span>
            {allDone && (
              <span className="flex items-center gap-1.5 text-accent">
                <Trophy className="h-4 w-4" />
                <span className="font-semibold">Done!</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProgressRing({ percent }: { percent: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <div className="relative h-24 w-24 shrink-0">
      <svg className="h-24 w-24 -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="7" />
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display text-xl font-bold tabular-nums">{percent}%</span>
      </div>
    </div>
  );
}

function WeekRow({
  week,
  isCurrent,
  isSessionComplete,
}: {
  week: Week;
  isCurrent: boolean;
  isSessionComplete: (week: number, sessionId: string) => boolean;
}) {
  const doneCount = week.sessions.filter((s) => isSessionComplete(week.number, s.id)).length;
  const allDone = doneCount === week.sessions.length;

  return (
    <div
      className={cn(
        "rounded-xl border bg-card/60 p-3",
        isCurrent ? "border-primary/50 ring-1 ring-primary/30" : "border-border/60"
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-display text-sm font-semibold">{week.title}</span>
          {isCurrent && (
            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
              Current
            </span>
          )}
          {allDone && <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))]" />}
        </div>
        <span className="text-[11px] text-muted-foreground">{week.intent}</span>
      </div>
      <div className="grid gap-1.5">
        {week.sessions.map((s) => {
          const done = isSessionComplete(week.number, s.id);
          return (
            <Link
              key={s.id}
              to={`/session/${week.number}/${s.id}`}
              className="group flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted/60"
            >
              {done ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[hsl(var(--success))]" />
              ) : (
                <Circle className="h-5 w-5 shrink-0 text-muted-foreground/50" />
              )}
              <div className="min-w-0 flex-1">
                <div className={cn("truncate text-sm font-medium", done && "text-muted-foreground")}>
                  {s.name}
                </div>
                <div className="truncate text-xs text-muted-foreground">{s.focus}</div>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function SettingsDialog({
  unit,
  setUnit,
  resetAll,
}: {
  unit: "kg" | "lb";
  setUnit: (u: "kg" | "lb") => void;
  resetAll: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Settings">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Preferences for your program.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div>
            <div className="mb-2 text-sm font-medium">Weight unit</div>
            <div className="flex gap-2">
              {(["kg", "lb"] as const).map((u) => (
                <Button
                  key={u}
                  variant={unit === u ? "default" : "secondary"}
                  onClick={() => setUnit(u)}
                  className="flex-1 uppercase"
                >
                  {u}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 text-sm font-medium">Reset progress</div>
            {confirming ? (
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => {
                    resetAll();
                    setConfirming(false);
                  }}
                >
                  Yes, erase everything
                </Button>
                <Button variant="secondary" onClick={() => setConfirming(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button variant="secondary" className="w-full" onClick={() => setConfirming(true)}>
                Reset all progress…
              </Button>
            )}
            <p className="mt-2 text-xs text-muted-foreground">
              Clears every completed session, logged weight, and your streak.
            </p>
          </div>
        </div>

        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}
