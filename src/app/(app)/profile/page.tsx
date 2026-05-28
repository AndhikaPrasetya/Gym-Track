"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { User, Save, LogOut } from "lucide-react"
import { logout } from "@/app/auth/actions"

interface Profile {
  full_name: string | null
  username: string | null
  height_cm: number | null
  weight_kg: number | null
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>({ full_name: "", username: "", height_cm: null, weight_kg: null })
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      setEmail(user.email || "")
      supabase.from("profiles").select("full_name, username, height_cm, weight_kg").eq("id", user.id).maybeSingle().then(({ data }) => {
        const row = data as { full_name: string | null; username: string | null; height_cm: number | null; weight_kg: number | null } | null
        if (row) setProfile({
          full_name: row.full_name || "",
          username: row.username || "",
          height_cm: row.height_cm,
          weight_kg: row.weight_kg,
        })
        setLoading(false)
      })
    })
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from("profiles").update({
      full_name: profile.full_name || null,
      username: profile.username || null,
      height_cm: profile.height_cm,
      weight_kg: profile.weight_kg,
      updated_at: new Date().toISOString(),
    }).eq("id", user.id)

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) return <div className="animate-pulse text-zinc-600 py-20 text-center">Loading...</div>

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="text-zinc-400 text-sm mt-1">Manage your account details</p>
      </div>

      {/* Avatar placeholder */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
          <User size={28} className="text-zinc-500" />
        </div>
        <div>
          <p className="text-white font-semibold">{profile.full_name || "—"}</p>
          <p className="text-zinc-400 text-sm">{email}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
          <h2 className="text-white font-semibold text-sm">Account info</h2>

          <div>
            <label className="block text-zinc-400 text-xs font-medium mb-1.5">Full name</label>
            <input
              value={profile.full_name || ""}
              onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))}
              className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-xs font-medium mb-1.5">Username</label>
            <input
              value={profile.username || ""}
              onChange={e => setProfile(p => ({ ...p, username: e.target.value }))}
              className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="@username"
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-xs font-medium mb-1.5">Email</label>
            <input
              value={email}
              disabled
              className="w-full px-3 py-2.5 bg-zinc-800/50 border border-zinc-800 rounded-lg text-zinc-500 text-sm cursor-not-allowed"
            />
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
          <h2 className="text-white font-semibold text-sm">Body stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-400 text-xs font-medium mb-1.5">Height (cm)</label>
              <input
                type="number"
                value={profile.height_cm ?? ""}
                onChange={e => setProfile(p => ({ ...p, height_cm: e.target.value ? parseFloat(e.target.value) : null }))}
                className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="175"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-xs font-medium mb-1.5">Weight (kg)</label>
              <input
                type="number"
                value={profile.weight_kg ?? ""}
                onChange={e => setProfile(p => ({ ...p, weight_kg: e.target.value ? parseFloat(e.target.value) : null }))}
                className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="75"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors ${
            saved ? "bg-green-500 text-white" : "bg-orange-500 hover:bg-orange-600 text-white"
          } disabled:opacity-60`}
        >
          <Save size={16} />
          {saved ? "Saved!" : saving ? "Saving..." : "Save changes"}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-zinc-800">
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors font-medium"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </form>
      </div>
    </div>
  )
}
