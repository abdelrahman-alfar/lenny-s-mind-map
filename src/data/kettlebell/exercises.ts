// Kettlebell exercise library.
// Each movement carries the coaching cues that matter when you're mid-session
// and want a quick reminder without leaving the app.

export type ExerciseCategory =
  | "ballistic"
  | "grind"
  | "carry"
  | "core"
  | "mobility";

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  /** Short, gym-glanceable description of the movement. */
  summary: string;
  /** 2-4 form cues, ordered by importance. */
  cues: string[];
  /** Whether it is typically loaded with one or two bells. */
  load: "single" | "double" | "either" | "bodyweight";
}

export const EXERCISES: Record<string, Exercise> = {
  swing: {
    id: "swing",
    name: "Two-Hand Swing",
    category: "ballistic",
    summary: "Explosive hip hinge that floats the bell to chest height.",
    cues: [
      "Hike the bell back like a football snap",
      "Snap the hips — don't lift with the arms",
      "Glutes and abs hard at the top, bell floats to chest height",
    ],
    load: "single",
  },
  oneArmSwing: {
    id: "oneArmSwing",
    name: "One-Arm Swing",
    category: "ballistic",
    summary: "Single-arm swing that fires the anti-rotation core.",
    cues: [
      "Resist the bell twisting you — stay square",
      "Same hip snap as the two-hand version",
      "Shoulder packed down, don't shrug",
    ],
    load: "single",
  },
  gobletSquat: {
    id: "gobletSquat",
    name: "Goblet Squat",
    category: "grind",
    summary: "Front-loaded squat holding the bell at the chest.",
    cues: [
      "Elbows inside the knees at the bottom",
      "Chest tall, sit straight down",
      "Drive the floor away, brace the whole way up",
    ],
    load: "single",
  },
  frontSquat: {
    id: "frontSquat",
    name: "Racked Front Squat",
    category: "grind",
    summary: "Squat with the bell(s) racked in the front-rack position.",
    cues: [
      "Bell rests on the forearm, wrist straight",
      "Ribs down, brace before you descend",
      "Full depth, stand tall and squeeze at the top",
    ],
    load: "either",
  },
  cleanPress: {
    id: "cleanPress",
    name: "Clean & Press",
    category: "grind",
    summary: "Clean the bell to the rack, then press overhead.",
    cues: [
      "Clean = a vertical swing that lands soft in the rack",
      "No banging the wrist — tame the arc close to the body",
      "Press with a straight line, biceps by the ear at lockout",
    ],
    load: "either",
  },
  strictPress: {
    id: "strictPress",
    name: "Strict Press",
    category: "grind",
    summary: "Overhead press from the rack with no leg drive.",
    cues: [
      "Squeeze the glutes and abs, no back lean",
      "Push your head 'through the window' at lockout",
      "Control the bell back to the rack",
    ],
    load: "either",
  },
  pushPress: {
    id: "pushPress",
    name: "Push Press",
    category: "ballistic",
    summary: "Overhead press driven by a short dip of the legs.",
    cues: [
      "Quick dip, explosive drive through the heels",
      "Catch it locked out overhead, then lower under control",
      "Dip is shallow — knees, not hips",
    ],
    load: "either",
  },
  snatch: {
    id: "snatch",
    name: "Snatch",
    category: "ballistic",
    summary: "One motion from the hike to locked out overhead.",
    cues: [
      "High-pull the bell, then punch the hand around it",
      "Bell settles softly overhead — no flopping onto the wrist",
      "Guide it down into the next swing",
    ],
    load: "single",
  },
  turkishGetUp: {
    id: "turkishGetUp",
    name: "Turkish Get-Up",
    category: "grind",
    summary: "Stand up and lie back down while a bell stays locked overhead.",
    cues: [
      "Eyes on the bell the whole way up",
      "Move slow: roll, post, bridge, sweep, lunge, stand",
      "Wrist stacked over elbow over shoulder at all times",
    ],
    load: "single",
  },
  bentRow: {
    id: "bentRow",
    name: "Bent-Over Row",
    category: "grind",
    summary: "Hip-hinged single-arm row to build the back.",
    cues: [
      "Flat back, hinge to about parallel",
      "Row to the hip, drive the elbow back",
      "Pause and squeeze the shoulder blade",
    ],
    load: "single",
  },
  renegadeRow: {
    id: "renegadeRow",
    name: "Renegade Row",
    category: "core",
    summary: "Plank on the bells, rowing one at a time.",
    cues: [
      "Feet wide for a stable base",
      "Don't let the hips rotate — anti-rotation is the point",
      "Row one bell while the other presses into the floor",
    ],
    load: "double",
  },
  reverseLunge: {
    id: "reverseLunge",
    name: "Racked Reverse Lunge",
    category: "grind",
    summary: "Step back into a lunge with the bell racked.",
    cues: [
      "Step back, drop the back knee straight down",
      "Stay tall, front shin vertical",
      "Drive through the front heel to stand",
    ],
    load: "single",
  },
  windmill: {
    id: "windmill",
    name: "Windmill",
    category: "mobility",
    summary: "Overhead-loaded hip hinge for shoulder and hip mobility.",
    cues: [
      "Bell locked overhead, eyes on it",
      "Push the hip out, hinge sideways down the front leg",
      "Keep both knees straight, move slow",
    ],
    load: "single",
  },
  halo: {
    id: "halo",
    name: "Halo",
    category: "mobility",
    summary: "Circle the bell around the head to open the shoulders.",
    cues: [
      "Move the bell tight around the skull",
      "Ribs down, don't let the low back arch",
      "Slow and controlled, both directions",
    ],
    load: "single",
  },
  sumoDeadlift: {
    id: "sumoDeadlift",
    name: "Sumo Deadlift",
    category: "grind",
    summary: "Wide-stance deadlift with the bell between the feet.",
    cues: [
      "Wide stance, bell centered between the heels",
      "Push the floor away, hips and chest rise together",
      "Lock out with glutes, don't hyperextend",
    ],
    load: "single",
  },
  singleLegDeadlift: {
    id: "singleLegDeadlift",
    name: "Single-Leg Deadlift",
    category: "grind",
    summary: "One-legged hinge for balance and hamstring strength.",
    cues: [
      "Hinge at the hip, free leg extends straight back",
      "Keep hips level — don't open up",
      "Slow down, control the balance",
    ],
    load: "single",
  },
  farmerCarry: {
    id: "farmerCarry",
    name: "Farmer Carry",
    category: "carry",
    summary: "Walk with heavy bells at your sides.",
    cues: [
      "Stand tall, shoulders packed and down",
      "Brace the core, walk with quiet steps",
      "Crush the handles, don't lean",
    ],
    load: "either",
  },
  rackedCarry: {
    id: "rackedCarry",
    name: "Racked Carry",
    category: "carry",
    summary: "Walk with the bell(s) in the front-rack position.",
    cues: [
      "Ribs down, resist leaning back",
      "Breathe behind the brace",
      "Even, controlled steps",
    ],
    load: "either",
  },
  goblet_march: {
    id: "goblet_march",
    name: "Goblet March",
    category: "core",
    summary: "March in place holding the bell at the chest.",
    cues: [
      "Drive the knee to hip height",
      "Stay tall, brace hard each step",
      "Controlled tempo, no rushing",
    ],
    load: "single",
  },
  plank: {
    id: "plank",
    name: "Plank",
    category: "core",
    summary: "Hold a rigid front-support position.",
    cues: [
      "Straight line ear-to-heel",
      "Squeeze glutes and abs, tuck the ribs",
      "Breathe steadily, don't sag",
    ],
    load: "bodyweight",
  },
  deadBug: {
    id: "deadBug",
    name: "Dead Bug",
    category: "core",
    summary: "Anti-extension core drill on your back.",
    cues: [
      "Low back stays flat on the floor",
      "Extend opposite arm and leg slowly",
      "Exhale as you reach, move with control",
    ],
    load: "bodyweight",
  },
  russianTwist: {
    id: "russianTwist",
    name: "Russian Twist",
    category: "core",
    summary: "Seated rotational core work with the bell.",
    cues: [
      "Lean back to a strong brace",
      "Rotate from the trunk, not just the arms",
      "Tap each side under control",
    ],
    load: "single",
  },
  pushUp: {
    id: "pushUp",
    name: "Push-Up",
    category: "core",
    summary: "Bodyweight horizontal press.",
    cues: [
      "Body in one rigid line",
      "Elbows ~45°, not flared wide",
      "Full range — chest to just off the floor",
    ],
    load: "bodyweight",
  },
};

export function getExercise(id: string): Exercise {
  const ex = EXERCISES[id];
  if (!ex) throw new Error(`Unknown exercise: ${id}`);
  return ex;
}
