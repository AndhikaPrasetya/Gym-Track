import { NextResponse } from "next/server"
import { getBodyPartList } from "@/lib/exercisedb"

export async function GET() {
  try {
    const parts = await getBodyPartList()
    return NextResponse.json(parts)
  } catch {
    return NextResponse.json({ error: "Failed to fetch body parts" }, { status: 500 })
  }
}
