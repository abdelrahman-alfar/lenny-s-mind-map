import { useEffect, useRef, useState, useCallback } from "react";
import { Pause, Play, RotateCcw, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RestTimerProps {
  seconds: number;
  onClose: () => void;
}

function beep() {
  // A short tone so you know rest is over without staring at the screen.
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
    osc.onended = () => ctx.close();
  } catch {
    // Audio blocked — the visual state is enough.
  }
}

/**
 * A full-width rest countdown that docks above the bottom action bar.
 * Big, legible digits and tap targets sized for sweaty gym hands.
 */
export function RestTimer({ seconds, onClose }: RestTimerProps) {
  const [total, setTotal] = useState(seconds);
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(true);
  const doneRef = useRef(false);

  // Reset whenever a new rest duration is requested.
  useEffect(() => {
    setTotal(seconds);
    setRemaining(seconds);
    setRunning(true);
    doneRef.current = false;
  }, [seconds]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          if (!doneRef.current) {
            doneRef.current = true;
            beep();
            if (navigator.vibrate) navigator.vibrate([200, 80, 200]);
          }
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const addTime = useCallback((delta: number) => {
    doneRef.current = false;
    setTotal((t) => t + delta);
    setRemaining((r) => Math.max(0, r + delta));
    setRunning(true);
  }, []);

  const reset = useCallback(() => {
    doneRef.current = false;
    setRemaining(total);
    setRunning(true);
  }, [total]);

  const mm = Math.floor(remaining / 60);
  const ss = remaining % 60;
  const pct = total > 0 ? (remaining / total) * 100 : 0;
  const done = remaining === 0;

  return (
    <div
      className={cn(
        "rounded-2xl border p-4 shadow-lg transition-colors",
        done
          ? "border-[hsl(var(--success))]/60 bg-[hsl(var(--success))]/10"
          : "border-primary/40 bg-card"
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <span
          className={cn(
            "text-xs font-semibold uppercase tracking-wider",
            done ? "text-[hsl(var(--success))]" : "text-primary"
          )}
        >
          {done ? "Rest done — go!" : "Rest"}
        </span>
        <button
          onClick={onClose}
          className="rounded-md p-1 text-muted-foreground hover:text-foreground"
          aria-label="Close timer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div
          className={cn(
            "font-display text-5xl font-bold tabular-nums",
            done && "text-[hsl(var(--success))]"
          )}
        >
          {mm}:{ss.toString().padStart(2, "0")}
        </div>
        <div className="flex-1">
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-1000 ease-linear",
                done ? "bg-[hsl(var(--success))]" : "bg-primary"
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        <Button variant="secondary" size="lg" onClick={() => addTime(15)} className="font-semibold">
          <Plus className="mr-1 h-4 w-4" />
          15s
        </Button>
        <Button variant="secondary" size="lg" onClick={reset} aria-label="Restart">
          <RotateCcw className="h-5 w-5" />
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => setRunning((r) => !r)}
          aria-label={running ? "Pause" : "Resume"}
        >
          {running ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </Button>
        <Button size="lg" onClick={onClose} className="font-semibold">
          Done
        </Button>
      </div>
    </div>
  );
}
