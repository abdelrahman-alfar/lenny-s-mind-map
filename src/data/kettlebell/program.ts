// A 3-month (12-week) kettlebell program built around three phases.
// Every phase has 3 sessions/week. Volume progresses week-to-week inside the
// phase, then resets and steps up in intensity at the next phase.
//
// The program is authored as phase templates; the concrete 12 weeks are
// generated from them so the progression stays consistent and easy to tweak.

export interface ProgramSet {
  /** Exercise id from the exercise library. */
  exercise: string;
  /** How the movement is prescribed for this week, e.g. "3 × 10 / side". */
  prescription: string;
  /** Optional note shown under the prescription. */
  note?: string;
  /** Suggested rest in seconds after each set (drives the built-in timer). */
  rest?: number;
  /** Tracks a load (weight) input when true. Bodyweight / mobility = false. */
  tracksWeight?: boolean;
}

export interface ProgramBlock {
  /** e.g. "Warm-up", "Strength", "Conditioning", "Finisher". */
  title: string;
  /** Optional format hint, e.g. "EMOM 10 min" or "3 rounds". */
  format?: string;
  sets: ProgramSet[];
}

export interface Session {
  id: string; // stable within a week, e.g. "d1"
  name: string;
  focus: string;
  blocks: ProgramBlock[];
}

export interface Week {
  number: number; // 1-12
  phaseId: string;
  phaseName: string;
  phaseWeek: number; // 1-4 within the phase
  title: string;
  intent: string;
  sessions: Session[];
}

export interface Phase {
  id: string;
  name: string;
  weeks: number[]; // global week numbers
  color: string; // tailwind-ish accent token used in UI
  summary: string;
}

// --- Progression helpers -----------------------------------------------------
// Given a phase week (1-4), return sets/reps that ramp then slightly back off
// on the last week (a light deload before stepping up intensity).

const ramp = (base: number[]) => (phaseWeek: number) => base[phaseWeek - 1];

// Rounds per phase-week for the main circuits.
const rounds = ramp([3, 4, 5, 3]);
// Rep targets that climb across the phase.
const swingReps = ramp([15, 20, 25, 15]);

// --- Phase 1: Foundation -----------------------------------------------------

function foundationSessions(pw: number): Session[] {
  return [
    {
      id: "d1",
      name: "Day 1 — Hinge & Squat",
      focus: "Groove the swing and goblet squat, build a base.",
      blocks: [
        {
          title: "Warm-up",
          format: "2 rounds",
          sets: [
            { exercise: "halo", prescription: "5 / direction" },
            { exercise: "gobletSquat", prescription: "8 slow reps", note: "Light bell, own the bottom position" },
            { exercise: "deadBug", prescription: "6 / side" },
          ],
        },
        {
          title: "Strength",
          format: `${rounds(pw)} rounds`,
          sets: [
            { exercise: "swing", prescription: `${rounds(pw)} × ${swingReps(pw)}`, rest: 75, tracksWeight: true },
            { exercise: "gobletSquat", prescription: `${rounds(pw)} × 10`, rest: 75, tracksWeight: true },
            { exercise: "bentRow", prescription: `${rounds(pw)} × 10 / side`, rest: 60, tracksWeight: true },
          ],
        },
        {
          title: "Core finisher",
          format: "2 rounds",
          sets: [
            { exercise: "plank", prescription: "30–45 sec hold" },
            { exercise: "pushUp", prescription: "8–12 reps" },
          ],
        },
      ],
    },
    {
      id: "d2",
      name: "Day 2 — Press & Get-Up",
      focus: "Overhead control and the Turkish get-up.",
      blocks: [
        {
          title: "Warm-up",
          format: "2 rounds",
          sets: [
            { exercise: "halo", prescription: "5 / direction" },
            { exercise: "turkishGetUp", prescription: "2 / side", note: "Light, focus on each step" },
          ],
        },
        {
          title: "Strength",
          format: `${rounds(pw)} rounds`,
          sets: [
            { exercise: "cleanPress", prescription: `${rounds(pw)} × 6 / side`, rest: 75, tracksWeight: true },
            { exercise: "reverseLunge", prescription: `${rounds(pw)} × 8 / side`, rest: 75, tracksWeight: true },
            { exercise: "strictPress", prescription: `${rounds(pw)} × 8 / side`, rest: 60, tracksWeight: true },
          ],
        },
        {
          title: "Core finisher",
          format: "2 rounds",
          sets: [
            { exercise: "plank", prescription: "40 sec hold" },
            { exercise: "deadBug", prescription: "8 / side" },
          ],
        },
      ],
    },
    {
      id: "d3",
      name: "Day 3 — Conditioning",
      focus: "Keep the heart rate up with light, clean reps.",
      blocks: [
        {
          title: "Warm-up",
          format: "2 rounds",
          sets: [
            { exercise: "halo", prescription: "5 / direction" },
            { exercise: "sumoDeadlift", prescription: "8 reps", note: "Light, prime the hinge" },
          ],
        },
        {
          title: "Conditioning",
          format: `${rounds(pw)} rounds, minimal rest`,
          sets: [
            { exercise: "swing", prescription: `${rounds(pw)} × 20`, rest: 45, tracksWeight: true },
            { exercise: "sumoDeadlift", prescription: `${rounds(pw)} × 10`, rest: 45, tracksWeight: true },
            { exercise: "russianTwist", prescription: `${rounds(pw)} × 20 total`, rest: 45, tracksWeight: true },
          ],
        },
        {
          title: "Carry finisher",
          sets: [
            { exercise: "farmerCarry", prescription: "3 × 30 sec walk", rest: 45, tracksWeight: true },
          ],
        },
      ],
    },
  ];
}

