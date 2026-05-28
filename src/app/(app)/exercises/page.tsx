"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Filter, X, ChevronRight } from "lucide-react"
import type { Exercise } from "@/lib/exercisedb"

const BODY_PART_COLORS: Record<string, string> = {
  abs: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  arms: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  back: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  calves: "bg-green-500/10 text-green-400 border-green-500/20",
  cardio: "bg-red-500/10 text-red-400 border-red-500/20",
  chest: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  legs: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  shoulders: "bg-pink-500/10 text-pink-400 border-pink-500/20",
}

const BODY_PART_BG: Record<string, string> = {
  abs: "from-zinc-900 to-zinc-800/30 text-zinc-400/20",
  arms: "from-indigo-950 to-indigo-900/30 text-indigo-400/20",
  back: "from-blue-950 to-blue-900/30 text-blue-400/20",
  calves: "from-green-950 to-green-900/30 text-green-400/20",
  cardio: "from-red-950 to-red-900/30 text-red-400/20",
  chest: "from-orange-950 to-orange-900/30 text-orange-400/20",
  legs: "from-teal-950 to-teal-900/30 text-teal-400/20",
  shoulders: "from-pink-950 to-pink-900/30 text-pink-400/20",
}

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [bodyParts, setBodyParts] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedPart, setSelectedPart] = useState("")
  const [hasMore, setHasMore] = useState(true)
  const [inputValue, setInputValue] = useState("")

  const LIMIT = 20

  useEffect(() => {
    fetch("/api/exercises/bodyparts")
      .then(r => r.json())
      .then(setBodyParts)
  }, [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const params = new URLSearchParams({ limit: String(LIMIT), offset: "0" })
        if (search) params.set("q", search)
        if (selectedPart) params.set("bodyPart", selectedPart)
        const res = await fetch(`/api/exercises?${params}`)
        const data: Exercise[] = await res.json()
        if (!cancelled) {
          setExercises(data)
          setHasMore(data.length === LIMIT)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [search, selectedPart])

  async function loadMore() {
    setLoading(true)
    try {
      const params = new URLSearchParams({ limit: String(LIMIT), offset: String(exercises.length) })
      if (search) params.set("q", search)
      if (selectedPart) params.set("bodyPart", selectedPart)
      const res = await fetch(`/api/exercises?${params}`)
      const data: Exercise[] = await res.json()
      setExercises(prev => [...prev, ...data])
      setHasMore(data.length === LIMIT)
    } finally {
      setLoading(false)
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setSearch(inputValue)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Exercise Library</h1>
        <p className="text-zinc-400 text-sm mt-1">Browse exercises with instructions and muscle diagrams</p>
      </div>

      {/* Search & filter */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Search exercises..."
            className="w-full pl-9 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
          />
        </div>
        <button type="submit" className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors">
          Search
        </button>
      </form>

      {/* Body part filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        <button
          onClick={() => setSelectedPart("")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${selectedPart === "" ? "bg-orange-500/10 text-orange-400 border-orange-500/20" : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-600"}`}
        >
          All
        </button>
        {bodyParts.map(part => (
          <button
            key={part}
            onClick={() => setSelectedPart(part === selectedPart ? "" : part)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors capitalize ${selectedPart === part ? (BODY_PART_COLORS[part] || "bg-orange-500/10 text-orange-400 border-orange-500/20") : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-600"}`}
          >
            {part}
          </button>
        ))}
      </div>

      {/* Active filters */}
      {(search || selectedPart) && (
        <div className="flex gap-2 mb-4">
          {search && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300">
              <Filter size={12} /> &quot;{search}&quot;
              <button onClick={() => { setSearch(""); setInputValue("") }} className="ml-1 text-zinc-500 hover:text-zinc-200">
                <X size={12} />
              </button>
            </span>
          )}
          {selectedPart && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300 capitalize">
              {selectedPart}
              <button onClick={() => setSelectedPart("")} className="ml-1 text-zinc-500 hover:text-zinc-200">
                <X size={12} />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Grid */}
      {exercises.length === 0 && !loading ? (
        <div className="text-center py-16 text-zinc-500">No exercises found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {exercises.map(ex => (
            <ExerciseCard key={ex.id} exercise={ex} />
          ))}
          {loading && Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden animate-pulse">
              <div className="bg-zinc-800 h-44" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-zinc-800 rounded w-3/4" />
                <div className="h-3 bg-zinc-800 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {hasMore && !loading && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            className="px-6 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-zinc-300 rounded-lg text-sm font-medium transition-colors"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  )
}

function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const colorClass = BODY_PART_COLORS[exercise.bodyPart] || "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
  const bgClass = BODY_PART_BG[exercise.bodyPart] || "from-zinc-900 to-zinc-800/30 text-zinc-400/20"
  return (
    <Link
      href={`/exercises/${exercise.id}`}
      className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-600 transition-colors group"
    >
      <div className={`relative h-44 flex items-center justify-center overflow-hidden bg-linear-to-br ${bgClass}`}>
        {exercise.gifUrl ? (
          <Image src={exercise.gifUrl} alt={exercise.name} fill className="object-cover" unoptimized />
        ) : (
          <span className="text-7xl font-black uppercase tracking-tighter select-none leading-none">
            {exercise.bodyPart.slice(0, 2)}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-white font-medium text-sm capitalize leading-snug mb-2 group-hover:text-orange-400 transition-colors line-clamp-2">
          {exercise.name}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${colorClass}`}>
            {exercise.bodyPart}
          </span>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-400 capitalize">
            {exercise.equipment}
          </span>
        </div>
        <div className="flex items-center gap-1 mt-2 text-zinc-500 text-xs">
          <span className="capitalize">{exercise.target}</span>
          <ChevronRight size={12} className="ml-auto text-zinc-600 group-hover:text-zinc-400 transition-colors" />
        </div>
      </div>
    </Link>
  )
}
