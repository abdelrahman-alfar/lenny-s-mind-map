import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Info,
  Timer as TimerIcon,
} from "lucide-react";
import { getWeek, PROGRAM, ProgramBlock, ProgramSet } from "@/data/kettlebell/program";
import { getExercise } from "@/data/kettlebell/exercises";
import { useWorkoutProgress } from "@/hooks/useWorkoutProgress";
import { RestTimer } from "@/components/kettlebell/RestTimer";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function SessionRunner() {
  const { weekId, sessionId } = useParams();
  const navigate = useNavigate();
  const weekNumber = Number(weekId);
  const week = getWeek(weekNumber);
  const session = week?.sessions.find((s) => s.id === sessionId);

  const progress = useWorkoutProgress();
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [cueFor, setCueFor] = useState<string | null>(null);

  const log = session ? progress.getLog(weekNumber, session.id) : undefined;
  const done = session ? progress.isSessionComplete(weekNumber, session.id) : false;

  // Flatten every set into a stable list so we can count/track completion.
  const allSetIds = useMemo(() => {
    if (!session) return [];
    const ids: string[] = [];
    session.blocks.forEach((b, bi) =>
      b.sets.forEach((_, si) => ids.push(`${bi}-${si}`))
    );
    return ids;
  }, [session]);

  if (!week || !session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
        <p className="text-muted-foreground">That workout doesn't exist.</p>
        <Button asChild>
          <Link to="/">Back to program</Link>
        </Button>
      </div>
    );
  }

  const checkedCount = allSetIds.filter((id) => log?.sets?.[id]).length;
  const allChecked = checkedCount === allSetIds.length && allSetIds.length > 0;

  // Sibling navigation across the whole program (prev / next session).
  const flat = PROGRAM.flatMap((w) => w.sessions.map((s) => ({ week: w.number, id: s.id })));
  const idx = flat.findIndex((f) => f.week === weekNumber && f.id === session.id);
  const prev = idx > 0 ? flat[idx - 1] : null;
  const next = idx < flat.length - 1 ? flat[idx + 1] : null;

  const finish = () => {
    progress.finishSession(weekNumber, session.id, new Date().toISOString(), !done);
    if (!done) {
      // Celebrate briefly, then head back to the overview.
      setTimeout(() => navigate("/"), 350);
    }
  };

  return (
    <div className="min-h-screen bg-[image:var(--gradient-hero)] pb-40">
      <div className="mx-auto max-w-2xl px-4">
        {/* Top bar */}
        <header className="sticky top-0 z-10 -mx-4 flex items-center gap-3 bg-background/80 px-4 py-3 backdrop-blur-md">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} aria-label="Back">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <div className="truncate font-display text-base font-semibold">{session.name}</div>
            <div className="text-xs text-muted-foreground">
              {week.title} · {week.phaseName}
            </div>
          </div>
          {done && <CheckCircle2 className="h-6 w-6 text-[hsl(var(--success))]" />}
        </header>

        <p className="mt-3 rounded-xl border border-border bg-card/60 p-3 text-sm text-muted-foreground">
          {session.focus}
        </p>

        {/* Set completion bar */}
        <div className="mt-4 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${(checkedCount / Math.max(1, allSetIds.length)) * 100}%` }}
            />
          </div>
          <span className="text-xs font-medium tabular-nums text-muted-foreground">
            {checkedCount}/{allSetIds.length}
          </span>
        </div>

        {/* Blocks */}
        <div className="mt-6 space-y-6">
          {session.blocks.map((block, bi) => (
            <BlockView
              key={bi}
              block={block}
              blockIndex={bi}
              log={log}
              unit={progress.unit}
              lastWeights={progress.state.lastWeights}
              onToggleSet={(setId) => progress.toggleSet(weekNumber, session.id, setId)}
              onWeight={(exercise, w) =>
                progress.setWeight(weekNumber, session.id, exercise, w)
              }
              onRest={(secs) => setTimerSeconds(secs)}
              onInfo={(exId) => setCueFor(exId)}
            />
          ))}
        </div>

        {/* Prev / next session */}
        <div className="mt-8 flex items-center justify-between gap-3">
          {prev ? (
            <Button variant="secondary" asChild className="flex-1">
              <Link to={`/session/${prev.week}/${prev.id}`}>
                <ChevronLeft className="mr-1 h-4 w-4" /> Previous
              </Link>
            </Button>
          ) : (
            <div className="flex-1" />
          )}
          {next ? (
            <Button variant="secondary" asChild className="flex-1">
              <Link to={`/session/${next.week}/${next.id}`}>
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <div className="flex-1" />
          )}
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto max-w-2xl space-y-3 px-4 py-3">
          {timerSeconds !== null && (
            <RestTimer seconds={timerSeconds} onClose={() => setTimerSeconds(null)} />
          )}
          <motion.div whileTap={{ scale: 0.98 }}>
            <Button
              size="lg"
              onClick={finish}
              className={cn(
                "h-14 w-full text-base font-semibold",
                done
                  ? "bg-[hsl(var(--success))] text-white hover:bg-[hsl(var(--success))]/90"
                  : allChecked
                    ? "animate-pulse-glow"
                    : ""
              )}
            >
              {done ? (
                <>
                  <Check className="mr-2 h-5 w-5" /> Completed — tap to undo
                </>
              ) : (
                "Finish workout"
              )}
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Exercise cue dialog */}
      <Dialog open={cueFor !== null} onOpenChange={(o) => !o && setCueFor(null)}>
        <DialogContent>
          {cueFor && <CueContent exerciseId={cueFor} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function BlockView({
  block,
  blockIndex,
  log,
  unit,
  lastWeights,
  onToggleSet,
  onWeight,
  onRest,
  onInfo,
}: {
  block: ProgramBlock;
  blockIndex: number;
  log: ReturnType<ReturnType<typeof useWorkoutProgress>["getLog"]>;
  unit: "kg" | "lb";
  lastWeights: Record<string, number>;
  onToggleSet: (setId: string) => void;
  onWeight: (exercise: string, weight: number) => void;
  onRest: (secs: number) => void;
  onInfo: (exerciseId: string) => void;
}) {
  return (
    <section>
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="font-display text-sm font-bold uppercase tracking-wider text-primary">
          {block.title}
        </h2>
        {block.format && (
          <span className="text-xs font-medium text-muted-foreground">{block.format}</span>
        )}
      </div>
      <div className="space-y-2.5">
        {block.sets.map((set, si) => (
          <SetRow
            key={si}
            set={set}
            setId={`${blockIndex}-${si}`}
            checked={Boolean(log?.sets?.[`${blockIndex}-${si}`])}
            weight={log?.weights?.[set.exercise] ?? lastWeights[set.exercise]}
            unit={unit}
            onToggle={() => onToggleSet(`${blockIndex}-${si}`)}
            onWeight={(w) => onWeight(set.exercise, w)}
            onRest={set.rest ? () => onRest(set.rest!) : undefined}
            onInfo={() => onInfo(set.exercise)}
          />
        ))}
      </div>
    </section>
  );
}

function SetRow({
  set,
  checked,
  weight,
  unit,
  onToggle,
  onWeight,
  onRest,
  onInfo,
}: {
  set: ProgramSet;
  setId: string;
  checked: boolean;
  weight?: number;
  unit: "kg" | "lb";
  onToggle: () => void;
  onWeight: (weight: number) => void;
  onRest?: () => void;
  onInfo: () => void;
}) {
  const exercise = getExercise(set.exercise);

  return (
    <div
      className={cn(
        "rounded-xl border p-3 transition-colors",
        checked ? "border-[hsl(var(--success))]/40 bg-[hsl(var(--success))]/5" : "border-border bg-card"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Tap-to-complete target */}
        <button
          onClick={onToggle}
          aria-label={checked ? "Mark incomplete" : "Mark complete"}
          className={cn(
            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 transition-colors",
            checked
              ? "border-[hsl(var(--success))] bg-[hsl(var(--success))] text-white"
              : "border-muted-foreground/40 text-transparent hover:border-primary"
          )}
        >
          <Check className="h-5 w-5" strokeWidth={3} />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={cn("font-semibold", checked && "text-muted-foreground line-through")}>
              {exercise.name}
            </span>
            <button
              onClick={onInfo}
              className="text-muted-foreground/70 hover:text-primary"
              aria-label="Form cues"
            >
              <Info className="h-4 w-4" />
            </button>
          </div>
          <div className="text-sm text-primary">{set.prescription}</div>
          {set.note && <div className="mt-0.5 text-xs text-muted-foreground">{set.note}</div>}

          {/* Weight logging + rest timer */}
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            {set.tracksWeight && (
              <WeightInput weight={weight} unit={unit} onChange={onWeight} />
            )}
            {onRest && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onRest}
                className="h-8 gap-1.5 text-xs"
              >
                <TimerIcon className="h-3.5 w-3.5" />
                Rest {set.rest}s
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function WeightInput({
  weight,
  unit,
  onChange,
}: {
  weight?: number;
  unit: "kg" | "lb";
  onChange: (weight: number) => void;
}) {
  const [value, setValue] = useState<string>(weight != null ? String(weight) : "");

  // Keep local input in sync if the remembered weight changes elsewhere.
  const displayed = value !== "" ? value : weight != null ? String(weight) : "";

  const commit = (raw: string) => {
    const n = parseFloat(raw);
    if (!Number.isNaN(n) && n >= 0) onChange(n);
  };

  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-2 py-1">
      <input
        type="number"
        inputMode="decimal"
        placeholder="—"
        value={displayed}
        onChange={(e) => {
          setValue(e.target.value);
          commit(e.target.value);
        }}
        className="w-14 bg-transparent text-sm font-semibold outline-none placeholder:text-muted-foreground/50"
      />
      <span className="text-xs font-medium text-muted-foreground">{unit}</span>
    </div>
  );
}

function CueContent({ exerciseId }: { exerciseId: string }) {
  const ex = getExercise(exerciseId);
  return (
    <>
      <DialogHeader>
        <DialogTitle>{ex.name}</DialogTitle>
      </DialogHeader>
      <p className="text-sm text-muted-foreground">{ex.summary}</p>
      <div className="mt-2 space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wide text-primary">Form cues</div>
        <ul className="space-y-2">
          {ex.cues.map((cue, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>{cue}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