// --- Phase 2: Strength & Power ----------------------------------------------

function strengthSessions(pw: number): Session[] {
  const r = ramp([4, 5, 6, 4])(pw);
  return [
    {
      id: "d1",
      name: "Day 1 — Heavy Hinge",
      focus: "Powerful swings and front squats, heavier bells.",
      blocks: [
        {
          title: "Warm-up",
          format: "2 rounds",
          sets: [
            { exercise: "halo", prescription: "5 / direction" },
            { exercise: "windmill", prescription: "4 / side", note: "Light, open the hips" },
            { exercise: "goblet_march", prescription: "20 steps" },
          ],
        },
        {
          title: "Power",
          format: "EMOM 10 min",
          sets: [
            { exercise: "swing", prescription: "10 heavy swings / min", note: "Every minute on the minute for 10 min", rest: 0, tracksWeight: true },
          ],
        },
        {
          title: "Strength",
          format: `${r} rounds`,
          sets: [
            { exercise: "frontSquat", prescription: `${r} × 8`, rest: 90, tracksWeight: true },
            { exercise: "bentRow", prescription: `${r} × 8 / side`, rest: 75, tracksWeight: true },
            { exercise: "pushPress", prescription: `${r} × 6 / side`, rest: 75, tracksWeight: true },
          ],
        },
      ],
    },
    {
      id: "d2",
      name: "Day 2 — Press & Pull",
      focus: "Clean & press strength, single-leg work.",
      blocks: [
        {
          title: "Warm-up",
          format: "2 rounds",
          sets: [
            { exercise: "halo", prescription: "5 / direction" },
            { exercise: "turkishGetUp", prescription: "2 / side" },
          ],
        },
        {
          title: "Strength",
          format: `${r} rounds`,
          sets: [
            { exercise: "cleanPress", prescription: `${r} × 5 / side`, rest: 90, tracksWeight: true },
            { exercise: "singleLegDeadlift", prescription: `${r} × 8 / side`, rest: 75, tracksWeight: true },
            { exercise: "renegadeRow", prescription: `${r} × 6 / side`, rest: 75, tracksWeight: true },
          ],
        },
        {
          title: "Finisher",
          sets: [
            { exercise: "rackedCarry", prescription: "3 × 40 sec / side", rest: 60, tracksWeight: true },
          ],
        },
      ],
    },
    {
      id: "d3",
      name: "Day 3 — Power Complex",
      focus: "Flow through a swing-clean-press complex.",
      blocks: [
        {
          title: "Warm-up",
          format: "2 rounds",
          sets: [
            { exercise: "halo", prescription: "5 / direction" },
            { exercise: "gobletSquat", prescription: "8 slow reps" },
          ],
        },
        {
          title: "Complex",
          format: `${r} rounds / side`,
          sets: [
            { exercise: "oneArmSwing", prescription: "5 swings", note: "Flow straight into the clean & press", rest: 0, tracksWeight: true },
            { exercise: "cleanPress", prescription: "5 clean & press", note: "Same side, no rest", rest: 90, tracksWeight: true },
          ],
        },
        {
          title: "Conditioning",
          format: "3 rounds",
          sets: [
            { exercise: "swing", prescription: "3 × 20", rest: 45, tracksWeight: true },
            { exercise: "russianTwist", prescription: "3 × 24 total", rest: 45, tracksWeight: true },
          ],
        },
      ],
    },
  ];
}

