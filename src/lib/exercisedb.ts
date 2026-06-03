export interface Exercise {
  id: string
  name: string
  bodyPart: string
  target: string
  equipment: string
  gifUrl?: string
  instructions: string[]
  secondaryMuscles: string[]
  description?: string
}

const EXERCISES: Exercise[] = [
  // ── CHEST ──────────────────────────────────────────────────────────────────
  {
    id: "1", name: "Barbell Bench Press", bodyPart: "chest", target: "pectorals",
    equipment: "barbell",
    instructions: ["Lie flat on bench, grip bar slightly wider than shoulder-width.", "Unrack and lower bar to mid-chest with control.", "Press bar back up to full arm extension.", "Repeat for desired reps."],
    secondaryMuscles: ["triceps", "front delts"],
  },
  {
    id: "2", name: "Incline Dumbbell Press", bodyPart: "chest", target: "upper pectorals",
    equipment: "dumbbell",
    instructions: ["Set bench to 30–45° incline.", "Hold dumbbells at shoulder height, palms facing forward.", "Press dumbbells up until arms are extended.", "Lower with control and repeat."],
    secondaryMuscles: ["triceps", "front delts"],
  },
  {
    id: "3", name: "Cable Chest Fly", bodyPart: "chest", target: "pectorals",
    equipment: "cable",
    instructions: ["Set cable pulleys to shoulder height on both sides.", "Stand in the middle, grab handles, slight forward lean.", "Bring hands together in an arc motion in front of chest.", "Slowly return to start position."],
    secondaryMuscles: ["front delts"],
  },
  {
    id: "4", name: "Push-Up", bodyPart: "chest", target: "pectorals",
    equipment: "body weight",
    instructions: ["Start in high plank with hands slightly wider than shoulders.", "Lower chest to the floor keeping body straight.", "Push back up to starting position.", "Keep core tight throughout."],
    secondaryMuscles: ["triceps", "front delts", "core"],
  },
  {
    id: "5", name: "Dumbbell Pullover", bodyPart: "chest", target: "pectorals",
    equipment: "dumbbell",
    instructions: ["Lie across a bench with upper back supported.", "Hold one dumbbell with both hands above chest.", "Lower dumbbell behind head in an arc keeping elbows slightly bent.", "Pull back over chest and repeat."],
    secondaryMuscles: ["lats", "triceps"],
  },
  {
    id: "6", name: "Decline Bench Press", bodyPart: "chest", target: "lower pectorals",
    equipment: "barbell",
    instructions: ["Lie on a decline bench, feet secured.", "Grip bar wider than shoulder-width.", "Lower bar to lower chest with control.", "Press back up and repeat."],
    secondaryMuscles: ["triceps", "front delts"],
  },

  // ── BACK ───────────────────────────────────────────────────────────────────
  {
    id: "7", name: "Barbell Deadlift", bodyPart: "back", target: "erector spinae",
    equipment: "barbell",
    instructions: ["Stand with feet hip-width, bar over midfoot.", "Hinge at hips and grip bar just outside legs.", "Drive feet into floor and pull bar up keeping back straight.", "Lock out at top then lower with control."],
    secondaryMuscles: ["glutes", "hamstrings", "traps", "lats"],
  },
  {
    id: "8", name: "Pull-Up", bodyPart: "back", target: "lats",
    equipment: "body weight",
    instructions: ["Hang from bar with overhand grip slightly wider than shoulders.", "Pull yourself up until chin clears the bar.", "Lower back down with control.", "Avoid swinging."],
    secondaryMuscles: ["biceps", "rear delts", "rhomboids"],
  },
  {
    id: "9", name: "Barbell Bent-Over Row", bodyPart: "back", target: "rhomboids",
    equipment: "barbell",
    instructions: ["Hinge forward at hips, back straight, knees slightly bent.", "Grip bar with overhand grip.", "Pull bar to lower ribs leading with elbows.", "Lower and repeat."],
    secondaryMuscles: ["lats", "biceps", "rear delts"],
  },
  {
    id: "10", name: "Lat Pulldown", bodyPart: "back", target: "lats",
    equipment: "cable",
    instructions: ["Sit at lat pulldown machine, thighs under pad.", "Grip bar wider than shoulder-width.", "Pull bar to upper chest keeping chest tall.", "Slowly return bar to start."],
    secondaryMuscles: ["biceps", "rhomboids", "rear delts"],
  },
  {
    id: "11", name: "Seated Cable Row", bodyPart: "back", target: "rhomboids",
    equipment: "cable",
    instructions: ["Sit at cable row machine, feet on platform.", "Grip handle and pull to lower abdomen.", "Squeeze shoulder blades together at peak.", "Slowly extend arms back out."],
    secondaryMuscles: ["lats", "biceps", "erector spinae"],
  },
  {
    id: "12", name: "Dumbbell Single-Arm Row", bodyPart: "back", target: "lats",
    equipment: "dumbbell",
    instructions: ["Place one hand and knee on bench.", "Hold dumbbell in opposite hand.", "Row dumbbell to hip leading with elbow.", "Lower and repeat, then switch sides."],
    secondaryMuscles: ["rhomboids", "biceps", "rear delts"],
  },
  {
    id: "13", name: "Face Pull", bodyPart: "back", target: "rear delts",
    equipment: "cable",
    instructions: ["Set cable to head height with rope attachment.", "Pull rope to face with elbows high and wide.", "External rotate at the end of the movement.", "Slowly return to start."],
    secondaryMuscles: ["rhomboids", "traps"],
  },
  {
    id: "14", name: "T-Bar Row", bodyPart: "back", target: "rhomboids",
    equipment: "barbell",
    instructions: ["Straddle the barbell, hinge forward with flat back.", "Grip the handles close to the loaded end.", "Pull bar to chest keeping elbows close.", "Lower and repeat."],
    secondaryMuscles: ["lats", "biceps", "rear delts"],
  },

  // ── LEGS ───────────────────────────────────────────────────────────────────
  {
    id: "15", name: "Barbell Back Squat", bodyPart: "legs", target: "quadriceps",
    equipment: "barbell",
    instructions: ["Bar on upper traps, feet shoulder-width apart.", "Sit back and down keeping chest up and knees tracking toes.", "Descend until thighs are parallel to floor.", "Drive through heels to stand."],
    secondaryMuscles: ["glutes", "hamstrings", "core"],
  },
  {
    id: "16", name: "Romanian Deadlift", bodyPart: "legs", target: "hamstrings",
    equipment: "barbell",
    instructions: ["Hold bar at hip level, feet hip-width apart.", "Hinge at hips pushing them back, lowering bar down legs.", "Keep back flat and feel stretch in hamstrings.", "Drive hips forward to return to standing."],
    secondaryMuscles: ["glutes", "erector spinae"],
  },
  {
    id: "17", name: "Leg Press", bodyPart: "legs", target: "quadriceps",
    equipment: "machine",
    instructions: ["Sit in leg press machine, feet hip-width on platform.", "Release safeties and lower platform toward chest.", "Press back up without locking knees.", "Repeat for desired reps."],
    secondaryMuscles: ["glutes", "hamstrings"],
  },
  {
    id: "18", name: "Leg Curl", bodyPart: "legs", target: "hamstrings",
    equipment: "machine",
    instructions: ["Lie face down on leg curl machine.", "Place pad just above heels.", "Curl legs toward glutes as far as possible.", "Lower slowly and repeat."],
    secondaryMuscles: ["calves"],
  },
  {
    id: "19", name: "Leg Extension", bodyPart: "legs", target: "quadriceps",
    equipment: "machine",
    instructions: ["Sit in leg extension machine with pad on shins.", "Extend legs until fully straight.", "Hold briefly then lower with control.", "Repeat."],
    secondaryMuscles: [],
  },
  {
    id: "20", name: "Dumbbell Lunge", bodyPart: "legs", target: "quadriceps",
    equipment: "dumbbell",
    instructions: ["Stand holding dumbbells at sides.", "Step forward and lower back knee toward floor.", "Front thigh should be parallel to ground.", "Push through front foot to return, then alternate legs."],
    secondaryMuscles: ["glutes", "hamstrings", "core"],
  },
  {
    id: "21", name: "Bulgarian Split Squat", bodyPart: "legs", target: "quadriceps",
    equipment: "dumbbell",
    instructions: ["Stand in front of a bench, holding dumbbells.", "Place rear foot on bench behind you.", "Lower front knee until rear knee nearly touches floor.", "Drive through front heel to stand."],
    secondaryMuscles: ["glutes", "hamstrings"],
  },
  {
    id: "22", name: "Hip Thrust", bodyPart: "legs", target: "glutes",
    equipment: "barbell",
    instructions: ["Sit with upper back against bench, bar across hips.", "Plant feet hip-width, drive hips up toward ceiling.", "Squeeze glutes at the top.", "Lower slowly and repeat."],
    secondaryMuscles: ["hamstrings", "core"],
  },
  {
    id: "23", name: "Calf Raise", bodyPart: "legs", target: "calves",
    equipment: "machine",
    instructions: ["Stand on calf raise machine with toes on platform.", "Rise onto toes as high as possible.", "Hold briefly at the top.", "Lower heels below platform for full stretch."],
    secondaryMuscles: [],
  },

  // ── SHOULDERS ──────────────────────────────────────────────────────────────
  {
    id: "24", name: "Barbell Overhead Press", bodyPart: "shoulders", target: "front delts",
    equipment: "barbell",
    instructions: ["Stand with bar at shoulder height, slightly wider than shoulder grip.", "Brace core and press bar straight overhead.", "Lock out arms at the top.", "Lower bar back to shoulder height."],
    secondaryMuscles: ["triceps", "traps", "core"],
  },
  {
    id: "25", name: "Dumbbell Lateral Raise", bodyPart: "shoulders", target: "side delts",
    equipment: "dumbbell",
    instructions: ["Stand holding dumbbells at sides.", "Raise arms to shoulder height with slight elbow bend.", "Lead with elbows, pinky slightly higher than thumb.", "Lower slowly and repeat."],
    secondaryMuscles: ["traps"],
  },
  {
    id: "26", name: "Dumbbell Front Raise", bodyPart: "shoulders", target: "front delts",
    equipment: "dumbbell",
    instructions: ["Stand holding dumbbells in front of thighs.", "Raise one or both arms to shoulder height.", "Keep arms nearly straight.", "Lower slowly and repeat."],
    secondaryMuscles: ["upper pectorals"],
  },
  {
    id: "27", name: "Rear Delt Fly", bodyPart: "shoulders", target: "rear delts",
    equipment: "dumbbell",
    instructions: ["Hinge forward at hips, holding dumbbells hanging down.", "Raise arms out to sides leading with elbows.", "Squeeze rear delts at the top.", "Lower and repeat."],
    secondaryMuscles: ["rhomboids", "traps"],
  },
  {
    id: "28", name: "Arnold Press", bodyPart: "shoulders", target: "front delts",
    equipment: "dumbbell",
    instructions: ["Hold dumbbells at face level, palms facing you.", "As you press up, rotate palms away until facing forward.", "Fully extend arms overhead.", "Reverse the rotation on the way down."],
    secondaryMuscles: ["side delts", "triceps"],
  },
  {
    id: "29", name: "Upright Row", bodyPart: "shoulders", target: "side delts",
    equipment: "barbell",
    instructions: ["Hold bar with narrow overhand grip.", "Pull bar up to chin keeping it close to body.", "Elbows lead and flare out to sides.", "Lower slowly and repeat."],
    secondaryMuscles: ["traps", "biceps"],
  },

  // ── ARMS ───────────────────────────────────────────────────────────────────
  {
    id: "30", name: "Barbell Bicep Curl", bodyPart: "arms", target: "biceps",
    equipment: "barbell",
    instructions: ["Stand holding bar with underhand grip, shoulder-width.", "Keep elbows close to torso.", "Curl bar up to shoulder level.", "Lower slowly to start."],
    secondaryMuscles: ["brachialis", "forearms"],
  },
  {
    id: "31", name: "Dumbbell Hammer Curl", bodyPart: "arms", target: "brachialis",
    equipment: "dumbbell",
    instructions: ["Stand holding dumbbells with neutral grip (thumbs up).", "Curl dumbbells keeping neutral grip throughout.", "Alternate arms or do both together.", "Lower slowly."],
    secondaryMuscles: ["biceps", "forearms"],
  },
  {
    id: "32", name: "Tricep Dip", bodyPart: "arms", target: "triceps",
    equipment: "body weight",
    instructions: ["Grip parallel bars, arms extended.", "Lower body by bending elbows to 90°.", "Keep torso upright to target triceps.", "Press back up and repeat."],
    secondaryMuscles: ["front delts", "pectorals"],
  },
  {
    id: "33", name: "Cable Tricep Pushdown", bodyPart: "arms", target: "triceps",
    equipment: "cable",
    instructions: ["Stand facing cable machine, bar at chest height.", "Grip bar with overhand grip, elbows at sides.", "Push bar down until arms fully extended.", "Slowly return to start."],
    secondaryMuscles: [],
  },
  {
    id: "34", name: "Skull Crusher", bodyPart: "arms", target: "triceps",
    equipment: "barbell",
    instructions: ["Lie on bench holding bar with narrow overhand grip.", "Lower bar toward forehead by bending elbows.", "Keep upper arms perpendicular to floor.", "Extend arms back to start."],
    secondaryMuscles: [],
  },
  {
    id: "35", name: "Preacher Curl", bodyPart: "arms", target: "biceps",
    equipment: "barbell",
    instructions: ["Sit at preacher bench, arms on pad.", "Curl bar up to chin.", "Lower slowly until arms are nearly extended.", "Do not lock out at bottom."],
    secondaryMuscles: ["brachialis"],
  },
  {
    id: "36", name: "Overhead Tricep Extension", bodyPart: "arms", target: "triceps",
    equipment: "dumbbell",
    instructions: ["Hold one dumbbell with both hands overhead.", "Lower dumbbell behind head by bending elbows.", "Keep upper arms close to head.", "Extend arms back overhead."],
    secondaryMuscles: [],
  },
  {
    id: "37", name: "Concentration Curl", bodyPart: "arms", target: "biceps",
    equipment: "dumbbell",
    instructions: ["Sit on bench, elbow resting on inner thigh.", "Curl dumbbell up to shoulder.", "Fully contract bicep at top.", "Lower slowly."],
    secondaryMuscles: [],
  },

  // ── ABS ────────────────────────────────────────────────────────────────────
  {
    id: "38", name: "Plank", bodyPart: "abs", target: "core",
    equipment: "body weight",
    instructions: ["Start in forearm plank position.", "Keep body in a straight line from head to heels.", "Engage core and glutes.", "Hold for the desired duration."],
    secondaryMuscles: ["glutes", "shoulders"],
  },
  {
    id: "39", name: "Crunch", bodyPart: "abs", target: "rectus abdominis",
    equipment: "body weight",
    instructions: ["Lie on back with knees bent, hands behind head.", "Lift shoulders off floor contracting abs.", "Do not pull on neck.", "Lower back down and repeat."],
    secondaryMuscles: [],
  },
  {
    id: "40", name: "Hanging Leg Raise", bodyPart: "abs", target: "lower abs",
    equipment: "body weight",
    instructions: ["Hang from a pull-up bar.", "Raise legs until parallel to floor or higher.", "Control the movement — avoid swinging.", "Lower slowly."],
    secondaryMuscles: ["hip flexors", "grip"],
  },
  {
    id: "41", name: "Russian Twist", bodyPart: "abs", target: "obliques",
    equipment: "body weight",
    instructions: ["Sit with knees bent, lean back slightly.", "Lift feet off floor (optional).", "Rotate torso side to side.", "Add a weight plate for more resistance."],
    secondaryMuscles: ["rectus abdominis"],
  },
  {
    id: "42", name: "Cable Crunch", bodyPart: "abs", target: "rectus abdominis",
    equipment: "cable",
    instructions: ["Kneel in front of cable machine with rope attachment at top.", "Hold rope at neck level.", "Crunch down pulling elbows toward knees.", "Slowly return to start."],
    secondaryMuscles: ["obliques"],
  },
  {
    id: "43", name: "Ab Wheel Rollout", bodyPart: "abs", target: "core",
    equipment: "body weight",
    instructions: ["Kneel on floor holding ab wheel with both hands.", "Roll wheel forward as far as possible keeping hips down.", "Use core to pull wheel back to knees.", "Repeat."],
    secondaryMuscles: ["lats", "shoulders"],
  },
  {
    id: "44", name: "Bicycle Crunch", bodyPart: "abs", target: "obliques",
    equipment: "body weight",
    instructions: ["Lie on back, hands behind head.", "Bring opposite elbow to opposite knee in a cycling motion.", "Fully extend the opposite leg.", "Alternate sides continuously."],
    secondaryMuscles: ["rectus abdominis"],
  },

  // ── CARDIO ─────────────────────────────────────────────────────────────────
  {
    id: "45", name: "Treadmill Run", bodyPart: "cardio", target: "cardiovascular system",
    equipment: "machine",
    instructions: ["Set treadmill to desired speed.", "Maintain upright posture, light arm swing.", "Land midfoot for efficiency.", "Adjust speed/incline as needed."],
    secondaryMuscles: ["quadriceps", "hamstrings", "calves"],
  },
  {
    id: "46", name: "Stationary Bike", bodyPart: "cardio", target: "cardiovascular system",
    equipment: "machine",
    instructions: ["Adjust seat height so knees slightly bend at bottom of pedal stroke.", "Set resistance to desired level.", "Pedal at a consistent cadence.", "Keep back straight and core engaged."],
    secondaryMuscles: ["quadriceps", "calves"],
  },
  {
    id: "47", name: "Jump Rope", bodyPart: "cardio", target: "cardiovascular system",
    equipment: "body weight",
    instructions: ["Hold rope handles at hip level.", "Jump just high enough to clear rope.", "Land on balls of feet.", "Keep elbows close to body."],
    secondaryMuscles: ["calves", "shoulders", "core"],
  },
  {
    id: "48", name: "Rowing Machine", bodyPart: "cardio", target: "cardiovascular system",
    equipment: "machine",
    instructions: ["Sit on rower with feet strapped in.", "Extend legs first, then lean back and pull handle to lower chest.", "Reverse: extend arms, lean forward, bend knees.", "Maintain smooth continuous motion."],
    secondaryMuscles: ["back", "arms", "core"],
  },

  // ── COMPOUND / FULL BODY ───────────────────────────────────────────────────
  {
    id: "49", name: "Barbell Power Clean", bodyPart: "back", target: "traps",
    equipment: "barbell",
    instructions: ["Start with bar on floor in deadlift position.", "Pull bar explosively, extend hips and shrug.", "Drop under bar and catch in front rack.", "Stand to complete the rep."],
    secondaryMuscles: ["hamstrings", "glutes", "quadriceps", "forearms"],
  },
  {
    id: "50", name: "Dumbbell Thruster", bodyPart: "shoulders", target: "front delts",
    equipment: "dumbbell",
    instructions: ["Hold dumbbells at shoulder height.", "Squat down keeping chest up.", "Drive up explosively and press dumbbells overhead.", "Lower back to shoulders as you descend into squat."],
    secondaryMuscles: ["quadriceps", "glutes", "triceps"],
  },
  {
    id: "51", name: "Farmer's Walk", bodyPart: "back", target: "traps",
    equipment: "dumbbell",
    instructions: ["Pick up heavy dumbbells or farmer handles.", "Walk with tall posture and controlled steps.", "Keep core braced and shoulders packed.", "Walk for desired distance or time."],
    secondaryMuscles: ["forearms", "core", "quadriceps"],
  },
  {
    id: "52", name: "Kettlebell Swing", bodyPart: "legs", target: "glutes",
    equipment: "kettlebell",
    instructions: ["Hold kettlebell with both hands, feet shoulder-width.", "Hinge at hips sending kettlebell between legs.", "Drive hips forward explosively swinging kettlebell to shoulder height.", "Let it swing back between legs and repeat."],
    secondaryMuscles: ["hamstrings", "core", "shoulders"],
  },
  {
    id: "53", name: "Box Jump", bodyPart: "legs", target: "quadriceps",
    equipment: "body weight",
    instructions: ["Stand in front of a plyometric box.", "Dip into a quarter squat then jump onto box.", "Land softly with both feet.", "Step back down and repeat."],
    secondaryMuscles: ["glutes", "calves", "core"],
  },
  {
    id: "54", name: "Dips (Chest)", bodyPart: "chest", target: "lower pectorals",
    equipment: "body weight",
    instructions: ["Grip parallel bars and support body weight.", "Lean forward slightly to target chest.", "Lower until elbows are at 90°.", "Push back up."],
    secondaryMuscles: ["triceps", "front delts"],
  },
  {
    id: "55", name: "Chin-Up", bodyPart: "back", target: "lats",
    equipment: "body weight",
    instructions: ["Hang from bar with underhand grip shoulder-width.", "Pull until chin clears bar.", "Focus on driving elbows down.", "Lower with control."],
    secondaryMuscles: ["biceps", "rhomboids"],
  },
  {
    id: "56", name: "Good Morning", bodyPart: "back", target: "erector spinae",
    equipment: "barbell",
    instructions: ["Bar on upper traps, feet hip-width.", "Hinge forward at hips keeping back straight.", "Lower torso until nearly parallel to floor.", "Drive hips forward to return."],
    secondaryMuscles: ["hamstrings", "glutes"],
  },
  {
    id: "57", name: "Hack Squat", bodyPart: "legs", target: "quadriceps",
    equipment: "machine",
    instructions: ["Position on hack squat machine, feet shoulder-width.", "Lower until thighs are parallel.", "Press through feet to stand.", "Do not lock knees at top."],
    secondaryMuscles: ["glutes", "hamstrings"],
  },
  {
    id: "58", name: "Cable Lateral Raise", bodyPart: "shoulders", target: "side delts",
    equipment: "cable",
    instructions: ["Stand beside low cable pulley.", "Hold handle with far hand.", "Raise arm to shoulder height in an arc.", "Lower slowly and repeat, then switch sides."],
    secondaryMuscles: ["traps"],
  },
  {
    id: "59", name: "Incline Dumbbell Curl", bodyPart: "arms", target: "biceps",
    equipment: "dumbbell",
    instructions: ["Sit on incline bench holding dumbbells at sides.", "Let arms hang fully extended behind torso.", "Curl dumbbells to shoulders.", "Lower fully and repeat."],
    secondaryMuscles: ["brachialis", "forearms"],
  },
  {
    id: "60", name: "Close-Grip Bench Press", bodyPart: "arms", target: "triceps",
    equipment: "barbell",
    instructions: ["Lie on bench, grip bar at shoulder-width.", "Lower bar to lower chest keeping elbows close.", "Press back up.", "Repeat."],
    secondaryMuscles: ["pectorals", "front delts"],
  },
]

