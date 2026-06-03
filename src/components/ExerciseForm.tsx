"use client"

import { useState } from "react"
import { Plus, Trash2, Loader2 } from "lucide-react"

export const BODY_PARTS = ["abs", "arms", "back", "cardio", "chest", "legs", "shoulders"]
export const EQUIPMENT_OPTIONS = ["barbell", "body weight", "cable", "dumbbell", "kettlebell", "machine"]

export interface ExerciseFormData {
  name: string
  bodyPart: string
  target: string
  equipment: string
  instructions: string[]
  secondaryMuscles: string[]
  description: string
}

interface Props {
  defaultValues?: Partial<ExerciseFormData>
  onSubmit: (data: ExerciseFormData) => Promise<void>
  submitLabel?: string
}

export default function ExerciseForm({ defaultValues, onSubmit, submitLabel = "Save" }: Props) {
  const [name, setName] = useState(defaultValues?.name ?? "")
  const [bodyPart, setBodyPart] = useState(defaultValues?.bodyPart ?? "chest")
  const [target, setTarget] = useState(defaultValues?.target ?? "")
  const [equipment, setEquipment] = useState(defaultValues?.equipment ?? "barbell")
  const [instructions, setInstructions] = useState<string[]>(
    defaultValues?.instructions?.length ? defaultValues.instructions : [""]
  )
  const [secondaryMuscles, setSecondaryMuscles] = useState(
    defaultValues?.secondaryMuscles?.join(", ") ?? ""
  )
  const [description, setDescription] = useState(defaultValues?.description ?? "")
  const [saving, setSaving] = useState(false)

  function addStep() {
    setInstructions(prev => [...prev, ""])
  }

  function removeStep(i: number) {
    setInstructions(prev => prev.filter((_, idx) => idx !== i))
  }

  function updateStep(i: number, val: string) {
    setInstructions(prev => prev.map((s, idx) => (idx === i ? val : s)))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await onSubmit({
        name: name.trim(),
        bodyPart,
        target: target.trim(),
        equipment,
        instructions: instructions.map(s => s.trim()).filter(Boolean),
        secondaryMuscles: secondaryMuscles.split(",").map(s => s.trim()).filter(Boolean),
        description: description.trim(),
      })
    } finally {
      setSaving(false)
    }
  }

  const inputClass = "w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
  const labelClass = "block text-xs font-medium text-zinc-400 mb-1.5"

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={labelClass}>Name *</label>
        <input
          required
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Barbell Bench Press"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Body part *</label>
          <select
            value={bodyPart}
            onChange={e => setBodyPart(e.target.value)}
            className={inputClass}
          >
            {BODY_PARTS.map(p => (
              <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Equipment *</label>
          <select
            value={equipment}
            onChange={e => setEquipment(e.target.value)}
            className={inputClass}
          >
            {EQUIPMENT_OPTIONS.map(eq => (
              <option key={eq} value={eq}>{eq.charAt(0).toUpperCase() + eq.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Target muscle *</label>
        <input
          required
          value={target}
          onChange={e => setTarget(e.target.value)}
          placeholder="e.g. pectorals"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Instructions</label>
        <div className="space-y-2">
          {instructions.map((step, i) => (
            <div key={i} className="flex gap-2 items-center">
              <span className="w-5 text-center text-xs text-zinc-500 shrink-0">{i + 1}</span>
              <input
                value={step}
                onChange={e => updateStep(i, e.target.value)}
                placeholder={`Step ${i + 1}`}
                className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm"
              />
              {instructions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeStep(i)}
                  className="text-zinc-600 hover:text-red-400 transition-colors shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addStep}
          className="mt-2 flex items-center gap-1.5 text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors"
        >
          <Plus size={14} /> Add step
        </button>
      </div>

      <div>
        <label className={labelClass}>
          Secondary muscles <span className="text-zinc-600">(comma-separated)</span>
        </label>
        <input
          value={secondaryMuscles}
          onChange={e => setSecondaryMuscles(e.target.value)}
          placeholder="e.g. triceps, front delts"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>
          Description <span className="text-zinc-600">(optional)</span>
        </label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          placeholder="Brief description..."
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {saving && <Loader2 size={16} className="animate-spin" />}
        {saving ? "Saving..." : submitLabel}
      </button>
    </form>
  )
}
