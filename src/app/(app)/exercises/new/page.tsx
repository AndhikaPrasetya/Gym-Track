"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { toast } from "sonner"
import ExerciseForm, { type ExerciseFormData } from "@/components/ExerciseForm"

export default function NewExercisePage() {
  const router = useRouter()

  async function handleSubmit(data: ExerciseFormData) {
    const res = await fetch("/api/exercises", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json()
      toast.error(err.error || "Failed to create exercise")
      return
    }
    const exercise = await res.json()
    toast.success("Exercise created!")
    router.push(`/exercises/${exercise.id}`)
  }

  return (
    <div className="max-w-xl">
      <Link
        href="/exercises"
        className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white text-sm mb-6 transition-colors"
      >
        <ChevronLeft size={16} />
        Back to exercises
      </Link>

      <h1 className="text-2xl font-bold text-white mb-6">New Exercise</h1>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <ExerciseForm onSubmit={handleSubmit} submitLabel="Create Exercise" />
      </div>
    </div>
  )
}
