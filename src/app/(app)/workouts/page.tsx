import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Plus, ChevronRight, Calendar, Dumbbell, Clock } from "lucide-react"

interface WorkoutRow {
  id: string
  name: string
  notes: string | null
  started_at: string
  finished_at: string | null
  workout_exercises: Array<{ count: number }>
}

export default async function WorkoutsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: rawWorkouts } = await supabase
    .from("workouts")
    .select("id, name, notes, started_at, finished_at, workout_exercises(count)")
    .eq("user_id", user!.id)
    .order("started_at", { ascending: false })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const workouts = (rawWorkouts || []) as any[] as WorkoutRow[]

  const grouped = groupByMonth(workouts)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Workouts</h1>
          <p className="text-zinc-400 text-sm mt-1">{workouts?.length || 0} workouts logged</p>
        </div>
        <Link
          href="/workouts/new"
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium text-sm transition-colors"
        >
          <Plus size={16} />
          New
        </Link>
      </div>

      {(!workouts || workouts.length === 0) ? (
        <div className="text-center py-20">
          <Dumbbell size={48} className="text-zinc-700 mx-auto mb-4" />
          <h2 className="text-white font-semibold text-lg mb-2">No workouts yet</h2>
          <p className="text-zinc-500 mb-6">Start logging your gym sessions!</p>
          <Link href="/workouts/new" className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors">
            Log first workout
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([month, monthWorkouts]) => (
            <div key={month}>
              <h2 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-3">{month}</h2>
              <div className="space-y-3">
                {monthWorkouts.map(w => {
                  const duration = w.finished_at
                    ? Math.round((new Date(w.finished_at).getTime() - new Date(w.started_at).getTime()) / 60000)
                    : null
                  const exerciseCount = (w.workout_exercises as Array<{ count: number }>)[0]?.count || 0
                  return (
                    <Link
                      key={w.id}
                      href={`/workouts/${w.id}`}
                      className="flex items-center gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-600 transition-colors group"
                    >
                      <div className="shrink-0 w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center">
                        <Dumbbell size={18} className="text-orange-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm">{w.name}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-zinc-500 text-xs flex items-center gap-1">
                            <Calendar size={11} />
                            {new Date(w.started_at).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                          </span>
                          {duration != null && (
                            <span className="text-zinc-500 text-xs flex items-center gap-1">
                              <Clock size={11} /> {duration}m
                            </span>
                          )}
                          {exerciseCount > 0 && (
                            <span className="text-zinc-500 text-xs">{exerciseCount} exercises</span>
                          )}
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0" />
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function groupByMonth(workouts: WorkoutRow[]) {
  return workouts.reduce((acc, w) => {
    const d = new Date(w.started_at)
    const key = d.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    if (!acc[key]) acc[key] = []
    acc[key].push(w)
    return acc
  }, {} as Record<string, WorkoutRow[]>)
}
