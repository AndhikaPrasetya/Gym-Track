import { NextRequest, NextResponse } from "next/server"
import { getExercises, getExercisesByBodyPart, searchExercisesByName } from "@/lib/exercisedb"

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