// --- Phase 3: Conditioning & Peak -------------------------------------------

function peakSessions(pw: number, weekNumber: number): Session[] {
  const isTestWeek = weekNumber === 12;
  const r = ramp([5, 6, 7, 5])(pw);

  if (isTestWeek) {
    return [
      {
        id: "d1",
        name: "Day 1 — Snatch Test",
        focus: "The classic: 100 snatches. Beat the clock.",
        blocks: [
          {
            title: "Warm-up",
            format: "2 rounds",
            sets: [
              { exercise: "halo", prescription: "5 / direction" },
              { exercise: "swing", prescription: "10 reps", note: "Build to working weight" },
            ],
          },
          {
            title: "The Test",
            format: "For time",
            sets: [
              { exercise: "snatch", prescription: "100 snatches", note: "Switch hands as needed. Record your time!", rest: 0, tracksWeight: true },
            ],
          },
          {
            title: "Cooldown",
            sets: [
              { exercise: "windmill", prescription: "5 / side, slow" },
            ],
          },
        ],
      },
      {
        id: "d2",
        name: "Day 2 — Strength Test",
        focus: "Find your best clean & press and get-up loads.",
        blocks: [
          {
            title: "Warm-up",
            format: "2 rounds",
            sets: [
              { exercise: "halo", prescription: "5 / direction" },
              { exercise: "cleanPress", prescription: "5 / side, building" },
            ],
          },
          {
            title: "Max effort",
            sets: [
              { exercise: "cleanPress", prescription: "Work up to a heavy 3 / side", note: "Log your best bell", rest: 120, tracksWeight: true },
              { exercise: "turkishGetUp", prescription: "Work up to a heavy 1 / side", note: "Log your best bell", rest: 120, tracksWeight: true },
              { exercise: "frontSquat", prescription: "Heavy 5", rest: 120, tracksWeight: true },
            ],
          },
        ],
      },
      {
        id: "d3",
        name: "Day 3 — Max Swings",
        focus: "Finish the program with a swing challenge.",
        blocks: [
          {
            title: "Warm-up",
            format: "2 rounds",
            sets: [
              { exercise: "halo", prescription: "5 / direction" },
              { exercise: "gobletSquat", prescription: "8 slow reps" },
            ],
          },
          {
            title: "The Challenge",
            format: "10 min",
            sets: [
              { exercise: "swing", prescription: "Max swings in 10 min", note: "Rest as needed. Log total reps!", rest: 0, tracksWeight: true },
            ],
          },
          {
            title: "Victory carry",
            sets: [
              { exercise: "farmerCarry", prescription: "3 × 40 sec, heavy", rest: 60, tracksWeight: true },
            ],
          },
        ],
      },
    ];
  }

  return [
    {
      id: "d1",
      name: "Day 1 — Density",
      focus: "More work in less time — EMOM snatches and squats.",
      blocks: [
        {
          title: "Warm-up",
          format: "2 rounds",
          sets: [
            { exercise: "halo", prescription: "5 / direction" },
            { exercise: "windmill", prescription: "4 / side" },
          ],
        },
        {
          title: "Density",
          format: "EMOM 12 min",
          sets: [
            { exercise: "snatch", prescription: "5 / side, alternating min", note: "Odd min left, even min right", rest: 0, tracksWeight: true },
          ],
        },
        {
          title: "Strength",
          format: `${r} rounds`,
          sets: [
            { exercise: "frontSquat", prescription: `${r} × 6`, rest: 90, tracksWeight: true },
            { exercise: "renegadeRow", prescription: `${r} × 8 / side`, rest: 75, tracksWeight: true },
          ],
        },
      ],
    },
    {
      id: "d2",
      name: "Day 2 — Long Cycle",
      focus: "Clean & press endurance plus heavy get-ups.",
      blocks: [
        {
          title: "Warm-up",
          format: "2 rounds",
          sets: [
            { exercise: "halo", prescription: "5 / direction" },
            { exercise: "turkishGetUp", prescription: "2 / side" },
          ],
        },
        {
          title: "Long cycle",
          format: `${r} rounds / side`,
          sets: [
            { exercise: "cleanPress", prescription: "8 clean & press", note: "Unbroken if you can", rest: 90, tracksWeight: true },
          ],
        },
        {
          title: "Strength",
          format: `${r} rounds`,
          sets: [
            { exercise: "turkishGetUp", prescription: `${Math.max(3, r - 2)} × 1 / side, heavy`, rest: 90, tracksWeight: true },
            { exercise: "singleLegDeadlift", prescription: `${r} × 8 / side`, rest: 75, tracksWeight: true },
          ],
        },
      ],
    },
    {
      id: "d3",
      name: "Day 3 — Flow & Burn",
      focus: "A flowing complex ladder to finish the week.",
      blocks: [
        {
          title: "Warm-up",
          format: "2 rounds",
          sets: [
            { exercise: "halo", prescription: "5 / direction" },
            { exercise: "gobletSquat", prescription: "8 slow reps" },
          ],
        },
        {
          title: "Complex ladder",
          format: "Ladder: 5-4-3-2-1 / side",
          sets: [
            { exercise: "oneArmSwing", prescription: "Swing → Clean → Press → Squat", note: "1 rep of each = 1 round, ladder down 5→1", rest: 60, tracksWeight: true },
          ],
        },
        {
          title: "Finisher",
          format: `${r} rounds`,
          sets: [
            { exercise: "swing", prescription: `${r} × 20`, rest: 40, tracksWeight: true },
            { exercise: "pushUp", prescription: `${r} × 12`, rest: 40 },
          ],
        },
      ],
    },
  ];
}

