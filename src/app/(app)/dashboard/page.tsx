import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Plus, Dumbbell, TrendingUp, Trophy, Calendar, ChevronRight } from "lucide-react"

interface WorkoutRow {
  id: string
  name: string
  started_at: string
  finished_at: string | null
}

interface PRRow {
  id: string
  exercise_name: string
  exercise_id: string
  weight_kg: number | null
  reps: number | null
  achieved_at: string
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [workoutsRes, prRes, profileRes] = await Promise.all([
    supabase
      .from("workouts")
      .select("id, name, started_at, finished_at")
      .eq("user_id", user!.id)
      .order("started_at", { ascending: false })
      .limit(5),
    supabase
      .from("personal_records")
      .select("id, exercise_name, exercise_id, weight_kg, reps, achieved_at")
      .eq("user_id", user!.id)
      .order("achieved_at", { ascending: false })
      .limit(5),
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user!.id)
      .maybeSingle(),
  ])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const workouts = (workoutsRes.data || []) as any[] as WorkoutRow[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prs = (prRes.data || []) as any[] as PRRow[]
  const profile = profileRes.data as { full_name: string | null } | null

  const [totalWorkoutsRes, thisWeekRes] = await Promise.all([
    supabase.from("workouts").select("id", { count: "exact", head: true }).eq("user_id", user!.id),
    supabase
      .from("workouts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user!.id)
      .gte("started_at", new Date(Date.now() - 7 * 86400000).toISOString()),
  ])

  const totalWorkouts = totalWorkoutsRes.count || 0
  const thisWeek = thisWeekRes.count || 0
  const greeting = getGreeting()
  const name = profile?.full_name?.split(" ")[0] || "Athlete"

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-zinc-400 text-sm">{greeting}</p>
          <h1 className="text-2xl font-bold text-white">{name} 💪</h1>
        </div>
        <Link
          href="/workouts/new"
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium text-sm transition-colors"
        >
          <Plus size={16} />
          New Workout
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<Dumbbell size={20} className="text-orange-500" />} label="Total Workouts" value={totalWorkouts} />
        <StatCard icon={<Calendar size={20} className="text-blue-500" />} label="This Week" value={thisWeek} />
        <StatCard icon={<Trophy size={20} className="text-yellow-500" />} label="Personal Records" value={prs.length} />
        <StatCard icon={<TrendingUp size={20} className="text-green-500" />} label="Active Days" value={thisWeek > 0 ? `${thisWeek}/7` : "0/7"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent workouts */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Recent Workouts</h2>
            <Link href="/workouts" className="text-orange-400 text-sm hover:text-orange-300 flex items-center gap-1">
              View all <ChevronRight size={14} />
            </Link>
          </div>
          {workouts.length === 0 ? (
            <EmptyState
              icon={<Dumbbell size={32} className="text-zinc-600" />}
              message="No workouts yet"
              action={{ label: "Log your first workout", href: "/workouts/new" }}
            />
          ) : (
            <ul className="space-y-3">
              {workouts.map((w) => (
                <li key={w.id}>
                  <Link
                    href={`/workouts/${w.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-800 transition-colors group"
                  >
                    <div>
                      <p className="text-white font-medium text-sm">{w.name}</p>
                      <p className="text-zinc-500 text-xs mt-0.5">
                        {new Date(w.started_at).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                        {w.finished_at && ` · ${getWorkoutDuration(w.started_at, w.finished_at)}`}
                      </p>
                    </div>
                    <ChevronRight size={16} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Personal Records */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Personal Records</h2>
            <Link href="/progress" className="text-orange-400 text-sm hover:text-orange-300 flex items-center gap-1">
              View all <ChevronRight size={14} />
            </Link>
          </div>
          {prs.length === 0 ? (
            <EmptyState
              icon={<Trophy size={32} className="text-zinc-600" />}
              message="No records yet"
              action={{ label: "Log a workout to set PRs", href: "/workouts/new" }}
            />
          ) : (
            <ul className="space-y-3">
              {prs.map((pr) => (
                <li key={pr.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50">
                  <div>
                    <p className="text-white font-medium text-sm capitalize">{pr.exercise_name}</p>
                    <p className="text-zinc-500 text-xs mt-0.5">
                      {new Date(pr.achieved_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    {pr.weight_kg && (
                      <p className="text-orange-400 font-semibold text-sm">{pr.weight_kg} kg</p>
                    )}
                    {pr.reps && (
                      <p className="text-zinc-400 text-xs">{pr.reps} reps</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-zinc-800 rounded-lg">{icon}</div>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-zinc-500 text-sm mt-0.5">{label}</p>
    </div>
  )
}

function EmptyState({ icon, message, action }: { icon: React.ReactNode; message: string; action: { label: string; href: string } }) {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      <div className="mb-3">{icon}</div>
      <p className="text-zinc-500 text-sm mb-3">{message}</p>
      <Link href={action.href} className="text-orange-400 text-sm hover:text-orange-300 font-medium">
        {action.label}
      </Link>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning,"
  if (h < 18) return "Good afternoon,"
  return "Good evening,"
}

function getWorkoutDuration(start: string, end: string) {
  const mins = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000)
  if (mins < 60) return `${mins}m`
  return `${Math.floor(mins / 60)}h ${mins % 60}m`
}
