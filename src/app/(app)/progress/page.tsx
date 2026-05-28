import { createClient } from "@/lib/supabase/server"
import ProgressCharts from "./ProgressCharts"

export default async function ProgressPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [workoutsRes, prsRes, measurementsRes] = await Promise.all([
    supabase
      .from("workouts")
      .select("started_at")
      .eq("user_id", user!.id)
      .order("started_at")
      .limit(90),
    supabase
      .from("personal_records")
      .select("*")
      .eq("user_id", user!.id)
      .order("achieved_at"),
    supabase
      .from("body_measurements")
      .select("*")
      .eq("user_id", user!.id)
      .order("measured_at"),
  ])

  // Group workouts by week for frequency chart
  const workoutsByWeek = groupByWeek(workoutsRes.data || [])

  // Group PRs by exercise
  const prsByExercise: Record<string, Array<{ date: string; weight: number; reps: number }>> = {}
  for (const pr of prsRes.data || []) {
    if (!prsByExercise[pr.exercise_name]) prsByExercise[pr.exercise_name] = []
    prsByExercise[pr.exercise_name].push({
      date: pr.achieved_at.split("T")[0],
      weight: pr.weight_kg || 0,
      reps: pr.reps || 0,
    })
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Progress</h1>
        <p className="text-zinc-400 text-sm mt-1">Track your fitness journey over time</p>
      </div>
      <ProgressCharts
        workoutsByWeek={workoutsByWeek}
        prsByExercise={prsByExercise}
        measurements={(measurementsRes.data || []).map(m => ({
          date: m.measured_at.split("T")[0],
          weight: m.weight_kg,
          bodyFat: m.body_fat_percent,
        }))}
        userId={user!.id}
      />
    </div>
  )
}

function groupByWeek(workouts: Array<{ started_at: string }>) {
  const map: Record<string, number> = {}
  for (const w of workouts) {
    const d = new Date(w.started_at)
    const startOfWeek = new Date(d)
    startOfWeek.setDate(d.getDate() - d.getDay())
    const key = startOfWeek.toISOString().split("T")[0]
    map[key] = (map[key] || 0) + 1
  }
  return Object.entries(map).map(([week, count]) => ({ week, count })).sort((a, b) => a.week.localeCompare(b.week))
}
