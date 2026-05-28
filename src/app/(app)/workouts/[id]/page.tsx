import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Clock, Dumbbell, Trophy, Trash2 } from "lucide-react"
import { notFound, redirect } from "next/navigation"
import DeleteWorkoutButton from "./DeleteWorkoutButton"

export default async function WorkoutDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: workout } = await supabase
    .from("workouts")
    .select("*")
    .eq("id", id)
    .eq("user_id", user!.id)
    .single()

  if (!workout) notFound()

  const { data: exercises } = await supabase
    .from("workout_exercises")
    .select("*, workout_sets(*)")
    .eq("workout_id", id)
    .order("order_index")

  const duration = workout.finished_at
    ? Math.round((new Date(workout.finished_at).getTime() - new Date(workout.started_at).getTime()) / 60000)
    : null

  const totalSets = exercises?.reduce((a, e) => a + (e.workout_sets?.length || 0), 0) || 0
  const totalVolume = exercises?.reduce((a, e) =>
    a + (e.workout_sets?.reduce((b: number, s: { weight_kg: number | null; reps: number | null }) =>
      b + ((s.weight_kg || 0) * (s.reps || 0)), 0) || 0), 0) || 0

  return (
    <div className="max-w-2xl">
      <Link href="/workouts" className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white text-sm mb-6 transition-colors">
        <ChevronLeft size={16} />
        All workouts
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{workout.name}</h1>
          <p className="text-zinc-400 text-sm mt-1">
            {new Date(workout.started_at).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <DeleteWorkoutButton workoutId={workout.id} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
          <Clock size={18} className="text-blue-400 mx-auto mb-1.5" />
          <p className="text-white font-semibold">{duration != null ? `${duration}m` : "—"}</p>
          <p className="text-zinc-500 text-xs">Duration</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
          <Dumbbell size={18} className="text-orange-400 mx-auto mb-1.5" />
          <p className="text-white font-semibold">{totalSets}</p>
          <p className="text-zinc-500 text-xs">Total sets</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
          <Trophy size={18} className="text-yellow-400 mx-auto mb-1.5" />
          <p className="text-white font-semibold">{totalVolume > 0 ? `${(totalVolume / 1000).toFixed(1)}t` : "—"}</p>
          <p className="text-zinc-500 text-xs">Volume</p>
        </div>
      </div>

      {workout.notes && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-6">
          <p className="text-zinc-400 text-sm">{workout.notes}</p>
        </div>
      )}

      {/* Exercises */}
      <div className="space-y-4">
        {exercises?.map(ex => (
          <div key={ex.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3 p-4 border-b border-zinc-800">
              <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
                {ex.exercise_gif_url ? (
                  <Image src={ex.exercise_gif_url} alt={ex.exercise_name} width={40} height={40} unoptimized className="object-cover" />
                ) : (
                  <Dumbbell size={16} className="text-zinc-600" />
                )}
              </div>
              <div>
                <p className="text-white font-medium text-sm capitalize">{ex.exercise_name}</p>
                <p className="text-zinc-500 text-xs capitalize">{ex.exercise_body_part} · {ex.exercise_target}</p>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-[2rem_1fr_1fr_1fr] gap-2 mb-2 text-zinc-500 text-xs px-1">
                <span>Set</span>
                <span>Weight</span>
                <span>Reps</span>
                <span>Vol.</span>
              </div>
              {(ex.workout_sets as Array<{ id: string; set_number: number; weight_kg: number | null; reps: number | null; completed: boolean }>)
                ?.sort((a, b) => a.set_number - b.set_number)
                .map(set => (
                  <div key={set.id} className={`grid grid-cols-[2rem_1fr_1fr_1fr] gap-2 items-center px-1 py-1.5 rounded-lg ${set.completed ? "bg-green-500/5" : ""}`}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${set.completed ? "bg-green-500 text-white" : "bg-zinc-800 text-zinc-400"}`}>
                      {set.set_number}
                    </span>
                    <span className="text-white text-sm">{set.weight_kg != null ? `${set.weight_kg} kg` : "—"}</span>
                    <span className="text-white text-sm">{set.reps != null ? set.reps : "—"}</span>
                    <span className="text-zinc-400 text-sm">
                      {set.weight_kg && set.reps ? `${(set.weight_kg * set.reps).toFixed(0)} kg` : "—"}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
