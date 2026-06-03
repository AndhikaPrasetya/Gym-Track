"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"
import ExerciseForm, { type ExerciseFormData } from "@/components/ExerciseForm"
import type { Exercise } from "@/lib/exercisedb"

export default function EditExercisePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/exercises/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.id) setExercise(data)
        else toast.error("Exercise not found")
      })
      .finally(() => setLoading(false))
  }, [id])

  async function handleSubmit(data: ExerciseFormData) {
    const res = await fetch(`/api/exercises/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json()
      toast.error(err.error || "Failed to update exercise")
      return
    }
    toast.success("Exercise updated!")
    router.push(`/exercises/${id}`)
  }

  return (
    <div className="max-w-xl">
      <Link
        href={`/exercises/${id}`}
        className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white text-sm mb-6 transition-colors"
      >
        <ChevronLeft size={16} />
        Back to exercise
      </Link>

      <h1 className="text-2xl font-bold text-white mb-6">Edit Exercise</h1>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 size={24} className="animate-spin text-zinc-500" />
          </div>
        ) : exercise ? (
          <ExerciseForm
            defaultValues={{
              name: exercise.name,
              bodyPart: exercise.bodyPart,
              target: exercise.target,
              equipment: exercise.equipment,
              instructions: exercise.instructions,
              secondaryMuscles: exercise.secondaryMuscles,
              description: exercise.description ?? "",
            }}
            onSubmit={handleSubmit}
            submitLabel="Save Changes"
          />
        ) : (
          <p className="text-zinc-500 text-center py-8">Exercise not found.</p>
        )}
      </div>
    </div>
  )
}
