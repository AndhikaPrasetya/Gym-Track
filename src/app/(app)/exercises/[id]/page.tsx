import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Dumbbell, Target, Zap } from "lucide-react"
import { getExerciseById } from "@/lib/exercisedb"
import { notFound } from "next/navigation"

const BODY_PART_BG: Record<string, string> = {
  back: "from-blue-950 to-blue-900/30 text-blue-400/20",
  cardio: "from-red-950 to-red-900/30 text-red-400/20",
  chest: "from-orange-950 to-orange-900/30 text-orange-400/20",
  "lower arms": "from-yellow-950 to-yellow-900/30 text-yellow-400/20",
  "lower legs": "from-green-950 to-green-900/30 text-green-400/20",
  neck: "from-purple-950 to-purple-900/30 text-purple-400/20",
  shoulders: "from-pink-950 to-pink-900/30 text-pink-400/20",
  "upper arms": "from-indigo-950 to-indigo-900/30 text-indigo-400/20",
  "upper legs": "from-teal-950 to-teal-900/30 text-teal-400/20",
  waist: "from-zinc-900 to-zinc-800/30 text-zinc-400/20",
}

export default async function ExerciseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let exercise

  try {
    exercise = await getExerciseById(id)
  } catch {
    notFound()
  }

  return (
    <div className="max-w-3xl">
      <Link href="/exercises" className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white text-sm mb-6 transition-colors">
        <ChevronLeft size={16} />
        Back to exercises
      </Link>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        {/* Exercise image / body part banner */}
        <div className={`relative h-48 flex items-center justify-center bg-linear-to-br ${BODY_PART_BG[exercise.bodyPart] || "from-zinc-900 to-zinc-800/30 text-zinc-400/20"}`}>
          {exercise.gifUrl ? (
            <Image src={exercise.gifUrl} alt={exercise.name} fill className="object-contain p-4" unoptimized />
          ) : (
            <span className="text-9xl font-black uppercase tracking-tighter select-none leading-none">
              {exercise.bodyPart.slice(0, 2)}
            </span>
          )}
        </div>

        <div className="p-6">
          <h1 className="text-2xl font-bold text-white capitalize mb-4">{exercise.name}</h1>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge icon={<Dumbbell size={14} />} label={exercise.bodyPart} color="orange" />
            <Badge icon={<Target size={14} />} label={exercise.target} color="blue" />
            <Badge icon={<Zap size={14} />} label={exercise.equipment} color="green" />
          </div>

          {exercise.description && (
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">{exercise.description}</p>
          )}

          {/* Secondary muscles */}
          {exercise.secondaryMuscles?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">Secondary muscles</h2>
              <div className="flex flex-wrap gap-2">
                {exercise.secondaryMuscles.map(m => (
                  <span key={m} className="px-2.5 py-1 bg-zinc-800 text-zinc-300 rounded-full text-xs capitalize">{m}</span>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          {exercise.instructions?.length > 0 && (
            <div>
              <h2 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-3">Instructions</h2>
              <ol className="space-y-3">
                {exercise.instructions.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    <p className="text-zinc-300 text-sm leading-relaxed">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Add to workout */}
          <div className="mt-8 pt-6 border-t border-zinc-800">
            <Link
              href={`/workouts/new?exercise=${exercise.id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium text-sm transition-colors"
            >
              <Dumbbell size={16} />
              Add to workout
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function Badge({ icon, label, color }: { icon: React.ReactNode | null; label: string; color: "orange" | "blue" | "green" }) {
  const colors = {
    orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    green: "bg-green-500/10 text-green-400 border-green-500/20",
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border capitalize ${colors[color]}`}>
      {icon}
      {label}
    </span>
  )
}
