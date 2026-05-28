"use client"

import { Suspense, useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Plus, Search, Trash2, Check, ChevronDown, ChevronUp, X, Dumbbell } from "lucide-react"
import type { Exercise } from "@/lib/exercisedb"

interface WorkoutSet {
  id: string
  weight: string
  reps: string
  completed: boolean
}

interface WorkoutExercise {
  id: string
  exerciseId: string
  exerciseName: string
  bodyPart: string
  target: string
  gifUrl?: string
  equipment: string
  sets: WorkoutSet[]
  expanded: boolean
}

export default function NewWorkoutPageWrapper() {
  return (
    <Suspense fallback={<div className="text-zinc-600 py-20 text-center">Loading...</div>}>
      <NewWorkoutPage />
    </Suspense>
  )
}

function NewWorkoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preloadExerciseId = searchParams.get("exercise")

  const [name, setName] = useState(`Workout — ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}`)
  const [notes, setNotes] = useState("")
  const [exercises, setExercises] = useState<WorkoutExercise[]>([])
  const [showPicker, setShowPicker] = useState(false)
  const [saving, setSaving] = useState(false)

  const addExercise = useCallback((ex: Exercise) => {
    setExercises(prev => [...prev, {
      id: crypto.randomUUID(),
      exerciseId: ex.id,
      exerciseName: ex.name,
      bodyPart: ex.bodyPart,
      target: ex.target,
      gifUrl: ex.gifUrl,
      equipment: ex.equipment,
      sets: [newSet()],
      expanded: true,
    }])
    setShowPicker(false)
  }, [])

  useEffect(() => {
    if (preloadExerciseId) {
      fetch(`/api/exercises/${preloadExerciseId}`)
        .then(r => r.json())
        .then(ex => { if (ex.id) addExercise(ex) })
    }
  }, [preloadExerciseId, addExercise])

  function newSet(): WorkoutSet {
    return { id: crypto.randomUUID(), weight: "", reps: "", completed: false }
  }

  function addSet(exId: string) {
    setExercises(prev => prev.map(e =>
      e.id === exId ? { ...e, sets: [...e.sets, newSet()] } : e
    ))
  }

  function removeSet(exId: string, setId: string) {
    setExercises(prev => prev.map(e =>
      e.id === exId ? { ...e, sets: e.sets.filter(s => s.id !== setId) } : e
    ))
  }

  function updateSet(exId: string, setId: string, field: keyof WorkoutSet, value: string | boolean) {
    setExercises(prev => prev.map(e =>
      e.id === exId
        ? { ...e, sets: e.sets.map(s => s.id === setId ? { ...s, [field]: value } : s) }
        : e
    ))
  }

  function removeExercise(exId: string) {
    setExercises(prev => prev.filter(e => e.id !== exId))
  }

  function toggleExpand(exId: string) {
    setExercises(prev => prev.map(e =>
      e.id === exId ? { ...e, expanded: !e.expanded } : e
    ))
  }

  async function handleSave() {
    if (!name.trim() || exercises.length === 0) return
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const now = new Date().toISOString()
    const { data: workout, error: wErr } = await supabase
      .from("workouts")
      .insert({ user_id: user.id, name: name.trim(), notes: notes.trim() || null, started_at: now })
      .select()
      .single()

    if (wErr || !workout) { setSaving(false); return }

    for (let i = 0; i < exercises.length; i++) {
      const ex = exercises[i]
      const { data: we, error: weErr } = await supabase
        .from("workout_exercises")
        .insert({
          workout_id: workout.id,
          exercise_id: ex.exerciseId,
          exercise_name: ex.exerciseName,
          exercise_body_part: ex.bodyPart,
          exercise_target: ex.target,
          exercise_gif_url: ex.gifUrl,
          exercise_equipment: ex.equipment,
          order_index: i,
        })
        .select()
        .single()

      if (weErr || !we) continue

      const setsToInsert = ex.sets.map((s, idx) => ({
        workout_exercise_id: we.id,
        set_number: idx + 1,
        weight_kg: s.weight ? parseFloat(s.weight) : null,
        reps: s.reps ? parseInt(s.reps) : null,
        completed: s.completed,
      }))

      const { data: insertedSets } = await supabase.from("workout_sets").insert(setsToInsert).select()

      // Check for PRs
      if (insertedSets) {
        const maxWeightSet = insertedSets
          .filter(s => s.weight_kg)
          .sort((a, b) => (b.weight_kg || 0) - (a.weight_kg || 0))[0]

        if (maxWeightSet?.weight_kg) {
          const { data: existing } = await supabase
            .from("personal_records")
            .select("weight_kg")
            .eq("user_id", user.id)
            .eq("exercise_id", ex.exerciseId)
            .order("weight_kg", { ascending: false })
            .limit(1)
            .single()

          if (!existing || (existing.weight_kg || 0) < maxWeightSet.weight_kg) {
            await supabase.from("personal_records").insert({
              user_id: user.id,
              exercise_id: ex.exerciseId,
              exercise_name: ex.exerciseName,
              weight_kg: maxWeightSet.weight_kg,
              reps: maxWeightSet.reps,
              workout_set_id: maxWeightSet.id,
            })
          }
        }
      }
    }

    await supabase.from("workouts").update({ finished_at: new Date().toISOString() }).eq("id", workout.id)
    router.push(`/workouts/${workout.id}`)
  }

  const completedSets = exercises.reduce((acc, e) => acc + e.sets.filter(s => s.completed).length, 0)
  const totalSets = exercises.reduce((acc, e) => acc + e.sets.length, 0)

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">New Workout</h1>
        {totalSets > 0 && (
          <span className="text-sm text-zinc-400">{completedSets}/{totalSets} sets done</span>
        )}
      </div>

      {/* Workout name */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-4">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full bg-transparent text-white font-semibold text-lg focus:outline-none placeholder-zinc-600"
          placeholder="Workout name"
        />
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={2}
          placeholder="Add notes (optional)..."
          className="w-full bg-transparent text-zinc-400 text-sm mt-2 focus:outline-none placeholder-zinc-600 resize-none"
        />
      </div>

      {/* Exercises */}
      <div className="space-y-4 mb-4">
        {exercises.map((ex, exIdx) => (
          <div key={ex.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            {/* Exercise header */}
            <div className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
                <Dumbbell size={16} className="text-zinc-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm capitalize truncate">{ex.exerciseName}</p>
                <p className="text-zinc-500 text-xs capitalize">{ex.bodyPart} · {ex.target}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => toggleExpand(ex.id)} className="p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors">
                  {ex.expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                <button onClick={() => removeExercise(ex.id)} className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {ex.expanded && (
              <div className="px-4 pb-4">
                {/* Sets header */}
                <div className="grid grid-cols-[2rem_1fr_1fr_2rem] gap-2 mb-2 text-zinc-500 text-xs px-1">
                  <span>Set</span>
                  <span>Weight</span>
                  <span>Reps</span>
                  <span></span>
                </div>

                {/* Sets */}
                <div className="space-y-2">
                  {ex.sets.map((set, setIdx) => (
                    <div key={set.id} className={`grid grid-cols-[2rem_1fr_1fr_2rem] gap-2 items-center rounded-lg px-1 py-1 transition-colors ${set.completed ? "bg-green-500/5" : ""}`}>
                      <button
                        onClick={() => updateSet(ex.id, set.id, "completed", !set.completed)}
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${set.completed ? "bg-green-500 border-green-500 text-white" : "border-zinc-700 text-zinc-600 hover:border-zinc-500"}`}
                      >
                        {set.completed ? <Check size={12} /> : setIdx + 1}
                      </button>
                      <input
                        type="number"
                        value={set.weight}
                        onChange={e => updateSet(ex.id, set.id, "weight", e.target.value)}
                        placeholder="—"
                        className="px-2 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 w-full"
                      />
                      <input
                        type="number"
                        value={set.reps}
                        onChange={e => updateSet(ex.id, set.id, "reps", e.target.value)}
                        placeholder="—"
                        className="px-2 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 w-full"
                      />
                      <button
                        onClick={() => ex.sets.length > 1 && removeSet(ex.id, set.id)}
                        className="text-zinc-700 hover:text-red-400 transition-colors disabled:opacity-30"
                        disabled={ex.sets.length === 1}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => addSet(ex.id)}
                  className="mt-3 flex items-center gap-1.5 text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors"
                >
                  <Plus size={14} />
                  Add set
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add exercise */}
      <button
        onClick={() => setShowPicker(true)}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-zinc-800 hover:border-zinc-600 text-zinc-500 hover:text-zinc-300 rounded-2xl transition-colors mb-6"
      >
        <Plus size={18} />
        Add exercise
      </button>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saving || !name.trim() || exercises.length === 0}
        className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
      >
        {saving ? "Saving..." : "Finish Workout"}
      </button>

      {/* Exercise Picker Modal */}
      {showPicker && (
        <ExercisePicker onSelect={addExercise} onClose={() => setShowPicker(false)} />
      )}
    </div>
  )
}

function ExercisePicker({ onSelect, onClose }: { onSelect: (ex: Exercise) => void; onClose: () => void }) {
  const [query, setQuery] = useState("")
  const [inputVal, setInputVal] = useState("")
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ limit: "20" })
    if (query) params.set("q", query)
    fetch(`/api/exercises?${params}`)
      .then(r => r.json())
      .then(data => { setExercises(Array.isArray(data) ? data : []); setLoading(false) })
  }, [query])

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 className="text-white font-semibold">Pick exercise</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
            <X size={20} />
          </button>
        </div>
        <form
          onSubmit={e => { e.preventDefault(); setQuery(inputVal) }}
          className="flex gap-2 p-4 border-b border-zinc-800"
        >
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              autoFocus
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder="Search exercises..."
              className="w-full pl-8 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
          <button type="submit" className="px-3 py-2 bg-orange-500 text-white rounded-lg text-sm">Go</button>
        </form>
        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="p-4 space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-14 bg-zinc-900 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : exercises.length === 0 ? (
            <p className="text-center text-zinc-500 py-8">No exercises found</p>
          ) : (
            <ul className="p-2">
              {exercises.map(ex => (
                <li key={ex.id}>
                  <button
                    onClick={() => onSelect(ex)}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-zinc-900 transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                      <Dumbbell size={16} className="text-zinc-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium capitalize truncate">{ex.name}</p>
                      <p className="text-zinc-500 text-xs capitalize">{ex.bodyPart} · {ex.target}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
