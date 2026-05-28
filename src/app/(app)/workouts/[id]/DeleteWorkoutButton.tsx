"use client"

import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"

export default function DeleteWorkoutButton({ workoutId }: { workoutId: string }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)

  async function handleDelete() {
    if (!confirming) { setConfirming(true); return }
    const supabase = createClient()
    await supabase.from("workouts").delete().eq("id", workoutId)
    router.push("/workouts")
  }

  return (
    <button
      onClick={handleDelete}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
        confirming
          ? "bg-red-500/20 text-red-400 border border-red-500/30"
          : "text-zinc-500 hover:text-red-400 hover:bg-zinc-800"
      }`}
    >
      <Trash2 size={14} />
      {confirming ? "Confirm delete" : "Delete"}
    </button>
  )
}