// --- Phase definitions -------------------------------------------------------

export const PHASES: Phase[] = [
  {
    id: "foundation",
    name: "Foundation",
    weeks: [1, 2, 3, 4],
    color: "emerald",
    summary: "Master the fundamentals and build work capacity with lighter bells.",
  },
  {
    id: "strength",
    name: "Strength & Power",
    weeks: [5, 6, 7, 8],
    color: "amber",
    summary: "Heavier loads, ballistic power, and kettlebell complexes.",
  },
  {
    id: "peak",
    name: "Conditioning & Peak",
    weeks: [9, 10, 11, 12],
    color: "rose",
    summary: "Density work, flows, and a final test week to measure your gains.",
  },
];

const PHASE_INTENTS: Record<number, string> = {
  1: "Learn the movements. Keep it crisp and light.",
  2: "Add volume. Same movements, a little more.",
  3: "Peak volume for the phase — the hardest week.",
  4: "Slight back-off to recover before stepping up.",
};

function buildWeek(weekNumber: number): Week {
  const phase = PHASES.find((p) => p.weeks.includes(weekNumber))!;
  const phaseWeek = phase.weeks.indexOf(weekNumber) + 1;

  let sessions: Session[];
  if (phase.id === "foundation") sessions = foundationSessions(phaseWeek);
  else if (phase.id === "strength") sessions = strengthSessions(phaseWeek);
  else sessions = peakSessions(phaseWeek, weekNumber);

  const isTestWeek = weekNumber === 12;

  return {
    number: weekNumber,
    phaseId: phase.id,
    phaseName: phase.name,
    phaseWeek,
    title: `Week ${weekNumber}`,
    intent: isTestWeek ? "Test week! Measure everything you've built." : PHASE_INTENTS[phaseWeek],
    sessions,
  };
}

export const PROGRAM: Week[] = Array.from({ length: 12 }, (_, i) => buildWeek(i + 1));

export const TOTAL_SESSIONS = PROGRAM.reduce((n, w) => n + w.sessions.length, 0);

export function getWeek(n: number): Week | undefined {
  return PROGRAM.find((w) => w.number === n);
}

/** Stable id for a single session, used as the localStorage key. */
export function sessionKey(weekNumber: number, sessionId: string): string {
  return `w${weekNumber}-${sessionId}`;
}
