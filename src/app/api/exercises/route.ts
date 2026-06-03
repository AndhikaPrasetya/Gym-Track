import { NextRequest, NextResponse } from "next/server"
import { getExercises, getExercisesByBodyPart, searchExercisesByName } from "@/lib/exercisedb"
import { createClient } from "@/lib/supabase/server"

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const q = searchParams.get("q") || ""
  const bodyPart = searchParams.get("bodyPart") || ""
  const limit = parseInt(searchParams.get("limit") || "20")
  const offset = parseInt(searchParams.get("offset") || "0")

  try {
    let exercises
    if (q) {
      exercises = await searchExercisesByName(q, limit, offset)
    } else if (bodyPart) {
      exercises = await getExercisesByBodyPart(bodyPart, limit, offset)
    } else {
      exercises = await getExercises(limit, offset)
    }
    return NextResponse.json(exercises)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to fetch exercises" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { data, error } = await supabase
    .from("exercises")
    .insert({
      name: body.name,
      body_part: body.bodyPart,
      target: body.target,
      equipment: body.equipment || "body weight",
      instructions: body.instructions || [],
      secondary_muscles: body.secondaryMuscles || [],
      description: body.description || null,
    })
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
  }, { status: 201 })
}
