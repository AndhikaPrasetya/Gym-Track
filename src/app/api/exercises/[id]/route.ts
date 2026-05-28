import { NextRequest, NextResponse } from "next/server"
import { getExerciseById } from "@/lib/exercisedb"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const exercise = await getExerciseById(id)
    return NextResponse.json(exercise)
  } catch {
    return NextResponse.json({ error: "Exercise not found" }, { status: 404 })
  }
}
