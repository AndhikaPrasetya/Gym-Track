"use client"

import { useState } from "react"
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts"
import { createClient } from "@/lib/supabase/client"
import { Plus, Save } from "lucide-react"

interface Props {
  workoutsByWeek: Array<{ week: string; count: number }>
  prsByExercise: Record<string, Array<{ date: string; weight: number; reps: number }>>
  measurements: Array<{ date: string; weight: number | null; bodyFat: number | null }>
  userId: string
}

export default function ProgressCharts({ workoutsByWeek, prsByExercise, measurements, userId }: Props) {
  const [selectedExercise, setSelectedExercise] = useState(Object.keys(prsByExercise)[0] || "")
  const [localMeasurements, setLocalMeasurements] = useState(measurements)
  const [showMeasForm, setShowMeasForm] = useState(false)
  const [measForm, setMeasForm] = useState({ weight: "", bodyFat: "" })
  const [saving, setSaving] = useState(false)

  const exerciseData = prsByExercise[selectedExercise] || []

  async function saveMeasurement() {
    if (!measForm.weight && !measForm.bodyFat) return
    setSaving(true)
    const supabase = createClient()
    const now = new Date().toISOString()
    const { data } = await supabase
      .from("body_measurements")
      .insert({
        user_id: userId,
        weight_kg: measForm.weight ? parseFloat(measForm.weight) : null,
        body_fat_percent: measForm.bodyFat ? parseFloat(measForm.bodyFat) : null,
        measured_at: now,
      })
      .select()
      .single()

    if (data) {
      setLocalMeasurements(prev => [...prev, {
        date: now.split("T")[0],
        weight: data.weight_kg,
        bodyFat: data.body_fat_percent,
      }])
    }
    setMeasForm({ weight: "", bodyFat: "" })
    setShowMeasForm(false)
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      {/* Workout frequency */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-1">Workout Frequency</h2>
        <p className="text-zinc-500 text-xs mb-5">Workouts per week</p>
        {workoutsByWeek.length === 0 ? (
          <EmptyChart message="No workouts logged yet" />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={workoutsByWeek} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis
                dataKey="week"
                stroke="#52525b"
                tick={{ fill: "#71717a", fontSize: 11 }}
                tickFormatter={v => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              />
              <YAxis stroke="#52525b" tick={{ fill: "#71717a", fontSize: 11 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px", color: "#fff" }}
                labelFormatter={v => `Week of ${new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
              />
              <Bar dataKey="count" name="Workouts" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Strength progress */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-white font-semibold">Strength Progress</h2>
          {Object.keys(prsByExercise).length > 0 && (
            <select
              value={selectedExercise}
              onChange={e => setSelectedExercise(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-orange-500 capitalize"
            >
              {Object.keys(prsByExercise).map(ex => (
                <option key={ex} value={ex} className="capitalize">{ex}</option>
              ))}
            </select>
          )}
        </div>
        <p className="text-zinc-500 text-xs mb-5">Max weight (kg) per exercise over time</p>
        {exerciseData.length === 0 ? (
          <EmptyChart message="No personal records yet — log some workouts!" />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={exerciseData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="date" stroke="#52525b" tick={{ fill: "#71717a", fontSize: 11 }} />
              <YAxis stroke="#52525b" tick={{ fill: "#71717a", fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px", color: "#fff" }}
              />
              <Line type="monotone" dataKey="weight" name="Weight (kg)" stroke="#f97316" strokeWidth={2} dot={{ fill: "#f97316", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Body measurements */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-white font-semibold">Body Weight</h2>
          <button
            onClick={() => setShowMeasForm(!showMeasForm)}
            className="flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 font-medium"
          >
            <Plus size={14} />
            Log measurement
          </button>
        </div>
        <p className="text-zinc-500 text-xs mb-4">Body weight over time</p>

        {showMeasForm && (
          <div className="mb-5 p-3 bg-zinc-800 rounded-xl space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 text-xs mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={measForm.weight}
                  onChange={e => setMeasForm(f => ({ ...f, weight: e.target.value }))}
                  placeholder="75.5"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-xs mb-1">Body fat (%)</label>
                <input
                  type="number"
                  value={measForm.bodyFat}
                  onChange={e => setMeasForm(f => ({ ...f, bodyFat: e.target.value }))}
                  placeholder="18.5"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>
            <button
              onClick={saveMeasurement}
              disabled={saving}
              className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm transition-colors flex items-center justify-center gap-1.5 font-medium"
            >
              <Save size={14} />
              {saving ? "Saving..." : "Save measurement"}
            </button>
          </div>
        )}

        {localMeasurements.filter(m => m.weight != null).length === 0 ? (
          <EmptyChart message="Log your first body measurement above" />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={localMeasurements.filter(m => m.weight != null)}
              margin={{ top: 0, right: 0, bottom: 0, left: -20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="date" stroke="#52525b" tick={{ fill: "#71717a", fontSize: 11 }} />
              <YAxis stroke="#52525b" tick={{ fill: "#71717a", fontSize: 11 }} domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px", color: "#fff" }}
              />
              <Line type="monotone" dataKey="weight" name="Weight (kg)" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 4 }} />
              <Line type="monotone" dataKey="bodyFat" name="Body fat (%)" stroke="#22c55e" strokeWidth={2} dot={{ fill: "#22c55e", r: 4 }} />
              <Legend wrapperStyle={{ color: "#71717a", fontSize: "12px" }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* PRs table */}
      {Object.keys(prsByExercise).length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-4">All-time Personal Records</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left text-zinc-500 font-medium pb-3 pr-4">Exercise</th>
                  <th className="text-right text-zinc-500 font-medium pb-3 pr-4">Max Weight</th>
                  <th className="text-right text-zinc-500 font-medium pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {Object.entries(prsByExercise).map(([name, records]) => {
                  const best = records.sort((a, b) => b.weight - a.weight)[0]
                  return (
                    <tr key={name}>
                      <td className="py-3 pr-4 text-white capitalize font-medium">{name}</td>
                      <td className="py-3 pr-4 text-right text-orange-400 font-semibold">{best.weight} kg</td>
                      <td className="py-3 text-right text-zinc-500">{best.date}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-32 text-zinc-600 text-sm">{message}</div>
  )
}
