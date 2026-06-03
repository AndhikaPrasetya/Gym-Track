import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { SEED_EXERCISES } from "@/lib/exercisedb"

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { count } = await supabase.from("exercises").select("*", { count: "exact", head: true })
  if (count && count > 0) {
    return NextResponse.json({ message: "Already seeded", count })
  }

  const rows = SEED_EXERCISES.map(ex => ({
    name: ex.name,
    body_part: ex.bodyPart,
    target: ex.target,
    equipment: ex.equipment,
    instructions: ex.instructions,
    secondary_muscles: ex.secondaryMuscles,
    description: ex.description ?? null,
  }))

  const { error } = await supabase.from("exercises").insert(rows)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ message: "Seeded", count: rows.length }, { status: 201 })
}
