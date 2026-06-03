import { NextRequest, NextResponse } from "next/server"
import { getExerciseById } from "@/lib/exercisedb"
import { createClient } from "@/lib/supabase/server"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const exercise = await getExerciseById(id)
    return NextResponse.json(exercise)
  } catch {
    return NextResponse.json({ error: "Exercise not found" }, { status: 404 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { data, error } = await supabase
    .from("exercises")
    .update({
      name: body.name,
      body_part: body.bodyPart,
      target: body.target,
      equipment: body.equipment,
      instructions: body.instructions || [],
      secondary_muscles: body.secondaryMuscles || [],
      description: body.description || null,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    id: data.id,
    name: data.name,
    bodyPart: data.body_part,
    target: data.target,
    equipment: data.equipment,
    instructions: data.instructions,
    secondaryMuscles: data.secondary_muscles,
    description: data.description,
  })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { error } = await supabase.from("exercises").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