export function getExercises(limit = 20, offset = 0): Promise<Exercise[]> {
  return Promise.resolve(EXERCISES.slice(offset, offset + limit))
}

export function getExerciseById(id: string): Promise<Exercise> {
  const ex = EXERCISES.find(e => e.id === id)
  if (!ex) return Promise.reject(new Error("Exercise not found"))
  return Promise.resolve(ex)
}

export function getExercisesByBodyPart(bodyPart: string, limit = 20, offset = 0): Promise<Exercise[]> {
  const filtered = EXERCISES.filter(e => e.bodyPart === bodyPart.toLowerCase())
  return Promise.resolve(filtered.slice(offset, offset + limit))
}

export function searchExercisesByName(name: string, limit = 20, offset = 0): Promise<Exercise[]> {
  const q = name.toLowerCase()
  const filtered = EXERCISES.filter(e =>
    e.name.toLowerCase().includes(q) ||
    e.bodyPart.includes(q) ||
    e.target.toLowerCase().includes(q)
  )
  return Promise.resolve(filtered.slice(offset, offset + limit))
}

export function getBodyPartList(): Promise<string[]> {
  const parts = [...new Set(EXERCISES.map(e => e.bodyPart))].sort()
  return Promise.resolve(parts)
}

export function getExercisesByTarget(_target: string, limit = 20, offset = 0): Promise<Exercise[]> {
  return getExercises(limit, offset)
}

export function getEquipmentList(): Promise<string[]> {
  const eq = [...new Set(EXERCISES.map(e => e.equipment))].sort()
  return Promise.resolve(eq)
}
